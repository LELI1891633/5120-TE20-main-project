
# app.py
# FastAPI backend aligned with it2_ and it3_ AWS tables


import os, random, joblib, numpy as np
from pathlib import Path
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text, select, func
from sqlalchemy.orm import Session
from db import get_db
import logging


# Logger setup

logger = logging.getLogger("officeease")
logger.setLevel(logging.INFO)


# FastAPI + CORS
app = FastAPI(title="OfficeEase Backend", version="2.0.0")

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://v2-it2-officeez.vercel.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed_origins if o.strip()],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health & Utility Endpoints

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
    rows = db.execute(
        text(f"SELECT * FROM `{table}` LIMIT :limit"), {"limit": limit}
    ).mappings().all()
    return {"rows": [dict(r) for r in rows]}


# ------------- IT2: STRESS, STRETCH, WORKDAY, GUIDELINES ----


@app.get("/stress/suggestion")
def stress_suggestion(db: Session = Depends(get_db)):
    row = db.execute(text("""
        SELECT id, site_name, suggestion_name, steps, site_link
        FROM OfficeEase.it2_stress_relief_suggestions
        ORDER BY RAND() LIMIT 1
    """)).mappings().first()
    if not row:
        raise HTTPException(404, "No stress suggestions found")
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
    rows = db.execute(text("""
        SELECT * FROM OfficeEase.it2_physical_guidelines
        ORDER BY survey_year DESC, age_group
    """)).mappings().all()
    return [dict(r) for r in rows]

@app.get("/workday")
def workday_all(db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT * FROM OfficeEase.it2_workday_activity
        ORDER BY survey_year DESC, age_group
    """)).mappings().all()
    return [dict(r) for r in rows]


# ------------- IT3: SOCIAL CONNECTIONS MODULE ---------------


# Connection Score Table
@app.get("/connection-scores")
def connection_scores(db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT id, question, Daily, Weekly, Monthly, Rarely, Never,
               Strongly_agree, Agree, Neutral, Disagree,
               Yes, No, Unsure, Sometimes, Often, Always,
               official_benchmark, mapping_logic, source, source_link
        FROM OfficeEase.it3_connection_score_table
        ORDER BY id ASC
    """)).mappings().all()
    if not rows:
        raise HTTPException(404, "No connection scores found")
    return [dict(r) for r in rows]

#  Loneliness Trend
@app.get("/loneliness-trend")
def loneliness_trend(db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT year, loneliness_percent
        FROM OfficeEase.it3_loneliness_trend
        ORDER BY year ASC
    """)).mappings().all()
    if not rows:
        raise HTTPException(404, "No loneliness data found")
    return [dict(r) for r in rows]

#  Score Calculation Table
@app.get("/connection-bands")
def connection_bands(db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT id, total_score_range, connection_band
        FROM OfficeEase.it3_score_calculation_table
        ORDER BY id ASC
    """)).mappings().all()
    return [dict(r) for r in rows]

#  Social Connection Insights
@app.get("/social-connection-insights")
def social_insights(db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT Source_Table, Metric, Sex, Age_group, Year, Value
        FROM OfficeEase.it3_social_connection_insights
        ORDER BY Year DESC, Metric
    """)).mappings().all()
    if not rows:
        raise HTTPException(404, "No social connection insights found")
    return [dict(r) for r in rows]

#  Volunteering Trend
@app.get("/volunteering-trend")
def volunteering_trend(db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT year, voluntary_work_through_an_organisation, informal_volunteering
        FROM OfficeEase.it3_volunteering_trend
        ORDER BY year ASC
    """)).mappings().all()
    if not rows:
        raise HTTPException(404, "No volunteering data found")
    return [dict(r) for r in rows]
