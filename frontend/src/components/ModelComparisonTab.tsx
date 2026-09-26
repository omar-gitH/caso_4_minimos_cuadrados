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
      r2_log?: number;
      r2_inv?: number;
      r2_real?: number;
      sr: number;
      sr_real?: number;
      espacio_evaluacion?: string;
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
          A continuación se contrastan los <strong className="text-slate-200">5 modelos canónicos del apunte teórico</strong> (Págs. 4 a 8: Lineal, Polinómico, Potencial, Exponencial y Cociente) evaluados mediante mínimos cuadrados para el clúster de <strong className="text-slate-200">{CLUSTERS.find(c => c.id === selectedCluster)?.name}</strong>:
        </p>
      </div>

      {/* Tabla Comparativa de Modelos */}
      <div className="space-y-1">
        <div className="overflow-x-auto slider-touch rounded-2xl border border-[#334155] bg-[#1a2436] shadow-xs">
          <table className="w-full text-left border-collapse text-sm md:text-base min-w-[750px]">
            <thead>
              <tr className="bg-[#243147] border-b border-[#334155] text-slate-300 uppercase text-xs tracking-wider font-semibold">
                <th className="p-4">Modelo</th>
                <th className="p-4">Fórmula General</th>
                <th className="p-4">Ecuación Obtenida</th>
                <th className="p-4 text-center">Espacio de Cálculo (Pág. 8)</th>
                <th className="p-4 text-center">Bondad (r²)</th>
                <th className="p-4 text-center">Residuo (Sr)</th>
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
                    <span>{m.modelo}</span>
                  </td>
                  <td className="p-4 text-slate-300 font-mono text-sm">
                    <InlineMath math={m.formula_general} />
                  </td>
                  <td className="p-4 font-mono text-xs md:text-sm text-slate-100 font-semibold">
                    <InlineMath math={m.ecuacion} />
                  </td>
                  <td className="p-4 text-center font-mono text-xs text-slate-300">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 whitespace-nowrap">
                      {m.espacio_evaluacion || 'Pág. 8 Apunte'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`font-mono font-bold px-2.5 py-1 rounded-full text-xs md:text-sm ${
                        m.r2 >= 0.85
                          ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50'
                          : 'bg-rose-950/50 text-rose-300 border border-rose-800/50'
                      }`}>
                        {m.r2 < -99 ? '<< 0' : m.r2.toFixed(4)}
                      </span>
                      {m.r2_real !== undefined && Math.abs(m.r2_real - m.r2) > 0.001 && (
                        <span className="text-[11px] font-mono text-slate-400">
                          r² real: {m.r2_real < -99 ? '<< 0' : m.r2_real.toFixed(4)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center font-mono text-xs text-slate-400">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-slate-200 font-semibold">{m.sr > 100000 ? '> 100,000' : m.sr.toFixed(4)}</span>
                      {m.sr_real !== undefined && Math.abs(m.sr_real - m.sr) > 0.01 && (
                        <span className="text-[10px] text-slate-500 font-sans">
                          real: {m.sr_real > 100000 ? '> 100k' : m.sr_real.toFixed(1)}
                        </span>
                      )}
                    </div>
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

        {/* Diagnóstico de Residuos y Justificación Biofísica de Modelos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          <div className="p-5 bg-[#243147] rounded-2xl border border-emerald-900/60 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm sm:text-base">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              1. Homocedasticidad (Modelo Potencial)
            </div>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              En la escala logarítmica <InlineMath math="\ln(y)" />, la dispersión residual es simétrica y de varianza uniforme, validando el teorema de Gauss-Markov. Es el único modelo con fundamento en las redes fractales de transporte biológico (Ley de Kleiber).
            </p>
          </div>

          <div className="p-5 bg-[#243147] rounded-2xl border border-amber-900/60 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              2. Falla del Modelo Lineal
            </div>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              La recta impone una ordenada al origen <InlineMath math="a_1 > 0" /> (gasto calórico con masa cero) y una pendiente constante. Los animales pesados dominan las sumatorias, provocando errores relativos inaceptables de más del <strong className="text-amber-400">10,000%</strong> en especies pequeñas.
            </p>
          </div>

          <div className="p-5 bg-[#243147] rounded-2xl border border-purple-900/60 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm sm:text-base">
              <AlertTriangle className="w-5 h-5 text-purple-400" />
              3. Inviabilidad Polinómica (Overfitting)
            </div>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Aunque la parábola de 2do orden incrementa <InlineMath math="r^2" /> gracias a un 3er parámetro libre (<InlineMath math="a_2" />), el término cuadrático resulta negativo (<InlineMath math="a_2 < 0" />). Esto predice que para animales grandes el metabolismo decrecería hasta volverse negativo (<InlineMath math="\lim_{x \to \infty} y = -\infty" />).
            </p>
          </div>

          <div className="p-5 bg-[#243147] rounded-2xl border border-rose-900/60 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm sm:text-base">
              <XCircle className="w-5 h-5 text-rose-400" />
              4. Inviabilidad Exponencial (Pág. 7 y 8)
            </div>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Evaluado según la Pág. 8 del apunte en <InlineMath math="\text{Ln}(y)" />, su coeficiente <InlineMath math="r^2 \approx 0.27 - 0.47" /> no supera el umbral de aceptación (<InlineMath math="r^2 > 0.85" />). En espacio real predice tasas térmicas que harían hervir los tejidos de animales grandes.
            </p>
          </div>

          <div className="p-5 bg-[#243147] rounded-2xl border border-sky-900/60 space-y-2 shadow-xs md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 text-sky-300 font-bold text-sm sm:text-base">
              <XCircle className="w-5 h-5 text-sky-400" />
              5. Incompatibilidad del Modelo del Cociente (Pág. 6-8)
            </div>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              El ajuste del cociente linealizado por inversión <InlineMath math="1/y" /> es óptimo para cinéticas enzimáticas con saturación (Michaelis-Menten). Sin embargo, en alometría animal impone una cota máxima asintótica artificial (<InlineMath math="y \to a \approx 1-6 \text{ W}" />), cuando mamíferos y peces grandes alcanzan miles de Watts.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
