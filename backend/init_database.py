#!/usr/bin/env python3
"""
Database initialization script for Eye Health API
Creates the user_health table if it doesn't exist
"""
import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DB_URL")
if not DB_URL:
    print("DB_URL not found in .env file")
    print("Please create a .env file with your database connection string")
    print("Example: DB_URL=mysql+pymysql://username:password@localhost:3306/database_name")
    exit(1)

try:
    engine = create_engine(DB_URL)
    
    with engine.connect() as conn:
        # Create user_health table if it doesn't exist
        create_table_sql = text("""
            CREATE TABLE IF NOT EXISTS user_health (
                id INT AUTO_INCREMENT PRIMARY KEY,
                age INT NOT NULL,
                gender VARCHAR(10) NOT NULL,
                screen_time_hours DECIMAL(4,2) NOT NULL,
                physical_activity_hours DECIMAL(4,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.execute(create_table_sql)
        conn.commit()
        print("user_health table created successfully")
        
        # Check if table exists and show structure
        result = conn.execute(text("DESCRIBE user_health"))
        columns = result.fetchall()
        print("\nTable structure:")
        for col in columns:
            print(f"  {col[0]} - {col[1]} - {col[2]}")
        
        # Insert sample data if table is empty
        count_result = conn.execute(text("SELECT COUNT(*) FROM user_health"))
        count = count_result.fetchone()[0]
        
        if count == 0:
            print("\nInserting sample data...")
            sample_data = [
                (25, "Male", 8.5, 2.0),
                (30, "Female", 6.0, 3.5),
                (35, "Male", 10.0, 1.0),
                (28, "Female", 4.0, 4.0),
                (40, "Male", 7.5, 2.5)
            ]
            
            for data in sample_data:
                conn.execute(text("""
                    INSERT INTO user_health (age, gender, screen_time_hours, physical_activity_hours)
                    VALUES (:age, :gender, :screen_time_hours, :physical_activity_hours)
                """), {
                    "age": data[0],
                    "gender": data[1],
                    "screen_time_hours": data[2],
                    "physical_activity_hours": data[3]
                })
            
            conn.commit()
            print(f"Inserted {len(sample_data)} sample records")
        else:
            print(f"Table already contains {count} records")
            
        # Show sample data
        print("\nSample data:")
        result = conn.execute(text("SELECT * FROM user_health LIMIT 5"))
        rows = result.fetchall()
        for row in rows:
            print(f"  ID: {row[0]}, Age: {row[1]}, Gender: {row[2]}, Screen: {row[3]}h, Activity: {row[4]}h")
            
except Exception as e:
    print(f"Database initialization failed: {e}")
    print("\nTroubleshooting:")
    print("1. Make sure MySQL server is running")
    print("2. Check your database credentials in .env file")
    print("3. Ensure the database exists")
    print("4. Verify network connectivity")
