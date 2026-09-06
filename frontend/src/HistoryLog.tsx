import { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, Clock } from 'lucide-react';

export default function HistoryLog() {
  const [logs, setLogs] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/history');
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  useEffect(() => {
    fetchHistory();
    // Poll every 5 seconds to catch new DB entries
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl w-full max-w-4xl mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
          <Database /> Database Logging & History
        </h2>
        <button onClick={fetchHistory} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-2">
          <Clock size={14}/> Sync DB
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-900 text-slate-400">
              <th className="p-3 rounded-tl-lg">Time</th>
              <th className="p-3">Environment (Depth / Bat / Noise)</th>
              <th className="p-3 rounded-tr-lg">AI Configuration (Freq / Wave / Pwr)</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-slate-500">No database records found. Run the Adaptive Engine.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-slate-700 hover:bg-slate-750 transition-colors">
                  <td className="p-3 font-mono text-cyan-500">{log.timestamp}</td>
                  <td className="p-3 text-slate-300">
                    {log.depth_m}m | {log.battery}% | {log.noise}
                  </td>
                  <td className="p-3 font-mono text-emerald-400">
                    {log.freq_khz}kHz | {log.waveform} | {log.power}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}