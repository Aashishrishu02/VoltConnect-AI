from fastapi import APIRouter
from app.schemas import EVRouteRequest, EVRouteResponse
from app.models.route_optimizer import route_optimizer

router = APIRouter(prefix="/api/v1/route", tags=["route"])

@router.post("/optimize", response_model=EVRouteResponse)
def optimize_route(req: EVRouteRequest):
    return route_optimizer.plan_route(
        start_lat=req.startLat,
        start_lng=req.startLng,
        dest_lat=req.destLat,
        dest_lng=req.destLng,
        battery_percent=req.batteryPercent,
        max_range_km=req.maxRangeKm,
        chargers=req.availableChargers
    )
