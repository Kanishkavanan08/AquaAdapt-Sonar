from fastapi import FastAPI
from models import EnvironmentState
from signal_processing import generate_noise_profile # NEW IMPORT

app = FastAPI(title="AquaAdapt-Sonar API")

current_environment = {
    "depth_m": 100.0,
    "temperature_c": 15.0,
    "salinity_psu": 35.0,
    "ambient_noise_level": "Low",
    "battery_percentage": 80.0
}

@app.get("/api/health")
async def health_check():
    return {"status": "online"}

@app.post("/api/environment")
async def update_environment(state: EnvironmentState):
    global current_environment
    current_environment = state.model_dump()
    return {"status": "success", "data": current_environment}

# NEW ROUTE FOR PHASE 3
@app.get("/api/analyze-noise")
async def analyze_noise():
    # Uses the current noise level set by the frontend simulator
    noise_level = current_environment.get("ambient_noise_level", "Low")
    data = generate_noise_profile(noise_level)
    return data