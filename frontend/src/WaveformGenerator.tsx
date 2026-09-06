import { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { Radio } from 'lucide-react';

export default function WaveformGenerator() {
  const [waveType, setWaveType] = useState('CW');
  const [frequency, setFrequency] = useState(40);
  const [power, setPower] = useState(80);
  const [waveData, setWaveData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateWave = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/generate-waveform', {
        waveform_type: waveType,
        frequency_khz: frequency,
        duration_ms: 5.0, // Fixed 5ms for clear visualization
        power_percentage: power
      });
      setWaveData(response.data);
    } catch (error) {
      console.error("Failed to generate waveform", error);
    }
    setLoading(false);
  };

  // Generate an initial wave on mount
  useEffect(() => {
    generateWave();
  }, []);

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl w-full max-w-4xl mt-8">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
        <Radio /> Software-Defined Waveform Generator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Waveform Type</label>
          <select 
            value={waveType} 
            onChange={(e) => setWaveType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="CW">Continuous Wave (CW)</option>
            <option value="LFM">Linear Frequency Modulated (Chirp)</option>
            <option value="PHASE_CODED">Phase-Coded (Barker)</option>
          </select>
        </div>

        <div>
          <label className="flex justify-between text-sm font-medium mb-2 text-slate-300">
            <span>Frequency (kHz)</span>
            <span className="text-cyan-400">{frequency} kHz</span>
          </label>
          <input type="range" min="10" max="100" step="5" value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>

        <div>
          <label className="flex justify-between text-sm font-medium mb-2 text-slate-300">
            <span>Tx Power (%)</span>
            <span className="text-cyan-400">{power}%</span>
          </label>
          <input type="range" min="10" max="100" step="10" value={power} onChange={(e) => setPower(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>
      </div>

      <button 
        onClick={generateWave}
        className="w-full mb-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg transition-colors"
      >
        {loading ? 'Synthesizing...' : 'Generate Waveform Array'}
      </button>

      {waveData && (
        <div className="bg-slate-900 p-2 rounded-lg border border-slate-700 overflow-hidden">
          <Plot
            data={[{ 
              x: waveData.time_ms, 
              y: waveData.amplitude, 
              type: 'scatter', 
              mode: 'lines', 
              line: { color: '#10b981', width: 2 } 
            }]}
            layout={{ 
              title: `Generated Sonar Pulse: ${waveData.metadata}`, 
              paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
              font: { color: '#94a3b8' },
              xaxis: { title: 'Time (ms)', gridcolor: '#334155' },
              yaxis: { title: 'Amplitude (Voltage)', gridcolor: '#334155', range: [-1.2, 1.2] },
              margin: { t: 40, r: 20, l: 50, b: 40 },
              height: 250,
              autosize: true
            }}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}
    </div>
  );
}