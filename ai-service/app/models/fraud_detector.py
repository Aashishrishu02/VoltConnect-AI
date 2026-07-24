from typing import List

class FraudDetector:
    """
    Isolation Forest / Rule-based anomaly detection for booking fraud.
    """
    def check_fraud(
        self,
        user_id: str,
        charger_id: str,
        booking_freq: int,
        payment_method: str,
        amount: float
    ) -> dict:
        reasons: List[str] = []
        risk_score = 10.0

        if booking_freq > 4:
            risk_score += 45.0
            reasons.append("Unusual high frequency of bookings within 1 hour")

        if amount > 400.0:
            risk_score += 30.0
            reasons.append("High monetary value transaction threshold breached")

        is_fraud = risk_score >= 60.0
        risk_level = "HIGH" if is_fraud else ("MEDIUM" if risk_score > 35 else "LOW")

        if not reasons:
            reasons.append("Transaction matches normal user behavior pattern")

        return {
            "isFraudulent": is_fraud,
            "riskScore": round(risk_score, 1),
            "riskLevel": risk_level,
            "reasons": reasons
        }

fraud_detector = FraudDetector()
