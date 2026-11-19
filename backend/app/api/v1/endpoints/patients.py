from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def list_patients():
    """List all patients"""
    return {"message": "List patients endpoint - to be implemented"}


@router.post("/")
def create_patient():
    """Create new patient"""
    return {"message": "Create patient endpoint - to be implemented"}


@router.get("/{patient_id}")
def get_patient(patient_id: str):
    """Get patient by ID"""
    return {"message": f"Get patient {patient_id} - to be implemented"}


@router.put("/{patient_id}")
def update_patient(patient_id: str):
    """Update patient"""
    return {"message": f"Update patient {patient_id} - to be implemented"}


@router.delete("/{patient_id}")
def delete_patient(patient_id: str):
    """Delete patient"""
    return {"message": f"Delete patient {patient_id} - to be implemented"}
