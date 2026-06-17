import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("DATABASE_URL is not set!")
    exit(1)

print("Connecting to database...")
engine = create_engine(DATABASE_URL)

try:
    with engine.begin() as conn:
        print("Adding status column to ideas table...")
        # Postgres supports ALTER TABLE ADD COLUMN IF NOT EXISTS
        conn.execute(text("ALTER TABLE ideas ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'concept' NOT NULL;"))
        print("Migration query executed successfully!")
except Exception as e:
    print(f"An error occurred during migration: {e}")
    exit(1)

print("Migration successful! Status column added (or already exists).")
