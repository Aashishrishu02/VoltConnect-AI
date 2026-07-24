class DynamicPricingEngine:
    """
    ML dynamic pricing algorithm to balance grid demand and host revenue.
    Applies multiplier based on peak hours, weekend/weekday, and area occupancy.
    """
    def calculate_price(self, base_price: float, hour: int, day_of_week: int, occupancy_rate: float) -> dict:
        is_peak_hour = 16 <= hour <= 21
        is_morning_rush = 7 <= hour <= 9
        is_weekend = day_of_week in [5, 6]

        multiplier = 1.0

        if is_peak_hour:
            multiplier += 0.25
        elif is_morning_rush:
            multiplier += 0.15

        if occupancy_rate > 0.8:
            multiplier += 0.20
        elif occupancy_rate < 0.2:
            multiplier -= 0.10

        if is_weekend:
            multiplier += 0.05

        multiplier = round(max(0.8, min(1.6, multiplier)), 2)
        recommended_price = round(base_price * multiplier, 2)

        reason = "Off-peak standard tariff"
        if is_peak_hour:
            reason = "High demand peak hour surge tariff"
        elif occupancy_rate > 0.8:
            reason = "High charger occupancy rate in vicinity"
        elif multiplier < 1.0:
            reason = "Low demand off-peak discount applied"

        return {
            "recommendedPrice": recommended_price,
            "multiplier": multiplier,
            "isPeakHour": is_peak_hour,
            "reason": reason
        }

pricing_engine = DynamicPricingEngine()
