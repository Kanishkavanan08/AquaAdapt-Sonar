def optimize_sonar_configuration(environment: dict, noise_data: dict):
    # Base/Default Configuration
    config = {
        "frequency_khz": 50.0,
        "waveform_type": "CW",
        "power_percentage": 80.0,
        "pulse_duration_ms": 10.0,
        "pulse_repetition_interval_ms": 500.0
    }
    
    explanations = []

    battery = environment.get("battery_percentage", 100)
    noise_level = environment.get("ambient_noise_level", "Low").lower()
    depth = environment.get("depth_m", 0)
    detected_peaks = noise_data.get("detected_peaks_khz", [])

    # RULE 1: Battery Conservation
    if battery < 40:
        config["power_percentage"] = 45.0
        explanations.append(f"Battery is critically low ({battery}%). Reduced transmission power to 45% to conserve energy.")
    elif battery < 70:
        config["power_percentage"] = 65.0
        explanations.append(f"Battery is at {battery}%. Optimized power to 65% for energy efficiency.")

    # RULE 2: Noise Adaptation & Waveform Selection
    if noise_level == "high":
        config["waveform_type"] = "PHASE_CODED"
        explanations.append("High ambient noise detected. Switched to PHASE_CODED waveform for maximum interference resistance.")
    elif noise_level == "medium":
        config["waveform_type"] = "LFM"
        explanations.append("Medium ambient noise detected. Switched to LFM (Chirp) for better signal-to-noise ratio.")

    # RULE 3: Frequency Hopping (Avoid Interference)
    # If our default 50kHz is close to a noise peak, shift it to 60kHz or 75kHz
    for peak in detected_peaks:
        if abs(config["frequency_khz"] - peak) < 10:
            new_freq = 65.0 if peak < 55 else 35.0
            config["frequency_khz"] = new_freq
            explanations.append(f"Narrowband interference detected near {peak} kHz. Hopped transmission frequency to {new_freq} kHz to avoid jamming.")

    # RULE 4: Depth / Range Adaptation
    if depth > 400:
        config["pulse_duration_ms"] = 25.0
        explanations.append(f"Deep water operation ({depth}m). Increased pulse duration to 25ms to ensure acoustic penetration and echo return.")
    elif depth < 50:
        config["pulse_duration_ms"] = 5.0
        explanations.append(f"Shallow water operation ({depth}m). Decreased pulse duration to 5ms to prevent reverberation clutter.")

    if not explanations:
        explanations.append("Environmental conditions are stable. Using default optimal configuration.")

    return {
        "recommended_config": config,
        "explanations": explanations
    }