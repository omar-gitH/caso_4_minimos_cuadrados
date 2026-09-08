import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TheoryTab } from './components/TheoryTab';
import { ModelComparisonTab } from './components/ModelComparisonTab';
import { ProcedureTab } from './components/ProcedureTab';
import { ClusterChart } from './components/ClusterChart';
import { ConclusionsTab } from './components/ConclusionsTab';
import { Activity, Beaker, BookOpen, ListChecks, Scale, Award } from 'lucide-react';

interface FitData {
  cluster: string;
  data_points: { x: number; y: number; especie: string }[];
  fit: {
    a: number;
    b: number;
    A_log?: number;
    equation: string;
    r2: number;
    r2_log?: number;
    S_t: number;
    S_r: number;
    curve: { x: number; y: number }[];
    residuals?: {
      especie: string;
      x: number;
      y_real: number;
      y_pred: number;
      residual: number;
      log_residual: number;
    }[];
    model_comparison?: {
      modelo: string;
      formula_general: string;
      ecuacion: string;
      r2: number;
      sr: number;
      es_optimo: boolean;
      justificacion: string;
    }[];
  };
}

const CLUSTER_INFO: Record<string, { title: string; color: string }> = {
  MAM: { title: 'Mamíferos', color: '#f59e0b' },
  AVE: { title: 'Aves', color: '#3b82f6' },
  REP: { title: 'Reptiles', color: '#10b981' },
  PEC: { title: 'Peces', color: '#6366f1' },
};

function App() {
  const [data, setData] = useState<Record<string, FitData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'theory' | 'models' | 'procedure' | 'simulations' | 'conclusions'>('theory');

  useEffect(() => {
    fetch('http://localhost:8000/api/fit-all')
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setError(json.error);
        } else {
          setData(json);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Error conectando al backend de FastAPI. Asegúrate de que está corriendo en el puerto 8000.');
        setLoading(false);
      });
  }, []);

  const tabs = [
    { id: 'theory', label: '1. Caso 4 y Teoría', icon: BookOpen },
    { id: 'models', label: '2. Modelos y Residuos', icon: Scale },
    { id: 'procedure', label: '3. Procedimiento', icon: ListChecks },
    { id: 'simulations', label: '4. Simulaciones', icon: Beaker },
    { id: 'conclusions', label: '5. Conclusiones', icon: Award },
  ] as const;

  return (
    <div className="min-h-screen p-3 sm:p-6 md:p-8 2xl:p-10 flex flex-col items-center">
      <div className="w-full max-w-[1700px] mx-auto space-y-8">
        
        {/* Header - Glassmorphism */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 md:p-12 text-center z-10"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500"></div>
          
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="p-4 bg-emerald-500/10 rounded-2xl mb-4 border border-emerald-500/20"
          >
            <Activity className="w-10 h-10 text-emerald-400" />
          </motion.div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1 rounded-full bg-white/5 text-emerald-400 border border-white/10">
              Caso 4 · Análisis Numérico UTN FRP
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-300">
            Masa Corporal vs Metabolismo Animal
          </h1>
          <p className="text-slate-300 max-w-3xl text-base sm:text-lg md:text-xl font-light leading-relaxed">
            Estudio Comparativo y Ajuste por Mínimos Cuadrados en Mamíferos, Aves, Reptiles y Peces
          </p>
        </motion.header>

        {/* Floating Tab Navigation */}
        <div className="sticky top-4 z-50 flex justify-center w-full px-2">
          <nav className="flex space-x-1 bg-slate-900/80 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-2xl overflow-x-auto max-w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center gap-2 py-2.5 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap outline-none cursor-pointer
                    ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 bg-emerald-600/90 rounded-full shadow-lg shadow-emerald-500/30"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <main className="relative min-h-[600px] w-full mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {activeTab === 'theory' && <TheoryTab />}
              
              {activeTab === 'models' && data && <ModelComparisonTab data={data} />}
              
              {activeTab === 'procedure' && <ProcedureTab />}
              
              {activeTab === 'simulations' && (
                <div className="space-y-8">
                  <div className="bg-slate-900/50 backdrop-blur-lg p-8 rounded-3xl border border-white/10 text-center w-full max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                      <Beaker className="w-8 h-8 text-emerald-400" />
                      Simulaciones y Gráficos por Clúster
                    </h2>
                    <p className="text-slate-300 text-base md:text-lg font-light leading-relaxed">
                      Nube de puntos de dispersión real con la curva del modelo potencial <strong className="text-emerald-300">y = a · x^b</strong> superpuesta para cada uno de los 4 grupos biológicos (22 especies por grupo, 88 en total).
                    </p>
                  </div>

                  {loading && (
                    <div className="flex flex-col justify-center items-center py-32 space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                      </div>
                      <p className="text-emerald-400 font-medium animate-pulse">Procesando y calculando mínimos cuadrados...</p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-500/10 text-red-200 p-8 rounded-2xl border border-red-500/20 shadow-lg max-w-4xl mx-auto flex items-start gap-4">
                      <div className="p-3 bg-red-500/20 rounded-full">
                        <Activity className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <strong className="font-bold text-xl block mb-2 text-red-400">Error de conexión al Backend</strong>
                        <p className="text-red-200/80">{error}</p>
                      </div>
                    </div>
                  )}

                  {data && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                      {Object.keys(CLUSTER_INFO).map((clusterId) => {
                        const clusterData = data[clusterId];
                        if (!clusterData) return null;

                        return (
                          <ClusterChart
                            key={clusterId}
                            title={CLUSTER_INFO[clusterId].title}
                            color={CLUSTER_INFO[clusterId].color}
                            dataPoints={clusterData.data_points}
                            curvePoints={clusterData.fit.curve}
                            equation={clusterData.fit.equation}
                            r2={clusterData.fit.r2}
                            a={clusterData.fit.a}
                            b={clusterData.fit.b}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'conclusions' && data && <ConclusionsTab data={data} />}

            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}

export default App;
