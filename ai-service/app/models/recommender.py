import math
try:
    import numpy as np
except ImportError:
    np = None

from typing import List, Dict

class ChargerRecommender:
    """
    Multi-Criteria Decision Analysis (MCDA) Recommender.
    Scores chargers based on:
    - Distance proximity (40%)
    - Power kW speed (25%)
    - Rating (20%)
    - Pricing index (15%)
    """
    def score_chargers(self, user_lat: float, user_lng: float, chargers: List[Dict]) -> List[Dict]:
        if not chargers:
            return []

        results = []
        for c in chargers:
            lat1, lon1 = math.radians(user_lat), math.radians(user_lng)
            lat2, lon2 = math.radians(c.get('latitude', 0.0)), math.radians(c.get('longitude', 0.0))
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            a = math.sin(dlat / 2.0)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2.0)**2
            dist_km = 6371.0 * 2 * math.asin(math.sqrt(a))

            dist_score = max(0, 100 - dist_km * 4)
            power_score = min(100, (c.get('powerKw', 7.2) / 150.0) * 100)
            rating_score = (c.get('averageRating', 4.5) / 5.0) * 100
            price_score = max(0, 100 - (c.get('pricePerHour', 10.0) * 4))

            final_score = (dist_score * 0.40) + (power_score * 0.25) + (rating_score * 0.20) + (price_score * 0.15)
            final_score = round(float(max(10, min(99, final_score))), 1)

            wait_min = int(max(0, round((100 - power_score) / 10)))

            reason = "Best overall match"
            if dist_km < 3:
                reason = "Ultra close distance to your location"
            elif c.get('powerKw', 0) >= 100:
                reason = "Superfast DC charging speeds"
            elif c.get('averageRating', 0) >= 4.8:
                reason = "Top community customer rating"

            results.append({
                "chargerId": c.get('id'),
                "aiScore": final_score,
                "estimatedWaitMin": wait_min,
                "reason": reason
            })

        return sorted(results, key=lambda x: x['aiScore'], reverse=True)

recommender_engine = ChargerRecommender()
