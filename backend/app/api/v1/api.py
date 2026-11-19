from fastapi import APIRouter
from app.api.v1.endpoints import auth, patients, sessions, repetitions, progress

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(patients.router, prefix="/patients", tags=["Patients"])
api_router.include_router(sessions.router, prefix="/sessions", tags=["Sessions"])
api_router.include_router(repetitions.router, prefix="/repetitions", tags=["Repetitions"])
api_router.include_router(progress.router, prefix="/progress", tags=["Progress"])
