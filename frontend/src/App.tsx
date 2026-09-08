import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TheoryTab } from './components/TheoryTab';
import { ModelComparisonTab } from './components/ModelComparisonTab';
import { ProcedureTab } from './components/ProcedureTab';
import { ClusterChart } from './components/ClusterChart';
import { ConclusionsTab } from './components/ConclusionsTab';
import { Activity, Beaker, BookOpen, ListChecks, Scale, Award, Sparkles, Database, GitBranch, ChevronLeft, ChevronRight } from 'lucide-react';

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
  AVE: { title: 'Aves', color: '#38bdf8' },
  REP: { title: 'Reptiles', color: '#34d399' },
  PEC: { title: 'Peces', color: '#818cf8' },
};

function App() {
  const [data, setData] = useState<Record<string, FitData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'theory' | 'models' | 'procedure' | 'simulations' | 'conclusions'>('theory');
  const navRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);

    if (contentRef.current) {
      // Posición absoluta del inicio del contenido en la página
      const contentTop = contentRef.current.getBoundingClientRect().top + window.scrollY;
      // Altura del HUD de navegación flotante más margen de respiro
      const navOffset = (navContainerRef.current?.offsetHeight ?? 54) + 20;
      const targetScroll = Math.max(0, contentTop - navOffset);

      // Si el usuario scrolleó hacia abajo y la barra fija está arriba de todo
      if (window.scrollY > targetScroll) {
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth',
        });
      }
    }
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (navRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      navRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
    <div className="min-h-screen relative bg-[#151e2e] text-slate-200 flex flex-col items-center">
      
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] rounded-full bg-blue-600/[0.05] blur-[100px]"></div>
        <div className="absolute top-[30%] -right-[5%] w-[500px] h-[500px] rounded-full bg-indigo-600/[0.05] blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1700px] p-3 sm:p-6 md:p-8 2xl:p-10 space-y-8">
        
        {/* Modern Academic Header (Balanced Slate Theme, High Contrast) */}
        <motion.header 
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative bg-[#1e293b] rounded-3xl border border-[#334155] shadow-lg overflow-hidden flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 text-center"
        >
          {/* Top subtle primary accent line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 opacity-80"></div>

          {/* Institutional Badges */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center mb-5">
            <span className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider px-3.5 py-1.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/40">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Caso 4 · Análisis Numérico
            </span>
            <span className="text-xs text-slate-300 font-mono px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700">
              UTN Facultad Regional La Plata
            </span>
          </div>

          <div className="p-3.5 bg-blue-950/60 text-blue-300 rounded-2xl mb-3.5 border border-blue-800/40 shadow-xs">
            <Activity className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-slate-100">
            Masa Corporal vs Metabolismo Animal
          </h1>
          
          <p className="text-slate-300 max-w-3xl text-base sm:text-lg font-normal leading-relaxed mb-6">
            Modelado Alométrico y Ajuste Riguroso por Mínimos Cuadrados en{' '}
            <strong className="text-amber-300 font-semibold">Mamíferos</strong>,{' '}
            <strong className="text-blue-300 font-semibold">Aves</strong>,{' '}
            <strong className="text-emerald-300 font-semibold">Reptiles</strong> y{' '}
            <strong className="text-indigo-300 font-semibold">Peces</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl text-left">
            <motion.div 
              whileHover={{ y: -2, scale: 1.02 }}
              className="p-3 bg-[#243147]/90 hover:bg-[#2a3850] transition-all rounded-xl border border-[#334155] hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] flex items-center gap-3 cursor-default btn-shimmer"
            >
              <div className="p-1.5 bg-blue-950/60 rounded-lg text-blue-400 border border-blue-800/40">
                <Database className="w-4 h-4 flex-shrink-0" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-medium">Observaciones</span>
                <span className="text-sm font-bold text-slate-100 font-mono">88 Especies</span>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ y: -2, scale: 1.02 }}
              className="p-3 bg-[#243147]/90 hover:bg-[#2a3850] transition-all rounded-xl border border-[#334155] hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] flex items-center gap-3 cursor-default btn-shimmer"
            >
              <div className="p-1.5 bg-indigo-950/60 rounded-lg text-indigo-400 border border-indigo-800/40">
                <GitBranch className="w-4 h-4 flex-shrink-0" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-medium">Clústeres</span>
                <span className="text-sm font-bold text-slate-100 font-mono">4 Grupos</span>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ y: -2, scale: 1.02 }}
              className="p-3 bg-[#243147]/90 hover:bg-[#2a3850] transition-all rounded-xl border border-[#334155] hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center gap-3 cursor-default btn-shimmer"
            >
              <div className="p-1.5 bg-amber-950/60 rounded-lg text-amber-400 border border-amber-800/40">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-medium">Ley Biofísica</span>
                <span className="text-sm font-bold text-slate-100 font-mono">Kleiber (3/4)</span>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ y: -2, scale: 1.02 }}
              className="p-3 bg-[#243147]/90 hover:bg-[#2a3850] transition-all rounded-xl border border-[#334155] hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center gap-3 cursor-default btn-shimmer"
            >
              <div className="p-1.5 bg-emerald-950/60 rounded-lg text-emerald-400 border border-emerald-800/40">
                <Activity className="w-4 h-4 flex-shrink-0" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-medium">Ajuste (r²)</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">&gt; 0.9100</span>
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Modern Clean Floating Tab Navigation */}
        <div 
          ref={navContainerRef}
          className="sticky top-3 sm:top-4 z-50 flex items-center justify-center w-full max-w-full px-1 sm:px-4 pointer-events-none"
        >
          
          {/* Slider Left Arrow */}
          <motion.button
            whileHover={{ scale: 1.12, y: -1 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => scrollNav('left')}
            className="mr-2 p-2.5 rounded-full bg-[#1e293b]/95 text-slate-300 hover:text-white hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.35)] border border-[#334155] shadow-lg flex-shrink-0 cursor-pointer lg:hidden z-10 pointer-events-auto transition-all btn-shimmer"
            title="Deslizar hacia la izquierda"
            aria-label="Deslizar a la izquierda"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200" />
          </motion.button>

          <nav 
            ref={navRef}
            className="flex space-x-1 sm:space-x-2 bg-[#1e293b]/90 backdrop-blur-xl p-1.5 sm:p-2 rounded-full border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.4)] overflow-x-auto slider-touch no-scrollbar max-w-full touch-pan-x scroll-smooth pointer-events-auto"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative flex items-center gap-2 py-2.5 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap outline-none cursor-pointer flex-shrink-0 btn-shimmer
                    ${isActive ? 'text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-full shadow-[0_0_24px_rgba(59,130,246,0.55)] border border-blue-400/40"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={`w-4 h-4 transition-all duration-300 ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-slate-400'}`} />
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </nav>

          {/* Slider Right Arrow */}
          <motion.button
            whileHover={{ scale: 1.12, y: -1 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => scrollNav('right')}
            className="ml-2 p-2.5 rounded-full bg-[#1e293b]/95 text-slate-300 hover:text-white hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.35)] border border-[#334155] shadow-lg flex-shrink-0 cursor-pointer lg:hidden z-10 pointer-events-auto transition-all btn-shimmer"
            title="Deslizar hacia la derecha"
            aria-label="Deslizar a la derecha"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200" />
          </motion.button>

        </div>

        {/* Main Content Area */}
        <main ref={contentRef} className="relative min-h-[600px] w-full mt-4 scroll-mt-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full transform-gpu"
            >
              {activeTab === 'theory' && <TheoryTab />}
              
              {activeTab === 'models' && data && <ModelComparisonTab data={data} />}
              
              {activeTab === 'procedure' && <ProcedureTab />}
              
              {activeTab === 'simulations' && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-6 sm:p-8 rounded-3xl text-center w-full max-w-5xl mx-auto border border-[#334155] shadow-lg">
                    <div className="inline-flex p-3 bg-blue-950/60 text-blue-300 rounded-2xl mb-3 border border-blue-800/40 shadow-xs">
                      <Beaker className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
                      Simulaciones y Gráficos por Clúster
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-3xl mx-auto">
                      Dispersión de observaciones empíricas reales con la curva del modelo potencial{' '}
                      <span className="font-semibold text-slate-100 px-2 py-0.5 bg-[#1a2436] rounded-md border border-[#334155]">
                        y = a · x^b
                      </span>{' '}
                      superpuesta para cada uno de los 4 grupos biológicos (22 especies por grupo, 88 en total).
                    </p>
                  </div>

                  {loading && (
                    <div className="flex flex-col justify-center items-center py-28 space-y-4">
                      <div className="relative">
                        <div className="w-14 h-14 border-4 border-slate-700 rounded-full"></div>
                        <div className="w-14 h-14 border-4 border-blue-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                      </div>
                      <p className="text-slate-300 font-medium animate-pulse">Procesando y calculando mínimos cuadrados...</p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-rose-950/40 text-rose-200 p-6 sm:p-8 rounded-2xl border border-rose-800/50 shadow-xs max-w-4xl mx-auto flex items-start gap-4">
                      <div className="p-2.5 bg-rose-900/60 rounded-xl text-rose-300 flex-shrink-0">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <strong className="font-bold text-lg block mb-1 text-rose-100">Error de conexión al Backend</strong>
                        <p className="text-rose-300 text-sm">{error}</p>
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
