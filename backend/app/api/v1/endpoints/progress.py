from fastapi import APIRouter

router = APIRouter()


@router.get("/patient/{patient_id}")
def get_patient_progress(patient_id: str):
    """Get progress summary for patient"""
    return {"message": f"Get progress for patient {patient_id} - to be implemented"}


@router.get("/patient/{patient_id}/chart")
def get_progress_chart_data(patient_id: str):
    """Get chart data for patient progress"""
    return {"message": f"Get chart data for patient {patient_id} - to be implemented"}
