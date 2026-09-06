from pydantic import BaseModel

class EnvironmentState(BaseModel):
    depth_m: float
    temperature_c: float
    salinity_psu: float
    ambient_noise_level: str
    battery_percentage: float