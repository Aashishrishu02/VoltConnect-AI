from pydantic import BaseModel, Field
from typing import List, Optional, Any

class RecommendRequest(BaseModel):
    userLat: float
    userLng: float
    maxDistanceKm: Optional[float] = 50.0
    minPowerKw: Optional[float] = 0.0
    connectorType: Optional[str] = None
    chargers: List[dict]

class RecommendItem(BaseModel):
    chargerId: str
    aiScore: float
    estimatedWaitMin: int
    reason: str

class PricingRequest(BaseModel):
    chargerId: str
    basePrice: float
    hour: int = Field(ge=0, le=23)
    dayOfWeek: int = Field(ge=0, le=6)
    occupancyRate: float = 0.5

class PricingResponse(BaseModel):
    chargerId: str
    recommendedPrice: float
    multiplier: float
    isPeakHour: bool
    reason: str

class DemandRequest(BaseModel):
    city: str
    hour: int
    dayOfWeek: int

class DemandResponse(BaseModel):
    city: str
    predictedDemand: str
    utilizationPercent: float
    peakHourWarning: bool

class EVRouteRequest(BaseModel):
    startLat: float
    startLng: float
    destLat: float
    destLng: float
    batteryPercent: float = 50.0
    maxRangeKm: float = 350.0
    availableChargers: List[dict]

class EVRouteResponse(BaseModel):
    totalDistanceKm: float
    estimatedTripMin: int
    initialBattery: float
    stopsNeeded: int
    recommendedChargers: List[dict]
    arrivalBattery: float

class FraudRequest(BaseModel):
    userId: str
    chargerId: str
    bookingFrequencyLastHour: int
    paymentMethod: str
    amount: float

class FraudResponse(BaseModel):
    isFraudulent: bool
    riskScore: float
    riskLevel: str
    reasons: List[str]
