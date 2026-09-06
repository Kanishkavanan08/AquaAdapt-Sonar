from fastapi.testclient import TestClient
import sys
import os

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from decision_engine import optimize_sonar_configuration

client = TestClient(app)

def test_health_check():
    """Test that the API is running and responding."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_decision_engine_battery_logic():
    """Test that the AI correctly throttles power when battery is low."""
    mock_env = {
        "depth_m": 100,
        "temperature_c": 15,
        "salinity_psu": 35,
        "ambient_noise_level": "low",
        "battery_percentage": 20.0  # CRITICAL BATTERY
    }
    mock_noise = {"detected_peaks_khz": []}
    
    result = optimize_sonar_configuration(mock_env, mock_noise)
    config = result["recommended_config"]
    
    # Assert that power was reduced to 45% due to low battery
    assert config["power_percentage"] == 45.0
    
def test_decision_engine_noise_logic():
    """Test that the AI switches waveforms in high noise."""
    mock_env = {
        "depth_m": 100,
        "temperature_c": 15,
        "salinity_psu": 35,
        "ambient_noise_level": "high",
        "battery_percentage": 100.0 
    }
    mock_noise = {"detected_peaks_khz": [40.0]}
    
    result = optimize_sonar_configuration(mock_env, mock_noise)
    config = result["recommended_config"]
    
    # Assert waveform changed to PHASE_CODED
    assert config["waveform_type"] == "PHASE_CODED"
    