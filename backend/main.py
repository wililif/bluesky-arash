from fastapi import FastAPI
from contextlib import asynccontextmanager
from bluesky import session_login, get_user_posts, get_user_timeline

@asynccontextmanager
async def lifespan(app : FastAPI):
    session_login()
    yield
    print("Session Ended")

app = FastAPI(lifespan=lifespan)

@app.get("/posts")
async def posts():
    return get_user_posts()

@app.get("/timeline")
async def timeline():
    return get_user_timeline()
