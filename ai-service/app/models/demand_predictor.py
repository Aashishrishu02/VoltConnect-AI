class DemandPredictor:
    """
    Time-series & regressor prediction model for city/neighborhood EV charger utilization.
    """
    def predict_demand(self, city: str, hour: int, day_of_week: int) -> dict:
        is_peak = (16 <= hour <= 21) or (7 <= hour <= 9)
        utilization = 85.0 if is_peak else 35.0

        if day_of_week in [5, 6]:
            utilization += 10.0

        utilization = min(98.0, max(15.0, utilization))

        if utilization > 75:
            demand_level = "VERY_HIGH"
        elif utilization > 50:
            demand_level = "MODERATE"
        else:
            demand_level = "LOW"

        return {
            "city": city,
            "predictedDemand": demand_level,
            "utilizationPercent": round(utilization, 1),
            "peakHourWarning": is_peak
        }

demand_predictor = DemandPredictor()
