import { useState } from 'react';
import axios from 'axios';
import { Layers, Trophy, AlertTriangle } from 'lucide-react';

export default function DigitalTwin() {
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/digital-twin');
      setSimulations(response.data);
    } catch (error) {
      console.error("Simulation failed", error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl w-full max-w-4xl mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
          <Layers /> Digital Twin Simulator
        </h2>
        <button 
          onClick={runSimulation}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-indigo-500/30"
        >
          {loading ? 'Simulating...' : 'Run Scenario Matrix'}
        </button>
      </div>

      {!simulations.length ? (
        <div className="text-center py-10 bg-slate-900 rounded-lg border border-slate-700">
          <p className="text-slate-400">Run the simulation to compare sonar configurations.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-300">
                <th className="p-4 rounded-tl-lg font-semibold">Configuration</th>
                <th className="p-4 font-semibold text-center">Signal Quality</th>
                <th className="p-4 font-semibold text-center">Noise Resist</th>
                <th className="p-4 font-semibold text-center">Energy Eff.</th>
                <th className="p-4 rounded-tr-lg font-bold text-right text-cyan-400">Final Score</th>
              </tr>
            </thead>
            <tbody>
              {simulations.map((sim, idx) => (
                <tr 
                  key={sim.id} 
                  className={`border-b border-slate-700 ${sim.is_best ? 'bg-cyan-900/20' : 'bg-slate-800'}`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {sim.is_best ? <Trophy size={16} className="text-yellow-400" /> : null}
                      {sim.id === 'traditional' ? <AlertTriangle size={16} className="text-red-400" /> : null}
                      <div>
                        <p className={`font-bold ${sim.is_best ? 'text-cyan-400' : 'text-white'}`}>{sim.name}</p>
                        <p className="text-xs text-slate-400 font-mono mt-1">{sim.parameters}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center text-slate-300 font-mono">{sim.scores.signal_quality} / 100</td>
                  <td className="p-4 text-center text-slate-300 font-mono">{sim.scores.noise_resistance} / 100</td>
                  <td className="p-4 text-center text-slate-300 font-mono">{sim.scores.energy_efficiency} / 100</td>
                  <td className="p-4 text-right">
                    <span className={`px-3 py-1 rounded-full font-bold text-lg ${sim.is_best ? 'bg-cyan-500 text-slate-900' : 'text-slate-400'}`}>
                      {sim.scores.final_score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-4 text-center">
            *SIMULATED ESTIMATES based on calculated acoustic and energy efficiency models.
          </p>
        </div>
      )}
    </div>
  );
}