import numpy as np
from scipy.fft import fft, fftfreq

def generate_noise_profile(noise_level: str, duration: float = 0.05, sample_rate: int = 192000):
    # Time axis
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    
    # Base ocean background white noise
    noise = np.random.normal(0, 0.1, len(t))
    
    # Introduce specific interference bands based on the environment simulator
    peaks = []
    if noise_level.lower() == 'high':
        noise += np.sin(2 * np.pi * 40000 * t) * 0.8  # Strong 40kHz interference
        noise += np.sin(2 * np.pi * 20000 * t) * 0.5  # 20kHz interference
        peaks = [20000, 40000]
    elif noise_level.lower() == 'medium':
        noise += np.sin(2 * np.pi * 40000 * t) * 0.3  # Weak 40kHz interference
        peaks = [40000]

    # Fast Fourier Transform (FFT) to convert time domain to frequency domain
    N = len(t)
    yf = fft(noise)
    xf = fftfreq(N, 1 / sample_rate)

    # Filter for positive frequencies only (up to Nyquist frequency)
    pos_mask = xf > 0
    freqs = xf[pos_mask]
    magnitudes = np.abs(yf[pos_mask]) * (2.0 / N)

    # Downsample arrays for frontend performance (we don't need to send 10,000 points to React)
    t_step = max(1, len(t) // 500)
    f_step = max(1, len(freqs) // 500)
    
    return {
        "time": t[::t_step].tolist(),
        "amplitude": noise[::t_step].tolist(),
        "frequencies": (freqs[::f_step] / 1000).tolist(), # Convert to kHz for UI
        "magnitudes": magnitudes[::f_step].tolist(),
        "detected_peaks_khz": [p / 1000 for p in peaks]
    }