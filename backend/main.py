from fastapi import FastAPI
from models import EnvironmentState

app = FastAPI(title="AquaAdapt-Sonar API")

# Store the current simulated state in memory for now
current_environment = {
    "depth_m": 0.0,
    "temperature_c": 15.0,
    "salinity_psu": 35.0,
    "ambient_noise_level": "Low",
    "battery_percentage": 100.0
}

@app.get("/api/health")
async def health_check():
    return {"status": "online", "message": "AquaAdapt-Sonar Backend is running"}

@app.post("/api/environment")
async def update_environment(state: EnvironmentState):
    global current_environment
    current_environment = state.model_dump()
    # In future phases, this will trigger the Decision Engine
    return {
        "status": "success",
        "message": "Environment updated successfully",
        "data": current_environment
    }