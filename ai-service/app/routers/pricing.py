from fastapi import APIRouter
from app.schemas import PricingRequest, PricingResponse
from app.models.dynamic_pricing import pricing_engine

router = APIRouter(prefix="/api/v1/pricing", tags=["pricing"])

@router.post("/recommend", response_model=PricingResponse)
def get_dynamic_price(req: PricingRequest):
    result = pricing_engine.calculate_price(
        base_price=req.basePrice,
        hour=req.hour,
        day_of_week=req.dayOfWeek,
        occupancy_rate=req.occupancyRate
    )
    return {
        "chargerId": req.chargerId,
        **result
    }
