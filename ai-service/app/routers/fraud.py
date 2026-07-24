from fastapi import APIRouter
from app.schemas import FraudRequest, FraudResponse
from app.models.fraud_detector import fraud_detector

router = APIRouter(prefix="/api/v1/fraud", tags=["fraud"])

@router.post("/check", response_model=FraudResponse)
def check_fraud(req: FraudRequest):
    return fraud_detector.check_fraud(
        user_id=req.userId,
        charger_id=req.chargerId,
        booking_freq=req.bookingFrequencyLastHour,
        payment_method=req.paymentMethod,
        amount=req.amount
    )
