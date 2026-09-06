import streamlit as st
import numpy as np
from scipy.fft import fft, fftfreq
from scipy.signal import chirp
import pandas as pd

st.set_page_config(page_title="AquaAdapt Sonar", page_icon="🌊", layout="wide")

st.title("🌊 AquaAdapt Sonar")
st.markdown("**SIH 2026 Prototype • AUV Software-Defined Sonar**")

# --- SIDEBAR: ENVIRONMENT SIMULATOR ---
st.sidebar.header("Environment Simulator")
depth = st.sidebar.slider("Depth (m)", 10.0, 500.0, 100.0, 10.0)
temp = st.sidebar.slider("Temperature (°C)", -2.0, 35.0, 15.0, 1.0)
salinity = st.sidebar.slider("Salinity (PSU)", 30.0, 40.0, 35.0, 0.5)
battery = st.sidebar.slider("Battery (%)", 5.0, 100.0, 80.0, 5.0)
noise_level = st.sidebar.selectbox("Ambient Noise Level", ["Low", "Medium", "High"])

# --- AI DECISION ENGINE LOGIC ---
def optimize_sonar(battery_val, noise_val, depth_val):
    config = {
        "frequency_khz": 50.0,
        "waveform_type": "CW",
        "power_percentage": 80.0,
        "pulse_duration_ms": 10.0
    }
    explanations = []

    if battery_val < 40:
        config["power_percentage"] = 45.0
        explanations.append(f"Battery is critically low ({battery_val}%). Reduced transmission power to 45%.")
    elif battery_val < 70:
        config["power_percentage"] = 65.0
        explanations.append(f"Battery is at {battery_val}%. Optimized power to 65%.")

    if noise_val.lower() == "high":
        config["waveform_type"] = "PHASE_CODED"
        explanations.append("High ambient noise. Switched to PHASE_CODED waveform for maximum interference resistance.")
    elif noise_val.lower() == "medium":
        config["waveform_type"] = "LFM"
        explanations.append("Medium noise. Switched to LFM (Chirp) for better signal-to-noise ratio.")

    if depth_val > 400:
        config["pulse_duration_ms"] = 25.0
        explanations.append(f"Deep water ({depth_val}m). Increased pulse duration to 25ms.")
    elif depth_val < 50:
        config["pulse_duration_ms"] = 5.0
        explanations.append(f"Shallow water ({depth_val}m). Decreased pulse duration to 5ms.")

    if not explanations:
        explanations.append("Environmental conditions stable. Using optimal default configuration.")

    return config, explanations

config, explanations = optimize_sonar(battery, noise_level, depth)

# --- TOP HUD DISPLAY ---
col1, col2, col3, col4 = st.columns(4)
col1.metric("Depth", f"{depth} m")
col2.metric("Battery", f"{battery}%", delta="-5%" if battery < 40 else None, delta_inverse=True)
col3.metric("Ambient Noise", noise_level)
col4.metric("System Health", "CRITICAL" if battery <= 30 else "NOMINAL")

st.markdown("---")

# --- AI DECISION CENTER & XAI ---
st.subheader("🤖 AI Decision Center (XAI)")
d_col1, d_col2 = st.columns(2)

with d_col1:
    st.markdown("### Optimal Parameters")
    st.json(config)

with d_col2:
    st.markdown("### Decision Reasoning")
    for exp in explanations:
        st.success(exp)

st.markdown("---")

# --- WAVEFORM GENERATOR SIMULATION ---
st.subheader("📡 Software-Defined Waveform Generator")
w_type = st.selectbox("Select Waveform Type", ["CW", "LFM", "PHASE_CODED"])
w_freq = st.slider("Frequency (kHz)", 10.0, 100.0, config["frequency_khz"], 5.0)

# Generate waveform math
sample_rate = 192000
duration_s = 0.005
t = np.linspace(0, duration_s, int(sample_rate * duration_s), endpoint=False)
freq_hz = w_freq * 1000.0

if w_type == "LFM":
    signal = chirp(t, f0=freq_hz-5000, f1=freq_hz+5000, t1=duration_s, method='linear')
elif w_type == "PHASE_CODED":
    base = np.sin(2 * np.pi * freq_hz * t)
    code = [1, 1, 1, -1, -1, 1, -1]
    segment_len = len(t) // len(code)
    signal = np.zeros_like(t)
    for i, bit in enumerate(code):
        start = i * segment_len
        end = start + segment_len if i < len(code) - 1 else len(t)
        signal[start:end] = base[start:end] * bit
else:
    signal = np.sin(2 * np.pi * freq_hz * t)

chart_data = pd.DataFrame({"Time (ms)": t * 1000, "Amplitude": signal})
st.line_chart(chart_data, x="Time (ms)", y="Amplitude")