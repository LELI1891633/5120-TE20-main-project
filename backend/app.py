from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.orm import Session
from db import get_db

app = FastAPI(title="Backend API", version="1.0.0")

@app.get("/")
def root():
    return {"message": "API is running"}

@app.get("/health/db")
def db_health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"db": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e!s}")

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
    sql = text(f"SELECT * FROM `{table}` LIMIT :limit")
    rows = db.execute(sql, {"limit": limit}).mappings().all()
    return {"rows": [dict(r) for r in rows]}
