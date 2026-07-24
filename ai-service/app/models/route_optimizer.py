import math
from typing import List, Dict

class EVRouteOptimizer:
    """
    EV Trip Route Planner:
    Calculates total route distance, checks battery state of charge (SOC), and plans charging stops along route.
    """
    def plan_route(
        self,
        start_lat: float,
        start_lng: float,
        dest_lat: float,
        dest_lng: float,
        battery_percent: float,
        max_range_km: float,
        chargers: List[Dict]
    ) -> dict:
        lat1, lon1 = math.radians(start_lat), math.radians(start_lng)
        lat2, lon2 = math.radians(dest_lat), math.radians(dest_lng)
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat / 2.0)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2.0)**2
        total_dist_km = round(float(6371.0 * 2 * math.asin(math.sqrt(a))), 1)

        current_range_km = (battery_percent / 100.0) * max_range_km
        stops_needed = 0
        recommended_chargers = []

        if current_range_km < total_dist_km:
            stops_needed = int(math.ceil((total_dist_km - current_range_km) / (max_range_km * 0.7)))
            if chargers:
                recommended_chargers = chargers[:stops_needed]

        arrival_battery = max(10.0, round(battery_percent - (total_dist_km / max_range_km) * 100, 1))
        if stops_needed > 0:
            arrival_battery = round(min(90.0, arrival_battery + 60.0), 1)

        est_time_min = int(round((total_dist_km / 80.0) * 60 + (stops_needed * 30)))

        return {
            "totalDistanceKm": total_dist_km,
            "estimatedTripMin": est_time_min,
            "initialBattery": battery_percent,
            "stopsNeeded": stops_needed,
            "recommendedChargers": recommended_chargers,
            "arrivalBattery": arrival_battery
        }

route_optimizer = EVRouteOptimizer()
