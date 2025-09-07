import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()  # reads .env

DB_URL = os.getenv("DB_URL")
if not DB_URL:
    raise RuntimeError("DB_URL not set")

engine = create_engine(DB_URL)

with engine.connect() as conn:
    # 1) Ping DB
    conn.execute(text("SELECT 1"))
    print("DB connection OK")

    # 2) Sample rows from your table
    df = pd.read_sql("SELECT * FROM user_health LIMIT 5", conn)
    print("Sample data:")
    print(df)

    # 3) Basic schema check for your pipeline
    expected = {"user_id","age","gender","screen_time_hours","physical_activity_hours"}
    missing = expected - set(df.columns)
    if missing:
        print(f"Missing columns: {missing}")
    else:
        print("Expected columns present")
