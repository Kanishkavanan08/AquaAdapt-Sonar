import { useState, useEffect } from 'react';
import axios from 'axios';
import { Compass, BatteryMedium, Gauge, Activity, Radio, ShieldAlert } from 'lucide-react';

export default function MissionControl() {
  const [status, setStatus] = useState<any>(null);

  const fetchStatus = async () => {
    try {
      const response = await axios.get('/api/system-status');
      setStatus(response.data);
    } catch (error) {
      console.error("Failed to fetch system status", error);
    }
  };

  // Fetch immediately and set up an interval to simulate real-time telemetry
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000); // Auto-refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  if (!status) {
    return (
      <div className="w-full max-w-4xl bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl mb-8 flex justify-center items-center h-32">
        <p className="text-cyan-400 animate-pulse font-mono">ESTABLISHING UPLINK TO AUV...</p>
      </div>
    );
  }

  const { environment, active_sonar, system_mode, system_health } = status;

  return (
    <div className="w-full max-w-4xl bg-slate-900 p-1 rounded-xl border border-slate-700 shadow-2xl mb-8 relative overflow-hidden">
      {/* Top Banner */}
      <div className="bg-slate-800 px-6 py-3 flex justify-between items-center border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Compass className="text-cyan-400 animate-spin-slow" size={24} />
          <h2 className="text-xl font-black text-white tracking-widest">MISSION CONTROL HUD</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-400 tracking-wider">MODE:</span>
          <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-md text-sm font-bold border border-cyan-500/50">
            {system_mode}
          </span>
          <span className={`px-3 py-1 rounded-md text-sm font-bold border ${system_health === 'NOMINAL' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'}`}>
            {system_health}
          </span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-1 bg-slate-700">
        
        {/* Environment Panel */}
        <div className="bg-slate-800 p-5 flex flex-col justify-center">
          <h3 className="text-slate-400 text-xs font-bold tracking-widest mb-4 flex items-center gap-2">
            <Activity size={14}/> TELEMETRY
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-1">DEPTH</p>
              <p className="text-2xl font-mono text-white">{environment.depth_m} <span className="text-sm text-slate-400">m</span></p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-1">BATTERY</p>
              <p className={`text-2xl font-mono flex items-center gap-2 ${environment.battery_percentage <= 30 ? 'text-red-400' : 'text-emerald-400'}`}>
                <BatteryMedium size={20}/> {environment.battery_percentage}%
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-1">WATER TEMP</p>
              <p className="text-xl font-mono text-white">{environment.temperature_c}°C</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-1">NOISE LEVEL</p>
              <p className={`text-xl font-mono font-bold ${environment.ambient_noise_level.toLowerCase() === 'high' ? 'text-red-400' : 'text-cyan-400'}`}>
                {environment.ambient_noise_level.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Active Sonar Panel */}
        <div className="bg-slate-800 p-5 flex flex-col justify-center">
          <h3 className="text-slate-400 text-xs font-bold tracking-widest mb-4 flex items-center gap-2">
            <Radio size={14}/> ACTIVE SONAR PAYLOAD
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-1">FREQUENCY</p>
              <p className="text-2xl font-mono text-cyan-400">{active_sonar.frequency_khz} <span className="text-sm">kHz</span></p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-1">WAVEFORM</p>
              <p className="text-xl font-mono text-white truncate">{active_sonar.waveform_type}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-1">TX POWER</p>
              <p className="text-xl font-mono text-yellow-400"><Gauge size={16} className="inline mr-1 mb-1"/>{active_sonar.power_percentage}%</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-1">PULSE DURATION</p>
              <p className="text-xl font-mono text-white">{active_sonar.pulse_duration_ms} ms</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}