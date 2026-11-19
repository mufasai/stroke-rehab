from fastapi import APIRouter

router = APIRouter()


@router.post("/")
def create_repetition():
    """Add repetition data to session"""
    return {"message": "Create repetition endpoint - to be implemented"}


@router.get("/session/{session_id}")
def get_session_repetitions(session_id: str):
    """Get all repetitions in a session"""
    return {"message": f"Get repetitions for session {session_id} - to be implemented"}
