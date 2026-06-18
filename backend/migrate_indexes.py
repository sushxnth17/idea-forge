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

indexes = [
    # Ideas table indexes
    "CREATE INDEX IF NOT EXISTS idx_ideas_owner_id ON ideas(owner_id);",
    "CREATE INDEX IF NOT EXISTS idx_ideas_parent_idea_id ON ideas(parent_idea_id);",
    "CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at);",
    "CREATE INDEX IF NOT EXISTS idx_ideas_is_public ON ideas(is_public);",
    
    # Comments table indexes
    "CREATE INDEX IF NOT EXISTS idx_comments_idea_id ON comments(idea_id);",
    "CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);",
    
    # Likes table indexes
    "CREATE INDEX IF NOT EXISTS idx_likes_idea_id ON likes(idea_id);",
    "CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);",
    
    # Bookmarks table indexes
    "CREATE INDEX IF NOT EXISTS idx_bookmarks_idea_id ON bookmarks(idea_id);",
    "CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);",
    
    # Follows table indexes
    "CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);",
    "CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);",
    
    # Notifications table indexes
    "CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);"
]

try:
    with engine.begin() as conn:
        print("Creating indexes...")
        for query in indexes:
            print(f"Executing: {query}")
            conn.execute(text(query))
        print("Migration query executed successfully!")
except Exception as e:
    print(f"An error occurred during migration: {e}")
    exit(1)

print("Migration successful! All indexes verified/created.")
