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
  AVE: { title: 'Aves', color: '#3b82f6' },
  REP: { title: 'Reptiles', color: '#10b981' },
  PEC: { title: 'Peces', color: '#6366f1' },
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
    <div className="min-h-screen relative text-slate-100 flex flex-col items-center">
      
      {/* High-Performance Fixed Background Orbs (No Scroll Stutter across Chrome, Firefox, Opera GX, Edge) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu will-change-transform">
        <div className="absolute -top-[15%] -left-[10%] w-[550px] h-[550px] rounded-full bg-emerald-500/12 blur-[100px]"></div>
        <div className="absolute top-[35%] -right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-500/12 blur-[110px]"></div>
        <div className="absolute -bottom-[15%] left-[25%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[90px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1700px] p-3 sm:p-6 md:p-8 2xl:p-10 space-y-8">
        
        {/* Futuristic Glassmorphic Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative glass-panel rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 md:p-12 text-center"
        >
          {/* Top glowing laser line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500"></div>

          {/* Floating Pill Badges */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center mb-6">
            <span className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Caso 4 · Análisis Numérico
            </span>
            <span className="text-xs text-slate-400 font-mono px-3 py-1 rounded-full bg-white/5 border border-white/5">
              UTN Facultad Regional La Plata
            </span>
          </div>

          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="p-4 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl mb-4 border border-emerald-500/30 shadow-lg glow-emerald"
          >
            <Activity className="w-10 h-10 text-emerald-400" />
          </motion.div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-300 drop-shadow-sm">
            Masa Corporal vs Metabolismo Animal
          </h1>
          
          <p className="text-slate-300 max-w-3xl text-base sm:text-lg md:text-xl font-light leading-relaxed mb-6">
            Modelado Alométrico y Ajuste Riguroso por Mínimos Cuadrados en <strong className="text-amber-400">Mamíferos</strong>, <strong className="text-blue-400">Aves</strong>, <strong className="text-emerald-400">Reptiles</strong> y <strong className="text-indigo-400">Peces</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl text-left">
            <div className="p-3 bg-white/[0.03] hover:bg-white/[0.06] transition-colors rounded-xl border border-white/5 flex items-center gap-3">
              <Database className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="block text-[11px] text-slate-400 font-medium">Observaciones</span>
                <span className="text-sm font-bold text-white font-mono">88 Especies</span>
              </div>
            </div>
            <div className="p-3 bg-white/[0.03] hover:bg-white/[0.06] transition-colors rounded-xl border border-white/5 flex items-center gap-3">
              <GitBranch className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="block text-[11px] text-slate-400 font-medium">Clústeres</span>
                <span className="text-sm font-bold text-white font-mono">4 Grupos</span>
              </div>
            </div>
            <div className="p-3 bg-white/[0.03] hover:bg-white/[0.06] transition-colors rounded-xl border border-white/5 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="block text-[11px] text-slate-400 font-medium">Ley Biofísica</span>
                <span className="text-sm font-bold text-white font-mono">Kleiber (3/4)</span>
              </div>
            </div>
            <div className="p-3 bg-white/[0.03] hover:bg-white/[0.06] transition-colors rounded-xl border border-white/5 flex items-center gap-3">
              <Activity className="w-5 h-5 text-amber-400" />
              <div>
                <span className="block text-[11px] text-slate-400 font-medium">Ajuste (r²)</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">&gt; 0.9100</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Floating Futuristic HUD Tab Navigation with Horizontal Slider for Mobile & Tablet */}
        <div 
          ref={navContainerRef}
          className="sticky top-3 sm:top-4 z-50 flex items-center justify-center w-full max-w-full px-1 sm:px-4 pointer-events-none"
        >
          
          {/* Slider Left Arrow for Mobile / Tablet */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scrollNav('left')}
            className="mr-1 sm:mr-2 p-2 rounded-full glass-pill text-slate-300 hover:text-white hover:border-emerald-400/50 shadow-lg flex-shrink-0 cursor-pointer lg:hidden z-10 pointer-events-auto"
            title="Deslizar hacia la izquierda"
            aria-label="Deslizar a la izquierda"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          </motion.button>

          <nav 
            ref={navRef}
            className="flex space-x-1.5 sm:space-x-2 glass-pill p-1.5 sm:p-2 rounded-full overflow-x-auto slider-touch no-scrollbar max-w-full touch-pan-x scroll-smooth shadow-2xl pointer-events-auto"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative flex items-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3.5 sm:px-5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap outline-none cursor-pointer flex-shrink-0 shimmer-btn
                    ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-emerald-400/30"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </nav>

          {/* Slider Right Arrow for Mobile / Tablet */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scrollNav('right')}
            className="ml-1 sm:ml-2 p-2 rounded-full glass-pill text-slate-300 hover:text-white hover:border-emerald-400/50 shadow-lg flex-shrink-0 cursor-pointer lg:hidden z-10 pointer-events-auto"
            title="Deslizar hacia la derecha"
            aria-label="Deslizar a la derecha"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          </motion.button>

        </div>

        {/* Main Content Area */}
        <main ref={contentRef} className="relative min-h-[600px] w-full mt-4 scroll-mt-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full transform-gpu"
            >
              {activeTab === 'theory' && <TheoryTab />}
              
              {activeTab === 'models' && data && <ModelComparisonTab data={data} />}
              
              {activeTab === 'procedure' && <ProcedureTab />}
              
              {activeTab === 'simulations' && (
                <div className="space-y-8">
                  <div className="glass-panel p-8 rounded-3xl text-center w-full max-w-5xl mx-auto">
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
                    <div className="bg-rose-500/10 text-rose-200 p-8 rounded-2xl border border-rose-500/20 shadow-lg max-w-4xl mx-auto flex items-start gap-4">
                      <div className="p-3 bg-rose-500/20 rounded-full">
                        <Activity className="w-6 h-6 text-rose-400" />
                      </div>
                      <div>
                        <strong className="font-bold text-xl block mb-2 text-rose-400">Error de conexión al Backend</strong>
                        <p className="text-rose-200/80">{error}</p>
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
