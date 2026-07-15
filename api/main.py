from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np

app = FastAPI(title="Fraud Detection API")

# allow the react frontend to call this api

"""browsers block a page on port 5173 from calling an API on port 8000
unless the API explicitly allows it"""

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

#pydantic validates the incoming JSON automatically

class Transaction(BaseModel):
    features: List[float]
    #threshold as a parameter exposes project's key finding thru API
    threshold: float = 0.30

@app.get("/")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(txn: Transaction):
    if len(txn.features) != 30:
        return {"error": f"Expected 30 features, got {len(txn.features)}"}
    
    X = np.array(txn.features).reshape(1, -1)
    X_scaled = scaler.transform(X)
    prob = float(model.predict_proba(X_scaled)[0, 1])

    return {
        "fraud_probability": round(prob, 4),
        "flagged": bool(prob >= txn.threshold),
        "threshold": txn.threshold,
    }
