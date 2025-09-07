from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from db import get_db
import joblib
import numpy as np
from pydantic import BaseModel
from typing import Optional
import os

app = FastAPI(title="Eye Health API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class EyeHealthRequest(BaseModel):
    age: int
    gender: str
    screen_time_hours: float
    physical_activity_hours: float

class EyeHealthResponse(BaseModel):
    risk_level: int  # 0=Low, 1=Medium, 2=High
    risk_level_name: str
    confidence: float
    recommendations: list[str]

# Load models
try:
    eye_model = joblib.load("eye_multiclass_model.pkl")
    gender_encoder = joblib.load("le_gender.pkl")
    print("✅ Models loaded successfully")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    eye_model = None
    gender_encoder = None

@app.get("/")
def root():
    return {"message": "Eye Health API is running"}

@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "message": "Eye Health API is healthy",
        "models_loaded": eye_model is not None
    }

@app.get("/health/db")
def db_health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"db": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e!s}")

@app.get("/tables")
def list_tables(db: Session = Depends(get_db)):
    try:
        rows = db.execute(text("SHOW TABLES")).fetchall()
        return {"tables": [r[0] for r in rows]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing tables: {e}")

@app.get("/peek")
def peek_table(
    table: str = Query(..., pattern=r"^[A-Za-z0-9_]+$"),
    limit: int = 10,
    db: Session = Depends(get_db),
):
    try:
        sql = text(f"SELECT * FROM `{table}` LIMIT :limit")
        rows = db.execute(sql, {"limit": limit}).mappings().all()
        return {"rows": [dict(r) for r in rows]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error peeking table: {e}")

@app.post("/api/eye-health/analyze", response_model=EyeHealthResponse)
def analyze_eye_health(request: EyeHealthRequest):
    """
    Analyze eye health risk based on user input
    """
    if eye_model is None or gender_encoder is None:
        raise HTTPException(status_code=500, detail="Models not loaded")
    
    try:
        # Prepare features
        gender_encoded = gender_encoder.transform([request.gender])[0]
        features = np.array([[
            request.age,
            gender_encoded,
            request.screen_time_hours,
            request.physical_activity_hours
        ]])
        
        # Predict risk level
        prediction = eye_model.predict(features)[0]
        probabilities = eye_model.predict_proba(features)[0]
        confidence = float(max(probabilities))
        
        # Map prediction to risk level names
        risk_names = {0: "Low", 1: "Medium", 2: "High"}
        risk_level_name = risk_names[prediction]
        
        # Generate recommendations based on risk level
        recommendations = generate_recommendations(prediction, request.screen_time_hours)
        
        return EyeHealthResponse(
            risk_level=prediction,
            risk_level_name=risk_level_name,
            confidence=confidence,
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

def generate_recommendations(risk_level: int, screen_time: float) -> list[str]:
    """Generate personalized recommendations based on risk level"""
    base_recommendations = [
        "Follow the 20-20-20 rule: Look at something 20 feet away for 20 seconds every 20 minutes",
        "Adjust monitor brightness to match your surroundings",
        "Keep your monitor 50-70 cm away from your eyes",
        "Schedule regular eye examinations",
        "Use blue light filtering glasses or screen filters",
        "Ensure adequate natural lighting in your workspace",
        "Practice regular eye relaxation exercises",
        "Maintain a balanced diet rich in eye-healthy nutrients (vitamins A, C, E, zinc, omega-3)"
    ]
    
    # Select 3 random recommendations
    import random
    selected = random.sample(base_recommendations, 3)
    
    # Add risk-specific recommendations
    if risk_level == 2:  # High risk
        selected.insert(0, f"🚨 HIGH RISK: Your screen time of {screen_time} hours/day is concerning. Consider reducing to under 8 hours immediately.")
    elif risk_level == 1:  # Medium risk
        selected.insert(0, f"⚠️ MODERATE: Your screen time of {screen_time} hours/day is within acceptable range but could be improved.")
    else:  # Low risk
        selected.insert(0, f"✅ EXCELLENT: Your screen time of {screen_time} hours/day is well within healthy limits.")
    
    return selected

@app.post("/api/eye-health/save-user-data")
def save_user_data(request: EyeHealthRequest, db: Session = Depends(get_db)):
    """
    Save user health data to database
    """
    try:
        # Insert user data into database
        sql = text("""
            INSERT INTO user_health (age, gender, screen_time_hours, physical_activity_hours)
            VALUES (:age, :gender, :screen_time_hours, :physical_activity_hours)
        """)
        
        db.execute(sql, {
            "age": request.age,
            "gender": request.gender,
            "screen_time_hours": request.screen_time_hours,
            "physical_activity_hours": request.physical_activity_hours
        })
        db.commit()
        
        return {"message": "User data saved successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error saving user data: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=3001)
