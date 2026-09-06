def calculate_scores(config: dict, env: dict, noise: dict):
    # Initialize base scores
    signal_quality = 80
    noise_res = 50
    energy_eff = 100 - config["power"]  # Lower power = higher efficiency

    # 1. Noise Resistance Calculation
    peaks = noise.get("detected_peaks_khz", [])
    freq = config["freq"]
    
    # Check if frequency hits a noise peak
    hit_peak = any(abs(freq - p) < 5 for p in peaks)
    
    if hit_peak:
        noise_res -= 40
        signal_quality -= 30
    else:
        noise_res += 30

    # Waveform bonuses
    if config["wave"] == "PHASE_CODED":
        noise_res += 20
        signal_quality += 10
    elif config["wave"] == "LFM":
        noise_res += 10
        signal_quality += 15

    # Cap scores at 100, minimum 10
    signal_quality = max(10, min(100, signal_quality))
    noise_res = max(10, min(100, noise_res))
    energy_eff = max(10, min(100, energy_eff))
    
    # Final combined score weighted
    final = (signal_quality * 0.4) + (noise_res * 0.4) + (energy_eff * 0.2)

    return {
        "signal_quality": round(signal_quality),
        "noise_resistance": round(noise_res),
        "energy_efficiency": round(energy_eff),
        "final_score": round(final)
    }


def run_digital_twin_simulation(env: dict, noise: dict, adaptive_config: dict):
    # 1. Traditional Fixed Sonar (Never changes)
    traditional = {
        "id": "traditional",
        "name": "Traditional Fixed Sonar",
        "freq": 40.0,
        "wave": "CW",
        "power": 80.0
    }
    
    # 2. AquaAdapt AI Optimal (From Phase 5)
    adaptive = {
        "id": "adaptive",
        "name": "AquaAdapt AI Optimal",
        "freq": adaptive_config["frequency_khz"],
        "wave": adaptive_config["waveform_type"],
        "power": adaptive_config["power_percentage"]
    }
    
    # 3. Sub-Optimal Alternative (High power, blind frequency)
    suboptimal = {
        "id": "suboptimal",
        "name": "Sub-Optimal Alternative",
        "freq": 20.0, 
        "wave": "LFM",
        "power": 100.0
    }

    configs = [traditional, adaptive, suboptimal]
    results = []

    for c in configs:
        scores = calculate_scores(c, env, noise)
        results.append({
            "id": c["id"],
            "name": c["name"],
            "parameters": f"{c['freq']}kHz | {c['wave']} | {c['power']}% Pwr",
            "scores": scores,
            "is_best": c["id"] == "adaptive"
        })

    # Sort by final score descending
    results.sort(key=lambda x: x["scores"]["final_score"], reverse=True)
    return results