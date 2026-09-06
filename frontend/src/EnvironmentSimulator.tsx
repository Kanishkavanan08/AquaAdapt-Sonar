import { useState } from 'react';
import axios from 'axios';
import { Waves, Thermometer, Battery, SignalHigh, Droplets } from 'lucide-react';

export default function EnvironmentSimulator() {
  const [depth, setDepth] = useState(100);
  const [temp, setTemp] = useState(15);
  const [salinity, setSalinity] = useState(35);
  const [noise, setNoise] = useState('Low');
  const [battery, setBattery] = useState(80);
  const [status, setStatus] = useState('');

  const sendEnvironmentData = async () => {
    try {
      setStatus('Sending...');
      const payload = {
        depth_m: depth,
        temperature_c: temp,
        salinity_psu: salinity,
        ambient_noise_level: noise,
        battery_percentage: battery
      };
      await axios.post('/api/environment', payload);
      setStatus('Data synced with AUV backend ✅');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('Failed to sync ❌');
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl max-w-2xl w-full">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
        <Waves /> Environment Simulator
      </h2>

      <div className="space-y-6">
        {/* Depth Slider */}
        <div>
          <label className="flex justify-between text-sm font-medium mb-2">
            <span className="flex items-center gap-2"><Waves size={16}/> Depth (m)</span>
            <span className="text-cyan-400">{depth} m</span>
          </label>
          <input type="range" min="0" max="1000" value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>

        {/* Temperature Slider */}
        <div>
          <label className="flex justify-between text-sm font-medium mb-2">
            <span className="flex items-center gap-2"><Thermometer size={16}/> Temperature (°C)</span>
            <span className="text-cyan-400">{temp} °C</span>
          </label>
          <input type="range" min="-2" max="35" value={temp} onChange={(e) => setTemp(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>

        {/* Salinity & Battery Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="flex justify-between text-sm font-medium mb-2">
              <span className="flex items-center gap-2"><Droplets size={16}/> Salinity (PSU)</span>
              <span className="text-cyan-400">{salinity}</span>
            </label>
            <input type="range" min="30" max="40" value={salinity} onChange={(e) => setSalinity(Number(e.target.value))} className="w-full accent-cyan-500" />
          </div>
          <div>
            <label className="flex justify-between text-sm font-medium mb-2">
              <span className="flex items-center gap-2"><Battery size={16}/> Battery (%)</span>
              <span className="text-cyan-400">{battery}%</span>
            </label>
            <input type="range" min="0" max="100" value={battery} onChange={(e) => setBattery(Number(e.target.value))} className="w-full accent-cyan-500" />
          </div>
        </div>

        {/* Noise Level Buttons */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <SignalHigh size={16}/> Ambient Noise
          </label>
          <div className="flex gap-2">
            {['Low', 'Medium', 'High'].map(level => (
              <button 
                key={level}
                onClick={() => setNoise(level)}
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${noise === level ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={sendEnvironmentData}
          className="w-full mt-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-lg transition-colors"
        >
          Update Simulation
        </button>

        {status && <p className="text-center text-sm font-medium mt-2 text-cyan-300">{status}</p>}
      </div>
    </div>
  );
}