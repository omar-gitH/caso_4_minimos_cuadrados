import React, { useState } from 'react';
import { Scale, CheckCircle, XCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
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
  { id: 'AVE', name: 'Aves', color: '#38bdf8' },
  { id: 'REP', name: 'Reptiles', color: '#34d399' },
  { id: 'PEC', name: 'Peces', color: '#818cf8' },
];

export const ModelComparisonTab: React.FC<ModelComparisonTabProps> = ({ data }) => {
  const [selectedCluster, setSelectedCluster] = useState<string>('MAM');
  const [useLogResiduals, setUseLogResiduals] = useState<boolean>(true);

  const currentClusterData = data[selectedCluster];
  const fitInfo = currentClusterData?.fit;
  const modelComparison = fitInfo?.model_comparison || [];
  const residuals = fitInfo?.residuals || [];

  return (
    <div className="bg-[#1e293b] p-4 sm:p-8 md:p-12 rounded-3xl shadow-lg border border-[#334155] w-full max-w-6xl xl:max-w-7xl mx-auto space-y-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#334155] pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 sm:p-4 bg-amber-950/40 text-amber-300 rounded-2xl border border-amber-800/40 shadow-xs">
            <Scale className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-3 py-0.5 rounded-full bg-amber-950/40 text-amber-300 border border-amber-800/40">
                Criterio y Justificación
              </span>
              <span className="text-xs text-slate-400 font-mono">Consigna #2 y #4</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight mt-1">
              Selección de Modelos y Análisis de Residuos
            </h2>
          </div>
        </div>

        {/* Cluster Selector Tabs */}
        <div className="flex bg-[#151e2e]/90 backdrop-blur-md p-1.5 rounded-2xl gap-1.5 overflow-x-auto slider-touch no-scrollbar max-w-full touch-pan-x justify-start sm:justify-center border border-[#334155]">
          {CLUSTERS.map((c) => {
            const isSelected = selectedCluster === c.id;
            return (
              <motion.button
                key={c.id}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCluster(c.id)}
                className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex-shrink-0 btn-shimmer ${isSelected ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]/60'
                  }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="cluster-tab"
                    className="absolute inset-0 rounded-xl border"
                    style={{
                      backgroundColor: `${c.color}22`,
                      borderColor: c.color,
                      boxShadow: `0 0 18px ${c.color}40, inset 0 1px 0 rgba(255,255,255,0.15)`,
                    }}
                    transition={{ type: "spring", stiffness: 480, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full transition-transform duration-200"
                    style={{
                      backgroundColor: c.color,
                      boxShadow: isSelected ? `0 0 10px ${c.color}` : 'none'
                    }}
                  />
                  {c.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Explicación de la consigna */}
      <div className="bg-[#1a2436] p-5 sm:p-6 rounded-2xl border-l-4 border-amber-500 border border-[#334155] text-slate-200 space-y-1.5 shadow-xs">
        <h3 className="text-base sm:text-lg font-bold text-amber-300">Justificación Metodológica sin Prejuicio de Modelo</h3>
        <p className="text-sm md:text-base leading-relaxed font-normal text-slate-300">
          Como indica la consigna de la cátedra: <em>"Es importante no elegir el modelo de antemano ni confiarse por la forma aparente de los datos. La selección del ajuste debe estar justificada mediante los gráficos, la teoría, las medidas de bondad y el comportamiento de los residuos."</em>
        </p>
        <p className="text-xs sm:text-sm text-slate-400">
          A continuación se presentan los 3 modelos evaluados mediante mínimos cuadrados para el clúster de <strong className="text-slate-200">{CLUSTERS.find(c => c.id === selectedCluster)?.name}</strong>:
        </p>
      </div>

      {/* Tabla Comparativa de Modelos */}
      <div className="space-y-1">
        <div className="overflow-x-auto slider-touch rounded-2xl border border-[#334155] bg-[#1a2436] shadow-xs">
          <table className="w-full text-left border-collapse text-sm md:text-base min-w-[650px]">
            <thead>
              <tr className="bg-[#243147] border-b border-[#334155] text-slate-300 uppercase text-xs tracking-wider font-semibold">
                <th className="p-4">Modelo</th>
                <th className="p-4">Fórmula General</th>
                <th className="p-4">Ecuación Obtenida</th>
                <th className="p-4 text-center">Bondad (r²)</th>
                <th className="p-4 text-center">Residuo (Sr)</th>
                <th className="p-4">Evaluación y Diagnóstico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155] text-slate-300 font-normal">
              {modelComparison.map((m, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${m.es_optimo ? 'bg-emerald-950/30 hover:bg-emerald-950/45' : 'hover:bg-[#243147]/50'}`}
                >
                  <td className="p-4 font-bold text-slate-100 flex items-center gap-2">
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
                  <td className="p-4 font-mono text-xs md:text-sm text-slate-100 font-semibold">
                    <InlineMath math={m.ecuacion} />
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-mono font-bold px-2.5 py-1 rounded-full text-xs md:text-sm ${m.r2 >= 0.90 ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' :
                        m.r2 >= 0.70 ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40' :
                          'bg-rose-950/40 text-rose-300 border border-rose-800/40'
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
      </div>

      {/* Sección de Residuos */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              Gráfico de Dispersión de Residuos ({CLUSTERS.find(c => c.id === selectedCluster)?.name})
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Observación directa del comportamiento aleatorio de los residuos <InlineMath math="\varepsilon_i = y_i - \hat{y}_i" />.
            </p>
          </div>

          {/* Toggle Log vs Real Residuals */}
          <div className="flex items-center bg-[#151e2e]/90 backdrop-blur-md p-1.5 rounded-xl text-xs gap-1.5 border border-[#334155] relative shadow-inner">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setUseLogResiduals(true)}
              className={`relative px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer btn-shimmer ${useLogResiduals ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              {useLogResiduals && (
                <motion.div
                  layoutId="residual-toggle"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-lg shadow-[0_0_16px_rgba(59,130,246,0.45)] border border-blue-400/30"
                  transition={{ type: "spring", stiffness: 480, damping: 30 }}
                />
              )}
              <span className="relative z-10">Espacio Logarítmico (Homocedástico)</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setUseLogResiduals(false)}
              className={`relative px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer btn-shimmer ${!useLogResiduals ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              {!useLogResiduals && (
                <motion.div
                  layoutId="residual-toggle"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-lg shadow-[0_0_16px_rgba(59,130,246,0.45)] border border-blue-400/30"
                  transition={{ type: "spring", stiffness: 480, damping: 30 }}
                />
              )}
              <span className="relative z-10">Espacio Real (W)</span>
            </motion.button>
          </div>
        </div>

        {/* Residuals Chart */}
        <div className="h-[360px] w-full bg-[#1a2436] rounded-2xl p-4 border border-[#334155]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="x"
                type="number"
                name="Masa"
                scale="log"
                domain={['auto', 'auto']}
                label={{ value: 'Masa corporal (kg) [Escala Logarítmica]', position: 'insideBottom', offset: -12, fill: '#cbd5e1' }}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val}
                stroke="#64748b"
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
                  fill: '#cbd5e1',
                  offset: -10
                }}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                stroke="#64748b"
              />
              <ReferenceLine y={0} stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#243147] p-3.5 rounded-xl border border-[#334155] shadow-xl text-xs space-y-1">
                        <p className="font-bold text-slate-100 text-sm">{d.especie}</p>
                        <p className="text-slate-300">Masa: <span className="font-mono font-semibold text-sky-400">{d.x} kg</span></p>
                        <p className="text-slate-300">Real: <span className="font-mono font-semibold text-slate-200">{d.y_real.toFixed(3)} W</span></p>
                        <p className="text-slate-300">Estimado: <span className="font-mono font-semibold text-slate-200">{d.y_pred.toFixed(3)} W</span></p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 bg-[#243147] rounded-2xl border border-[#334155] space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm sm:text-base">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Homocedasticidad en Log
            </div>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              En la escala logarítmica <InlineMath math="\ln(y)" />, la dispersión residual es uniforme e independiente de la masa, validando la hipótesis de Gauss-Markov.
            </p>
          </div>

          <div className="p-5 bg-[#243147] rounded-2xl border border-[#334155] space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Falla del Modelo Lineal
            </div>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              En el modelo lineal, los especímenes de gran masa distorsionan el ajuste, generando errores relativos inaceptables de más del <strong className="text-rose-400">10,000%</strong> en especies pequeñas.
            </p>
          </div>

          <div className="p-5 bg-[#243147] rounded-2xl border border-[#334155] space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm sm:text-base">
              <XCircle className="w-5 h-5 text-rose-400" />
              Inviabilidad Exponencial
            </div>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              El modelo exponencial <InlineMath math="e^{bx}" /> predice una tasa que crece de forma explosiva, incompatible con la biofísica real y resultando en <InlineMath math="r^2 < 0" />.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
