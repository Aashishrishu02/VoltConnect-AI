from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_pricing():
    response = client.post("/api/v1/pricing/recommend", json={
        "chargerId": "test_charger",
        "basePrice": 10.0,
        "hour": 18,
        "dayOfWeek": 2,
        "occupancyRate": 0.85
    })
    assert response.status_code == 200
    data = response.json()
    assert data["recommendedPrice"] > 10.0
    assert data["isPeakHour"] is True

def test_route_optimize():
    response = client.post("/api/v1/route/optimize", json={
        "startLat": 37.7749,
        "startLng": -122.4194,
        "destLat": 37.4231,
        "destLng": -122.1430,
        "batteryPercent": 40.0,
        "maxRangeKm": 300.0,
        "availableChargers": []
    })
    assert response.status_code == 200
    data = response.json()
    assert "totalDistanceKm" in data
    assert data["totalDistanceKm"] > 0
