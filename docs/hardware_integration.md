# Hardware Integration Roadmap

AquaAdapt-Sonar is currently built as a **Software Digital Twin**. However, the architecture is specifically decoupled to allow seamless integration with a physical AUV hardware payload for SIH 26058.

## Hardware Architecture

To transition this software into a physical underwater payload, the following hardware stack is required:

1. **Microcontroller (Edge AI):** ESP32 or Raspberry Pi 4.
2. **Digital-to-Analog Converter (DAC):** High-speed DAC to convert the software's digital numpy arrays into analog voltage.
3. **Power Amplifier:** Variable gain amplifier to boost the signal based on the AI's power percentage decision.
4. **Acoustic Transducer:** Broadband Piezoelectric Transducer capable of transmitting 20kHz - 100kHz.
5. **Hydrophone:** Underwater microphone to capture ambient noise for FFT analysis.

## Data Flow (Software to Hardware)

Currently, the React frontend requests a waveform from the FastAPI backend. In a physical deployment, the backend will send a JSON payload via UART or WebSockets directly to the ESP32 payload.

**Command Payload Example:**
```json
{
  "frequency_khz": 65.0,
  "waveform_type": "PHASE_CODED",
  "power_percentage": 45.0,
  "pulse_duration_ms": 25.0
}