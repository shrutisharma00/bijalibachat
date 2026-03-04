import os
from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models import BillsInput, PredictionOutput
from .utils.predictor import predict_next_bill

app = FastAPI(
    title="Bijli Bachat Backend",
    description="FastAPI backend for electricity bill prediction for UP DISCOM users.",
)

# CORS so that Vite/React frontend can call the API
allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionOutput)
def predict(input_data: BillsInput) -> PredictionOutput:
    """
    Predict next month's units and bill amount using
    simple linear regression + temperature adjustment.
    """
    bills = input_data.bills
    if len(bills) < 2:
        # Frontend usually requires 3+ months but backend
        # supports minimum 2 months for regression.
        raise ValueError("Need at least 2 months of data.")

    api_key = os.getenv("OPENWEATHER_API_KEY")

    predicted_units, predicted_amount, temp_c, source = predict_next_bill(
        bills, api_key
    )

    return PredictionOutput(
        predicted_units=round(predicted_units, 2),
        predicted_amount=round(predicted_amount, 2),
        temperature_c=round(temp_c, 1),
        source=source,
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )

