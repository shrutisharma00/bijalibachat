from pydantic import BaseModel, Field
from typing import List


class BillItem(BaseModel):
    month: str = Field(..., description="Month name, e.g., January")
    year: int = Field(..., ge=2000, le=2100)
    units: float = Field(..., ge=0)
    amount: float = Field(..., ge=0)


class BillsInput(BaseModel):
    bills: List[BillItem]


class PredictionOutput(BaseModel):
    predicted_units: float
    predicted_amount: float
    temperature_c: float
    source: str

