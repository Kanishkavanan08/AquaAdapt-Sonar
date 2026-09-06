import { useState } from 'react';
import axios from 'axios';
import { BrainCircuit, CheckCircle2, Settings } from 'lucide-react';

export default function DecisionCenter() {
  const [decision, setDecision] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runOptimization = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/optimize-sonar');
      setDecision(response.data);
    } catch (error) {
      console.error("Optimization failed", error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl w-full max-w-4xl mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
          <BrainCircuit /> AI Decision Center (XAI)
        </h2>
        <button 
          onClick={runOptimization}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-purple-500/30"
        >
          {loading ? 'Evaluating...' : 'Run Adaptive Engine'}
        </button>
      </div>

      {!decision ? (
        <div className="text-center py-10 bg-slate-900 rounded-lg border border-slate-700">
          <p className="text-slate-400">Awaiting trigger to run optimization matrix...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Selected Configuration Panel */}
          <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings size={18} className="text-cyan-400"/> Optimal Parameters
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Frequency:</span>
                <span className="font-mono text-cyan-300">{decision.recommended_config.frequency_khz} kHz</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Waveform:</span>
                <span className="font-mono text-emerald-400">{decision.recommended_config.waveform_type}</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Tx Power:</span>
                <span className="font-mono text-yellow-400">{decision.recommended_config.power_percentage}%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="font-mono text-cyan-300">{decision.recommended_config.pulse_duration_ms} ms</span>
              </li>
            </ul>
          </div>

          {/* Explainable AI Reasons Panel */}
          <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BrainCircuit size={18} className="text-purple-400"/> Decision Reasoning
            </h3>
            <div className="space-y-4">
              {decision.explanations.map((reason: string, idx: number) => (
                <div key={idx} className="flex gap-3 items-start">
                  <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-300 leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}