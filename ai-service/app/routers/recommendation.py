from fastapi import APIRouter
from app.schemas import RecommendRequest, RecommendItem
from app.models.recommender import recommender_engine
from typing import List

router = APIRouter(prefix="/api/v1", tags=["recommendation"])

@router.post("/recommend", response_model=List[RecommendItem])
def recommend_chargers(req: RecommendRequest):
    return recommender_engine.score_chargers(
        user_lat=req.userLat,
        user_lng=req.userLng,
        chargers=req.chargers
    )
