from fastapi import FastAPI
from models import EnvironmentState, WaveformRequest
from signal_processing import generate_noise_profile, generate_sonar_waveform
from decision_engine import optimize_sonar_configuration
from digital_twin import run_digital_twin_simulation

app = FastAPI(title="AquaAdapt-Sonar API")

# Global memory state
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

@app.get("/api/analyze-noise")
async def analyze_noise():
    noise_level = current_environment.get("ambient_noise_level", "Low")
    data = generate_noise_profile(noise_level)
    return data

@app.post("/api/generate-waveform")
async def generate_waveform_api(request: WaveformRequest):
    data = generate_sonar_waveform(
        req_type=request.waveform_type,
        freq_khz=request.frequency_khz,
        duration_ms=request.duration_ms,
        power=request.power_percentage
    )
    return data

@app.get("/api/optimize-sonar")
async def optimize_sonar():
    noise_level = current_environment.get("ambient_noise_level", "Low")
    noise_data = generate_noise_profile(noise_level)
    decision = optimize_sonar_configuration(current_environment, noise_data)
    return decision

@app.get("/api/digital-twin")
async def get_digital_twin_simulation():
    noise_level = current_environment.get("ambient_noise_level", "Low")
    noise_data = generate_noise_profile(noise_level)
    decision = optimize_sonar_configuration(current_environment, noise_data)
    
    twin_results = run_digital_twin_simulation(
        env=current_environment, 
        noise=noise_data, 
        adaptive_config=decision["recommended_config"]
    )
    return twin_results