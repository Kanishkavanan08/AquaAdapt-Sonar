from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from models import EnvironmentState, WaveformRequest
from signal_processing import generate_noise_profile, generate_sonar_waveform
from decision_engine import optimize_sonar_configuration
from digital_twin import run_digital_twin_simulation
from energy_model import calculate_energy_consumption
from database import get_db, DecisionLog # NEW IMPORTS

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

@app.get("/api/system-status")
async def get_system_status():
    noise_level = current_environment.get("ambient_noise_level", "Low")
    noise_data = generate_noise_profile(noise_level)
    decision = optimize_sonar_configuration(current_environment, noise_data)
    
    battery = current_environment.get("battery_percentage", 100)
    health = "NOMINAL" if battery > 30 else "CRITICAL"

    return {
        "environment": current_environment,
        "active_sonar": decision["recommended_config"],
        "system_mode": "ADAPTIVE MODE ACTIVE",
        "system_health": health
    }

# UPDATE: Save decision to SQLite database when optimization runs
@app.get("/api/optimize-sonar")
async def optimize_sonar(db: Session = Depends(get_db)):
    noise_level = current_environment.get("ambient_noise_level", "Low")
    noise_data = generate_noise_profile(noise_level)
    decision = optimize_sonar_configuration(current_environment, noise_data)
    
    # Save to Database
    config = decision["recommended_config"]
    db_log = DecisionLog(
        depth_m=current_environment["depth_m"],
        battery=current_environment["battery_percentage"],
        noise=noise_level,
        freq_khz=config["frequency_khz"],
        waveform=config["waveform_type"],
        power=config["power_percentage"]
    )
    db.add(db_log)
    db.commit()
    
    return decision

@app.get("/api/analyze-noise")
async def analyze_noise():
    noise_level = current_environment.get("ambient_noise_level", "Low")
    return generate_noise_profile(noise_level)

@app.post("/api/generate-waveform")
async def generate_waveform_api(request: WaveformRequest):
    return generate_sonar_waveform(request.waveform_type, request.frequency_khz, request.duration_ms, request.power_percentage)

@app.get("/api/digital-twin")
async def get_digital_twin_simulation():
    noise_level = current_environment.get("ambient_noise_level", "Low")
    noise_data = generate_noise_profile(noise_level)
    decision = optimize_sonar_configuration(current_environment, noise_data)
    return run_digital_twin_simulation(current_environment, noise_data, decision["recommended_config"])

@app.get("/api/energy-analytics")
async def get_energy_analytics():
    noise_level = current_environment.get("ambient_noise_level", "Low")
    noise_data = generate_noise_profile(noise_level)
    decision = optimize_sonar_configuration(current_environment, noise_data)
    return calculate_energy_consumption(decision["recommended_config"])

# NEW ROUTE: Fetch History
@app.get("/api/history")
async def get_history(db: Session = Depends(get_db)):
    # Get last 10 records, ordered by ID descending
    logs = db.query(DecisionLog).order_by(DecisionLog.id.desc()).limit(10).all()
    return logs