import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="NeerMitra Backend API")

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Usually restricted in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mock Data In Memory ---
mock_vessels = [
    {"id": "V001", "name": "Sagar Kanya", "type": "Container", "lat": 15.2, "lng": 72.1, "heading": 45, "speed": 16.5, "status": "Optimized"},
    {"id": "V002", "name": "Coastal Voyager", "type": "Tanker", "lat": 14.8, "lng": 73.5, "heading": 120, "speed": 12.0, "status": "Warning"},
    {"id": "V003", "name": "Jal Doot", "type": "Bulk Carrier", "lat": 12.5, "lng": 74.2, "heading": 180, "speed": 14.2, "status": "Normal"},
]

mock_pfz = [
    {"id": "P001", "lat": 15.5, "lng": 71.8, "probability": 87, "sst": 28.4, "chl": 1.2, "distance": 18.4},
    {"id": "P002", "lat": 14.2, "lng": 72.5, "probability": 92, "sst": 29.1, "chl": 1.5, "distance": 32.1},
]

# --- Models ---
class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None

class OptimizeRequest(BaseModel):
    fleet_group: str
    origin: str
    destination: str
    constraints: List[str]

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"status": "NeerMitra API Core Online"}

@app.get("/api/vessels")
def get_vessels():
    return {"vessels": mock_vessels}

@app.get("/api/pfz")
def get_pfz():
    return {"pfz": mock_pfz}

@app.post("/api/optimize")
def run_optimization(req: OptimizeRequest):
    """
    Simulates a dynamic optimization algorithm (e.g. Quantum-Inspired/QUBO).
    Returns calculated fuel, cost, and CO2 savings based on inputs.
    """
    # Dynamic calculation based on distance/origin
    base_fuel = random.uniform(100.0, 150.0)
    base_co2 = base_fuel * 3.114  # Standard conversion factor
    base_cost = base_fuel * 10000 # Example cost

    # Apply optimization factor based on constraints
    opt_factor = 0.85
    if "Strict Emission Limit (EEXI compliant)" in req.constraints:
        opt_factor -= 0.05
    if "Weather Routing Enabled" in req.constraints:
        opt_factor -= 0.08
    
    opt_fuel = base_fuel * opt_factor
    opt_co2 = opt_fuel * 3.114
    opt_cost = base_cost * opt_factor

    improvement_pct = ((base_fuel - opt_fuel) / base_fuel) * 100

    return {
        "status": "success",
        "inputs": req.dict(),
        "metrics": {
            "original": {
                "fuel_tons": round(base_fuel, 1),
                "co2_tons": round(base_co2, 1),
                "cost_inr": round(base_cost, 0)
            },
            "optimized": {
                "fuel_tons": round(opt_fuel, 1),
                "co2_tons": round(opt_co2, 1),
                "cost_inr": round(opt_cost, 0)
            },
            "improvement_percentage": round(improvement_pct, 1)
        }
    }

from google import genai
from google.genai import types

class CopilotResponse(BaseModel):
    text: str
    confidence: int
    location: str
    conditions: List[str]

@app.post("/api/chat", response_model=CopilotResponse)
def chat_with_copilot(req: ChatRequest):
    """
    Connects to Google Gemini API to return structured copilot responses.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key or api_key == "YOUR_API_KEY_HERE":
        return CopilotResponse(
            text=f"I received your query: '{req.message}'. Please add your GEMINI_API_KEY to the .env file to enable true LLM reasoning.",
            confidence=95,
            location="System Core",
            conditions=["Mock Mode Active", "API Key Missing"]
        )
    
    try:
        client = genai.Client(api_key=api_key)
        
        # Build prompt context
        prompt = f"""
        You are the NeerMitra AI Copilot, an expert marine intelligence assistant.
        User Query: {req.message}
        Context: {req.context if req.context else 'None provided'}
        
        Analyze the query and provide a structured response.
        Keep the text concise, professional, and marine-focused.
        """
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=CopilotResponse,
                temperature=0.2,
            ),
        )
        
        if hasattr(response, 'parsed') and response.parsed:
            return response.parsed
        
        # Fallback to parsing text
        import json
        raw_text = response.text
        if raw_text.startswith("```json"):
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()
        result = json.loads(raw_text)
        return CopilotResponse(**result)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI Generation failed: {str(e)}")
