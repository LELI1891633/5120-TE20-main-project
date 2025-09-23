# app.py
import os, random, joblib, numpy as np
from pathlib import Path
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text, select, func
from sqlalchemy.orm import Session
from db import get_db
from models import StressTip, BreakStep
import logging

logger = logging.getLogger("officeease")
logger.setLevel(logging.INFO)
# --- App & CORS ---
app = FastAPI(title="Backend API", version="1.0.0")
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed_origins if o.strip()],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Schemas ----------
class TipOut(BaseModel):
    id: int
    text: str
    category: Optional[str] = "stress"

class BreakStepOut(BaseModel):
    id: int
    title: str
    cue: str
    duration: int
    sequence: int

class EyeHealthRequest(BaseModel):
    age: int
    gender: str
    screen_time_hours: float
    physical_activity_hours: float

class EyeHealthResponse(BaseModel):
    risk_level: int
    risk_level_name: str
    confidence: float
    recommendations: list[str]

# ---------- Health ----------
@app.get("/")
def root():
    return {"message": "API is running"}

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/health/db")
def db_health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"db": "ok"}

@app.get("/tables")
def list_tables(db: Session = Depends(get_db)):
    rows = db.execute(text("SHOW TABLES")).fetchall()
    return {"tables": [r[0] for r in rows]}

@app.get("/peek")
def peek_table(
    table: str = Query(..., pattern=r"^[A-Za-z0-9_]+$"),
    limit: int = 10,
    db: Session = Depends(get_db),
):
    rows = db.execute(text(f"SELECT * FROM `{table}` LIMIT :limit"), {"limit": limit}).mappings().all()
    return {"rows": [dict(r) for r in rows]}

# ---------- OfficeEase ----------
@app.get("/stress/suggestion")
def stress_suggestion(db: Session = Depends(get_db)):
    row = db.execute(text("""
        SELECT id, site_name, suggestion_name, steps, site_link
        FROM OfficeEase.it2_stress_relief_suggestions
        ORDER BY RAND() LIMIT 1
    """)).mappings().first()
    if not row:
        raise HTTPException(404, "No suggestions found")
    return dict(row)


@app.get("/stretch/random-set")
def stretch_random_set(db: Session = Depends(get_db)):
    try:
        pick = db.execute(text("""
            SELECT site_number
            FROM OfficeEase.it2_stretch_challenge
            GROUP BY site_number
            ORDER BY RAND()
            LIMIT 1
        """)).first()
        if not pick:
            logger.warning("No site_number groups found in it2_stretch_challenge")
            return {"site_number": None, "items": []}

        site_number = pick[0]
        rows = db.execute(text("""
            SELECT site_name, area_name, steps, site_link, site_number
            FROM OfficeEase.it2_stretch_challenge
            WHERE site_number = :sn
            ORDER BY area_name
        """), {"sn": site_number}).mappings().all()
        return {"site_number": site_number, "items": [dict(r) for r in rows]}
    except Exception as e:
        logger.exception("Error in /stretch/random-set")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.get("/guidelines")
def guidelines_all(db: Session = Depends(get_db)):
    rows = db.execute(text("SELECT * FROM OfficeEase.it2_physical_guidelines")).mappings().all()
    return [dict(r) for r in rows]

@app.get("/workday")
def workday_all(db: Session = Depends(get_db)):
    rows = db.execute(text("SELECT * FROM OfficeEase.it2_workday_activity")).mappings().all()
    return [dict(r) for r in rows]

# ---------- Tips ----------
@app.get("/tips/random", response_model=TipOut)
def tips_random(db: Session = Depends(get_db)):
    q = select(StressTip).order_by(func.rand()).limit(1)
    row = db.execute(q).scalars().first()
    if not row:
        raise HTTPException(404, "No tips found")
    return TipOut(id=row.id, text=row.text, category=getattr(row, "category", "stress"))

@app.get("/tips", response_model=List[TipOut])
def tips_list(limit: int = 10, category: Optional[str] = None, db: Session = Depends(get_db)):
    q = select(StressTip)
    if category:
        q = q.where(StressTip.category == category)
    q = q.limit(min(max(limit, 1), 50))
    rows = db.execute(q).scalars().all()
    return [TipOut(id=r.id, text=r.text, category=getattr(r, "category", "stress")) for r in rows]

# ---------- Break steps ----------
@app.get("/breaks", response_model=List[BreakStepOut])
def breaks_list(db: Session = Depends(get_db)):
    q = select(BreakStep).order_by(BreakStep.sequence.asc(), BreakStep.id.asc())
    rows = db.execute(q).scalars().all()
    if not rows:
        raise HTTPException(404, "No break steps found")
    return [BreakStepOut(
        id=r.id, title=r.title, cue=r.cue,
        duration=int(getattr(r, "duration_sec", 0)),
        sequence=int(getattr(r, "sequence", 0)),
    ) for r in rows]

@app.get("/breaks/random", response_model=BreakStepOut)
def breaks_random(db: Session = Depends(get_db)):
    q = select(BreakStep).order_by(func.rand()).limit(1)
    r = db.execute(q).scalars().first()
    if not r:
        raise HTTPException(404, "No break steps found")
    return BreakStepOut(
        id=r.id, title=r.title, cue=r.cue,
        duration=int(getattr(r, "duration_sec", 0)),
        sequence=int(getattr(r, "sequence", 0)),
    )

# ---------- Eye Health ----------
try:
    eye_model = joblib.load("eye_multiclass_model.pkl")
    gender_encoder = joblib.load("le_gender.pkl")
except Exception:
    eye_model, gender_encoder = None, None

@app.post("/api/eye-health/analyze", response_model=EyeHealthResponse)
def analyze_eye_health(request: EyeHealthRequest):
    if eye_model is None or gender_encoder is None:
        raise HTTPException(500, "Models not loaded")
    gender_encoded = gender_encoder.transform([request.gender])[0]
    features = np.array([[request.age, gender_encoded, request.screen_time_hours, request.physical_activity_hours]])
    prediction = int(eye_model.predict(features)[0])
    probabilities = eye_model.predict_proba(features)[0]
    confidence = float(max(probabilities))
    risk_names = {0: "Low", 1: "Medium", 2: "High"}
    return EyeHealthResponse(
        risk_level=prediction,
        risk_level_name=risk_names[prediction],
        confidence=confidence,
        recommendations=generate_recommendations(prediction, request.screen_time_hours),
    )

def generate_recommendations(risk_level: int, screen_time: float) -> list[str]:
    recs = [
        "Follow the 20-20-20 rule",
        "Adjust monitor brightness",
        "Keep monitor 50-70 cm away",
        "Schedule eye exams",
        "Use blue light filter",
        "Ensure natural lighting",
        "Do eye exercises",
        "Eat eye-healthy nutrients"
    ]
    selected = random.sample(recs, 3)
    if risk_level == 2:
        selected.insert(0, f"HIGH RISK: {screen_time}h/day is concerning")
    elif risk_level == 1:
        selected.insert(0, f"MODERATE: {screen_time}h/day could be improved")
    else:
        selected.insert(0, f"EXCELLENT: {screen_time}h/day is healthy")
    return selected

@app.post("/api/eye-health/save-user-data")
def save_user_data(request: EyeHealthRequest, db: Session = Depends(get_db)):
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
