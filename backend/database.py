import sqlite3
from pathlib import Path


DB_PATH = Path(__file__).parent / "app.db"


def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS videos (
                uri TEXT PRIMARY KEY,
                filename TEXT NOT NULL,
                mp4 BLOB NOT NULL,
                created_at DATETIME
                    DEFAULT CURRENT_TIMESTAMP
            )
        """)

        conn.commit()


def video_exists(uri: str) -> bool:
    with sqlite3.connect(DB_PATH) as conn:
        row = conn.execute(
            """
            SELECT 1
            FROM videos
            WHERE uri = ?
            """,
            (uri,)
        ).fetchone()

    return row is not None


def save_video(
    uri: str,
    filename: str,
    video_bytes: bytes
):
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            INSERT INTO videos (
                uri,
                filename,
                mp4
            )
            VALUES (?, ?, ?)
            """,
            (
                uri,
                filename,
                video_bytes
            )
        )

        conn.commit()

