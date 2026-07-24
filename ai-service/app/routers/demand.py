from fastapi import APIRouter
from app.schemas import DemandRequest, DemandResponse
from app.models.demand_predictor import demand_predictor

router = APIRouter(prefix="/api/v1/demand", tags=["demand"])

@router.post("/predict", response_model=DemandResponse)
def predict_demand(req: DemandRequest):
    return demand_predictor.predict_demand(
        city=req.city,
        hour=req.hour,
        day_of_week=req.dayOfWeek
    )
