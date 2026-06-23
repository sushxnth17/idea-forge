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

queries = [
    """
    CREATE TABLE IF NOT EXISTS remix_suggestions (
        id SERIAL PRIMARY KEY,
        idea_id INTEGER NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
        title VARCHAR NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    """,
    "CREATE INDEX IF NOT EXISTS idx_remix_suggestions_idea_id ON remix_suggestions(idea_id);"
]

try:
    with engine.begin() as conn:
        print("Creating remix_suggestions table and index...")
        for query in queries:
            print(f"Executing: {query.strip()}")
            conn.execute(text(query))
        print("Migration query executed successfully!")
except Exception as e:
    print(f"An error occurred during migration: {e}")
    exit(1)

print("Migration successful! remix_suggestions table created/verified.")
