import EnvironmentSimulator from './EnvironmentSimulator';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">AquaAdapt <span className="text-cyan-500">Sonar</span></h1>
        <p className="text-slate-400">SIH 2026 Prototype • AUV Software-Defined Sonar</p>
      </div>
      
      <EnvironmentSimulator />
    </div>
  );
}

export default App;