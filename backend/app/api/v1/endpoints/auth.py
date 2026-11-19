from fastapi import APIRouter

router = APIRouter()


@router.post("/login")
def login():
    """User login endpoint"""
    return {"message": "Login endpoint - to be implemented"}


@router.post("/register")
def register():
    """User registration endpoint"""
    return {"message": "Register endpoint - to be implemented"}


@router.get("/me")
def get_current_user():
    """Get current user info"""
    return {"message": "Current user endpoint - to be implemented"}
