import React, { useState } from 'react';
import { Scale, CheckCircle, XCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

interface FitData {
  cluster: string;
  data_points: { x: number; y: number; especie: string }[];
  fit: {
    a: number;
    b: number;
    equation: string;
    r2: number;
    r2_log?: number;
    S_r: number;
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

interface ModelComparisonTabProps {
  data: Record<string, FitData>;
}

const CLUSTERS = [
  { id: 'MAM', name: 'Mamíferos', color: '#f59e0b' },
  { id: 'AVE', name: 'Aves', color: '#3b82f6' },
  { id: 'REP', name: 'Reptiles', color: '#10b981' },
  { id: 'PEC', name: 'Peces', color: '#6366f1' },
];

export const ModelComparisonTab: React.FC<ModelComparisonTabProps> = ({ data }) => {
  const [selectedCluster, setSelectedCluster] = useState<string>('MAM');
  const [useLogResiduals, setUseLogResiduals] = useState<boolean>(true);

  const currentClusterData = data[selectedCluster];
  const fitInfo = currentClusterData?.fit;
  const modelComparison = fitInfo?.model_comparison || [];
  const residuals = fitInfo?.residuals || [];

  return (
    <div className="bg-slate-900/50 backdrop-blur-lg p-6 md:p-12 rounded-3xl shadow-2xl border border-white/10 w-full max-w-6xl xl:max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-amber-500/20 rounded-2xl border border-amber-500/30">
            <Scale className="text-amber-400 w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Criterio y Justificación
              </span>
              <span className="text-xs text-slate-400 font-mono">Consigna #2 y #4</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1">
              Selección de Modelos y Análisis de Residuos
            </h2>
          </div>
        </div>

        {/* Cluster Selector Tabs */}
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 gap-1.5 flex-wrap justify-center">
          {CLUSTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCluster(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                selectedCluster === c.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Explicación de la consigna */}
      <div className="bg-gradient-to-r from-amber-500/10 via-transparent to-transparent p-6 rounded-2xl border-l-4 border-amber-500 text-slate-300 font-light space-y-2">
        <h3 className="text-lg font-bold text-amber-300">Justificación Metodológica sin Prejuicio de Modelo</h3>
        <p className="text-sm md:text-base leading-relaxed">
          Como indica la consigna de la cátedra: <em>"Es importante no elegir el modelo de antemano ni confiarse por la forma aparente de los datos. La selección del ajuste debe estar justificada mediante los gráficos, la teoría, las medidas de bondad y el comportamiento de los residuos."</em>
        </p>
        <p className="text-sm text-slate-400">
          A continuación se presentan los 3 modelos evaluados mediante mínimos cuadrados para el clúster de <strong>{CLUSTERS.find(c => c.id === selectedCluster)?.name}</strong>:
        </p>
      </div>

      {/* Tabla Comparativa de Modelos */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
        <table className="w-full text-left border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-slate-400 uppercase text-xs tracking-wider">
              <th className="p-4">Modelo</th>
              <th className="p-4">Fórmula General</th>
              <th className="p-4">Ecuación Obtenida</th>
              <th className="p-4 text-center">Bondad (r²)</th>
              <th className="p-4 text-center">Residuo Cuadrático (Sr)</th>
              <th className="p-4">Evaluación y Diagnóstico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300 font-light">
            {modelComparison.map((m, idx) => (
              <tr 
                key={idx} 
                className={`transition-colors ${m.es_optimo ? 'bg-emerald-500/10 hover:bg-emerald-500/15' : 'hover:bg-white/[0.02]'}`}
              >
                <td className="p-4 font-bold text-white flex items-center gap-2">
                  {m.es_optimo ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  )}
                  {m.modelo}
                </td>
                <td className="p-4 text-slate-300 font-mono text-sm">
                  <InlineMath math={m.formula_general} />
                </td>
                <td className="p-4 font-mono text-xs md:text-sm text-emerald-300">
                  <InlineMath math={m.ecuacion} />
                </td>
                <td className="p-4 text-center">
                  <span className={`font-mono font-bold px-2.5 py-1 rounded-full text-xs md:text-sm ${
                    m.r2 >= 0.90 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    m.r2 >= 0.70 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {m.r2 < -99 ? '<< 0' : m.r2.toFixed(4)}
                  </span>
                </td>
                <td className="p-4 text-center font-mono text-xs text-slate-400">
                  {m.sr > 100000 ? '> 100,000' : m.sr.toFixed(2)}
                </td>
                <td className="p-4 text-xs md:text-sm leading-relaxed text-slate-300">
                  {m.justificacion}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección de Residuos */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
              Gráfico de Dispersión de Residuos ({CLUSTERS.find(c => c.id === selectedCluster)?.name})
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Observación directa del comportamiento aleatorio de los errores residuales <InlineMath math="\varepsilon_i = y_i - \hat{y}_i" />.
            </p>
          </div>

          {/* Toggle Log vs Linear Residuals */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setUseLogResiduals(true)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                useLogResiduals ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Espacio Logarítmico (Homocedástico)
            </button>
            <button
              onClick={() => setUseLogResiduals(false)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                !useLogResiduals ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Espacio Real (W)
            </button>
          </div>
        </div>

        {/* Residuals Chart */}
        <div className="h-[360px] w-full bg-black/30 rounded-2xl p-4 border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis 
                dataKey="x" 
                type="number" 
                name="Masa"
                scale="log"
                domain={['auto', 'auto']}
                label={{ value: 'Masa corporal (kg) [Escala Logarítmica]', position: 'insideBottom', offset: -12, fill: '#94a3b8' }}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
                stroke="#475569"
              />
              <YAxis 
                dataKey={useLogResiduals ? "log_residual" : "residual"} 
                type="number" 
                name="Residuo"
                label={{ 
                  value: useLogResiduals ? 'Residuo en ln: [ln(y) - ln(ŷ)]' : 'Residuo (W): [y - ŷ]', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { textAnchor: 'middle' }, 
                  fill: '#94a3b8', 
                  offset: -10 
                }}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                stroke="#475569"
              />
              <ReferenceLine y={0} stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 p-4 rounded-xl border border-white/20 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-white text-sm">{d.especie}</p>
                        <p className="text-slate-300">Masa: <span className="font-mono text-emerald-400">{d.x} kg</span></p>
                        <p className="text-slate-300">Real: <span className="font-mono text-white">{d.y_real.toFixed(3)} W</span></p>
                        <p className="text-slate-300">Estimado: <span className="font-mono text-white">{d.y_pred.toFixed(3)} W</span></p>
                        <p className="text-slate-300">Residuo: <span className={`font-mono font-bold ${d.residual >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {d.residual >= 0 ? `+${d.residual.toFixed(3)}` : d.residual.toFixed(3)} W
                        </span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                data={residuals} 
                fill="#38bdf8" 
                r={6} 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Diagnóstico de Residuos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle className="w-5 h-5" />
              Homocedasticidad en Log
            </div>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              En la escala logarítmica <InlineMath math="\ln(y)" />, la varianza del error es uniforme e independiente de la masa del animal, cumpliendo la hipótesis fundamental de Gauss-Markov.
            </p>
          </div>

          <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <AlertTriangle className="w-5 h-5" />
              Falla del Modelo Lineal
            </div>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              En el ajuste lineal, los animales masivos (como elefantes o vacas) dominan por completo el cálculo, arrojando errores relativos de más del <strong className="text-rose-400">10,000%</strong> en animales pequeños.
            </p>
          </div>

          <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <XCircle className="w-5 h-5" />
              Inviabilidad Exponencial
            </div>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              El modelo exponencial <InlineMath math="e^{bx}" /> predice una tasa metabólica que crece a velocidad explosiva, lo cual viola la ley biológica de conservación y da <InlineMath math="r^2 < 0" />.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
