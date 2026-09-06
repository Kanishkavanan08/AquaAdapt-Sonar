import { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { Activity } from 'lucide-react';

export default function SignalLab() {
  const [data, setData] = useState<any>(null);

  const fetchSignalData = async () => {
    try {
      const response = await axios.get('/api/analyze-noise');
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch signal data", error);
    }
  };

  // Fetch immediately on load, and set up a refresh button
  useEffect(() => {
    fetchSignalData();
  }, []);

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl w-full max-w-4xl mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
          <Activity /> Acoustic Signal Lab
        </h2>
        <button 
          onClick={fetchSignalData}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Refresh Hydrophone Data
        </button>
      </div>

      {!data ? (
        <p className="text-slate-400 text-center py-10">Initializing FFT Analysis...</p>
      ) : (
        <div className="space-y-8">
          {/* Time Domain Graph */}
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-700 overflow-hidden">
            <Plot
              data={[{ x: data.time, y: data.amplitude, type: 'scatter', mode: 'lines', line: { color: '#06b6d4' } }]}
              layout={{ 
                title: 'Time Domain (Raw Hydrophone Audio)', 
                paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
                font: { color: '#94a3b8' },
                xaxis: { title: 'Time (s)', gridcolor: '#334155' },
                yaxis: { title: 'Amplitude', gridcolor: '#334155' },
                margin: { t: 40, r: 20, l: 50, b: 40 },
                height: 250,
                autosize: true
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Frequency Domain Graph (FFT) */}
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-700 overflow-hidden">
            <Plot
              data={[{ x: data.frequencies, y: data.magnitudes, type: 'scatter', mode: 'lines', fill: 'tozeroy', line: { color: '#a855f7' } }]}
              layout={{ 
                title: 'Frequency Domain (FFT Spectrum)', 
                paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
                font: { color: '#94a3b8' },
                xaxis: { title: 'Frequency (kHz)', gridcolor: '#334155' },
                yaxis: { title: 'Magnitude', gridcolor: '#334155' },
                margin: { t: 40, r: 20, l: 50, b: 40 },
                height: 250,
                autosize: true
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {data.detected_peaks_khz.length > 0 && (
            <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
              <p className="text-red-400 font-semibold">⚠ Interference Detected at: {data.detected_peaks_khz.join(', ')} kHz</p>
              <p className="text-slate-300 text-sm mt-1">The Decision Engine will need to avoid these frequencies.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}