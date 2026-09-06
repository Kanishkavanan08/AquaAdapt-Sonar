import { useState, useEffect } from 'react';
import axios from 'axios';
import { Zap, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function EnergyAnalytics() {
  const [energyData, setEnergyData] = useState<any>(null);

  const fetchEnergyData = async () => {
    try {
      const response = await axios.get('/api/energy-analytics');
      setEnergyData(response.data);
    } catch (error) {
      console.error("Failed to fetch energy analytics", error);
    }
  };

  useEffect(() => {
    fetchEnergyData();
  }, []);

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl w-full max-w-4xl mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
          <Zap /> 24-Hour Energy Projection
        </h2>
        <button 
          onClick={fetchEnergyData}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Recalculate Power Matrix
        </button>
      </div>

      {!energyData ? (
        <p className="text-slate-400 text-center py-10">Calculating Joules and Watt-hours...</p>
      ) : (
        <div className="space-y-6">
          {/* Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center">
              <p className="text-slate-400 text-sm font-medium mb-1">Traditional Payload</p>
              <p className="text-2xl font-bold text-red-400 font-mono">{energyData.traditional_wh} Wh</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center">
              <p className="text-slate-400 text-sm font-medium mb-1">AquaAdapt Payload</p>
              <p className="text-2xl font-bold text-emerald-400 font-mono">{energyData.adaptive_wh} Wh</p>
            </div>
            <div className="bg-cyan-900/30 p-4 rounded-lg border border-cyan-500/50 text-center flex flex-col justify-center items-center">
              <p className="text-cyan-300 text-sm font-medium mb-1 flex items-center gap-1">
                <TrendingDown size={16}/> Total Battery Savings
              </p>
              <p className="text-3xl font-extrabold text-cyan-400">{energyData.savings_percent}%</p>
            </div>
          </div>

          {/* Recharts Bar Chart */}
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyData.chart_data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" label={{ value: 'Energy Consumed (Wh)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                <Bar dataKey="Traditional" fill="#ef4444" radius={[4, 4, 0, 0]} name="Fixed Sonar (Wh)" />
                <Bar dataKey="Adaptive" fill="#10b981" radius={[4, 4, 0, 0]} name="Adaptive Sonar (Wh)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}