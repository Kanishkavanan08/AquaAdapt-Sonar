import numpy as np
from scipy.fft import fft, fftfreq
from scipy.signal import chirp

def generate_noise_profile(noise_level: str, duration: float = 0.05, sample_rate: int = 192000):
    # ... (Keep your existing generate_noise_profile code here exactly as it is) ...
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    noise = np.random.normal(0, 0.1, len(t))
    peaks = []
    if noise_level.lower() == 'high':
        noise += np.sin(2 * np.pi * 40000 * t) * 0.8
        noise += np.sin(2 * np.pi * 20000 * t) * 0.5
        peaks = [20000, 40000]
    elif noise_level.lower() == 'medium':
        noise += np.sin(2 * np.pi * 40000 * t) * 0.3
        peaks = [40000]

    N = len(t)
    yf = fft(noise)
    xf = fftfreq(N, 1 / sample_rate)
    pos_mask = xf > 0
    freqs = xf[pos_mask]
    magnitudes = np.abs(yf[pos_mask]) * (2.0 / N)

    t_step = max(1, len(t) // 500)
    f_step = max(1, len(freqs) // 500)
    
    return {
        "time": t[::t_step].tolist(),
        "amplitude": noise[::t_step].tolist(),
        "frequencies": (freqs[::f_step] / 1000).tolist(),
        "magnitudes": magnitudes[::f_step].tolist(),
        "detected_peaks_khz": [p / 1000 for p in peaks]
    }

# NEW FOR PHASE 4
def generate_sonar_waveform(req_type: str, freq_khz: float, duration_ms: float, power: float, sample_rate: int = 192000):
    duration_s = duration_ms / 1000.0
    t = np.linspace(0, duration_s, int(sample_rate * duration_s), endpoint=False)
    freq_hz = freq_khz * 1000.0
    amplitude_scaler = power / 100.0

    if req_type == "LFM":
        # Sweeps from (freq - 5kHz) to (freq + 5kHz)
        start_freq = freq_hz - 5000
        end_freq = freq_hz + 5000
        signal = chirp(t, f0=start_freq, f1=end_freq, t1=duration_s, method='linear') * amplitude_scaler
    
    elif req_type == "PHASE_CODED":
        # Simulate a Barker code or binary phase shift keying (BPSK)
        # We divide the pulse into segments and flip the phase (multiply by -1)
        base_signal = np.sin(2 * np.pi * freq_hz * t)
        code = [1, 1, 1, -1, -1, 1, -1] # 7-bit Barker Code equivalent
        segment_len = len(t) // len(code)
        signal = np.zeros_like(t)
        for i, bit in enumerate(code):
            start = i * segment_len
            end = start + segment_len if i < len(code) - 1 else len(t)
            signal[start:end] = base_signal[start:end] * bit
        signal = signal * amplitude_scaler
        
    else: # Default to "CW" (Continuous Wave)
        signal = np.sin(2 * np.pi * freq_hz * t) * amplitude_scaler

    # Downsample for frontend to prevent browser lag (send ~500 points)
    step = max(1, len(t) // 500)
    
    return {
        "time_ms": (t[::step] * 1000).tolist(), # Convert to milliseconds for UI
        "amplitude": signal[::step].tolist(),
        "waveform_type": req_type,
        "metadata": f"Generated {req_type} at {freq_khz}kHz, {duration_ms}ms"
    }