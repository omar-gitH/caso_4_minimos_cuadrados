import { useEffect, useState } from 'react';
import { TheoryTab } from './components/TheoryTab';
import { PracticeTab } from './components/PracticeTab';
import { ProcedureTab } from './components/ProcedureTab';
import { ClusterChart } from './components/ClusterChart';
import { Activity, Beaker, BookOpen, Calculator, ListChecks } from 'lucide-react';

interface FitData {
  cluster: string;
  data_points: { x: number; y: number; especie: string }[];
  fit: {
    a: number;
    b: number;
    equation: string;
    r2: number;
    curve: { x: number; y: number }[];
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
  const [activeTab, setActiveTab] = useState<'theory' | 'practice' | 'procedure' | 'simulations'>('theory');

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
    { id: 'theory', label: 'Teoría', icon: BookOpen },
    { id: 'practice', label: 'Práctica', icon: Calculator },
    { id: 'procedure', label: 'Procedimiento', icon: ListChecks },
    { id: 'simulations', label: 'Simulaciones', icon: Beaker },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-900">
      <div className="w-full bg-white shadow-xl rounded-xl overflow-hidden flex flex-col border-t-4 border-emerald-600">
        <header className="bg-slate-900 text-white p-8 md:p-12 text-center flex flex-col items-center justify-center">
          <Activity className="w-16 h-16 text-emerald-400 mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Análisis Numérico: Caso 4
          </h1>
          <p className="text-slate-300 max-w-2xl text-xl mt-2 font-light">
            Masa Corporal vs Metabolismo - Ajuste de Curvas por Mínimos Cuadrados
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50 sticky top-0 z-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-3 py-5 px-6 text-base font-semibold transition-all whitespace-nowrap
                  ${isActive 
                    ? 'bg-white text-emerald-600 border-b-2 border-emerald-600 shadow-inner' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <main className="p-6 md:p-12 bg-slate-50/50 min-h-[600px]">
          {activeTab === 'theory' && <TheoryTab />}
          {activeTab === 'practice' && <PracticeTab />}
          {activeTab === 'procedure' && <ProcedureTab />}
          
          {activeTab === 'simulations' && (
            <div className="space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 text-center mb-8 w-full">
                <h2 className="text-2xl font-bold text-slate-800 mb-3 flex items-center justify-center gap-3">
                  <Beaker className="w-8 h-8 text-emerald-600" />
                  Simulaciones y Resultados
                </h2>
                <p className="text-slate-600 text-lg">
                  Gráficos de dispersión reales con la curva teórica superpuesta calculada en tiempo real por el backend de FastAPI. 
                  Nota cómo la escala de los ejes es logarítmica para distribuir mejor las variaciones extremas de masa corporal.
                </p>
              </div>

              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-700 p-6 rounded-lg border border-red-200 shadow-sm max-w-4xl mx-auto">
                  <strong className="font-bold text-lg block mb-2">¡Error de conexión!</strong>
                  <span>{error}</span>
                </div>
              )}

              {data && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
