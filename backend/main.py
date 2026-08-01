from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager
from backend.bluesky import (
    session_login,
    get_user_posts,
    get_user_timeline,
)
@asynccontextmanager
async def lifespan(app : FastAPI):
    session_login()
    yield
    print("Session Ended")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/posts")
async def posts():
    return get_user_posts()

@app.get("/timeline")
async def timeline(video_only: bool = False):
    return get_user_timeline(video_only=video_only)

