from __future__ import annotations

from typing import List, Tuple

import numpy as np
import requests
from sklearn.linear_model import LinearRegression

from ..models import BillItem

BAREILLY_LAT = 28.3670
BAREILLY_LON = 79.4300
DEFAULT_TEMP_C = 30.0


def fetch_current_temperature(api_key: str | None) -> float:
    """
    Get approximate current temperature for Bareilly, UP from OpenWeatherMap.
    Falls back to DEFAULT_TEMP_C on any error.
    """
    if not api_key:
        return DEFAULT_TEMP_C

    try:
        url = (
            "https://api.openweathermap.org/data/2.5/weather"
            f"?lat={BAREILLY_LAT}&lon={BAREILLY_LON}&appid={api_key}&units=metric"
        )
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        return float(data.get("main", {}).get("temp", DEFAULT_TEMP_C))
    except Exception:
        # Backend should be robust for demo – fallback to default 30°C
        return DEFAULT_TEMP_C


def prepare_training_data(bills: List[BillItem]) -> Tuple[np.ndarray, np.ndarray]:
    """
    Build simple 1D regression data using month index as X and units as y.
    """
    if len(bills) < 2:
        raise ValueError("At least two months of data are required for regression.")

    # x = month index sequence 1..n
    x = np.arange(1, len(bills) + 1).reshape(-1, 1)
    y = np.array([b.units for b in bills], dtype=float)
    return x, y


def train_units_regressor(bills: List[BillItem]) -> LinearRegression:
    x, y = prepare_training_data(bills)
    model = LinearRegression()
    model.fit(x, y)
    return model


def estimate_rate_per_unit(bills: List[BillItem]) -> float:
    """
    Approximate rate (Rs per unit) from historical data.
    """
    total_units = sum(b.units for b in bills)
    total_amount = sum(b.amount for b in bills)
    if total_units <= 0:
        return 7.0  # simple fallback average rate
    return max(total_amount / total_units, 3.0)


def predict_next_bill(
    bills: List[BillItem], api_key: str | None
) -> Tuple[float, float, float, str]:
    """
    Returns (predicted_units, predicted_amount, used_temperature, source)
    """
    model = train_units_regressor(bills)
    n = len(bills)
    next_x = np.array([[n + 1]])
    base_units = float(model.predict(next_x)[0])

    temp_c = fetch_current_temperature(api_key)

    # Simple temperature adjustment:
    # - If hotter than 30°C, increase units slightly.
    # - If cooler, decrease slightly.
    temp_diff = temp_c - DEFAULT_TEMP_C
    # 1% change per degree as a naive factor
    adjustment_factor = 1.0 + (0.01 * temp_diff)
    adjustment_factor = max(0.7, min(1.3, adjustment_factor))

    adjusted_units = max(base_units * adjustment_factor, 0.0)

    rate = estimate_rate_per_unit(bills)
    predicted_amount = max(adjusted_units * rate, 0.0)

    source = "backend-openweather" if api_key else "backend-default-temp"

    return adjusted_units, predicted_amount, temp_c, source

