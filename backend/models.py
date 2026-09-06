from pydantic import BaseModel

class EnvironmentState(BaseModel):
    depth_m: float
    temperature_c: float
    salinity_psu: float
    ambient_noise_level: str
    battery_percentage: float

# NEW FOR PHASE 4
class WaveformRequest(BaseModel):
    waveform_type: str  # "CW", "LFM", or "PHASE_CODED"
    frequency_khz: float
    duration_ms: float
    power_percentage: float