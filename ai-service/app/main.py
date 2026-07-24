from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import recommendation, pricing, demand, route, fraud

app = FastAPI(
    title="ChargeShare AI Microservice",
    description="Python FastAPI ML Service providing Recommendations, Dynamic Pricing, Demand Prediction, EV Route Planning & Fraud Detection.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommendation.router)
app.include_router(pricing.router)
app.include_router(demand.router)
app.include_router(route.router)
app.include_router(fraud.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ChargeShare AI Microservice"}
