def calculate_energy_consumption(adaptive_config: dict, simulation_hours: int = 24):
    """
    Simulates energy consumption over a 24-hour AUV mission.
    Assuming a standard 100W maximum transmission power for the transducer.
    Energy (Joules) = Power (Watts) * Time (Seconds)
    1 Watt-hour (Wh) = 3600 Joules
    Assuming 1 ping per second (3600 pings per hour).
    """
    max_tx_watts = 100.0 
    pings_per_hour = 3600
    
    # 1. Traditional Sonar Baseline (Fixed at 80% power, 10ms pulse duration)
    trad_power_w = (80.0 / 100.0) * max_tx_watts
    trad_duration_s = 10.0 / 1000.0
    trad_joules_per_ping = trad_power_w * trad_duration_s
    trad_total_wh = (trad_joules_per_ping * pings_per_hour * simulation_hours) / 3600.0

    # 2. AquaAdapt Adaptive Sonar (Dynamic power and duration)
    adapt_power_w = (adaptive_config.get("power_percentage", 80) / 100.0) * max_tx_watts
    adapt_duration_s = adaptive_config.get("pulse_duration_ms", 10) / 1000.0
    adapt_joules_per_ping = adapt_power_w * adapt_duration_s
    adapt_total_wh = (adapt_joules_per_ping * pings_per_hour * simulation_hours) / 3600.0

    # Calculate Savings
    savings_percent = ((trad_total_wh - adapt_total_wh) / trad_total_wh) * 100 if trad_total_wh > 0 else 0

    # Generate cumulative data for frontend charts
    chart_data = []
    for hour in [6, 12, 18, 24]:
        multiplier = hour / simulation_hours
        chart_data.append({
            "time": f"{hour} Hrs",
            "Traditional": round(trad_total_wh * multiplier, 2),
            "Adaptive": round(adapt_total_wh * multiplier, 2)
        })

    return {
        "simulation_hours": simulation_hours,
        "traditional_wh": round(trad_total_wh, 2),
        "adaptive_wh": round(adapt_total_wh, 2),
        "savings_percent": round(savings_percent, 1),
        "chart_data": chart_data
    }