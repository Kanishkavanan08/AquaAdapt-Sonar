import EnvironmentSimulator from './EnvironmentSimulator';
import SignalLab from './SignalLab';
import WaveformGenerator from './WaveformGenerator';
import DecisionCenter from './DecisionCenter'; // NEW IMPORT

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">AquaAdapt <span className="text-cyan-500">Sonar</span></h1>
        <p className="text-slate-400">SIH 2026 Prototype • AUV Software-Defined Sonar</p>
      </div>
      
      <div className="w-full max-w-4xl flex flex-col items-center gap-8">
        <EnvironmentSimulator />
        <DecisionCenter /> {/* MOVED DECISION CENTER UP FOR BETTER UX */}
        <SignalLab />
        <WaveformGenerator />
      </div>
    </div>
  );
}

export default App;