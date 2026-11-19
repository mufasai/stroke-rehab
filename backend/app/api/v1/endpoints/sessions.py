from fastapi import APIRouter

router = APIRouter()


@router.post("/")
def create_session():
    """Start new therapy session"""
    return {"message": "Create session endpoint - to be implemented"}


@router.get("/{session_id}")
def get_session(session_id: str):
    """Get session details"""
    return {"message": f"Get session {session_id} - to be implemented"}


@router.put("/{session_id}/complete")
def complete_session(session_id: str):
    """Mark session as completed"""
    return {"message": f"Complete session {session_id} - to be implemented"}
