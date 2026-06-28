from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.database import connect_db, close_db
from routers import auth, detect, history

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(
    title="DeepGuard API",
    description="AI-generated content detection API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(detect.router)
app.include_router(history.router)

@app.get("/")
async def root():
    return {"status": "ok", "message": "DeepGuard API running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "version": "1.0.0"}