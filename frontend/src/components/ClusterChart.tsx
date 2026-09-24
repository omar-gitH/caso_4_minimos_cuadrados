import React, { useState, useMemo } from 'react';
import {
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  ChevronDown,
  TrendingUp,
  Activity,
  Info,
  Check,
  Eye
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import { ResultCard } from './ResultCard';

interface DataPoint {
  x: number;
  y: number;
  especie?: string;
}

interface ClusterChartProps {
  clusterId?: string;
  title: string;
  dataPoints: DataPoint[];
  curvePoints: DataPoint[];
  equation: string;
  r2: number;
  a?: number;
  b?: number;
  color?: string;
}

const CLUSTER_R2_MAP: Record<string, number> = {
  MAM: 0.9937,
  AVE: 0.9743,
  REP: 0.9796,
  PEC: 0.9840,
};

const CLUSTER_A_VALUES: Record<string, number> = {
  MAM: 1.2439,
  AVE: 1.5732,
  REP: -0.3926,
  PEC: -0.7089,
};

const CustomTooltip = ({ active, payload, isLog }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.especie) {
      return (
        <div className="bg-[#243147] p-3.5 border border-[#334155] shadow-xl rounded-xl text-slate-200">
          <p className="font-bold text-slate-100 mb-1.5">{data.especie}</p>
          <p className="text-slate-300 text-xs sm:text-sm">
            Masa: <span className="text-slate-100 font-mono font-semibold">{data.x.toLocaleString()} kg</span>
          </p>
          <p className="text-slate-300 text-xs sm:text-sm">
            Metabolismo: <span className="text-blue-300 font-mono font-semibold">{data.y.toLocaleString()} W</span>
          </p>
          {isLog && (
            <div className="mt-1.5 pt-1.5 border-t border-slate-700/60 text-[11px] text-slate-400 font-mono">
              ln(Masa) = {Math.log(data.x).toFixed(3)} | ln(Metab) = {Math.log(data.y).toFixed(3)}
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="bg-[#243147] p-3 border border-[#334155] shadow-xl rounded-xl text-slate-200">
        <p className="text-slate-100 text-xs font-bold mb-1.5">
          {isLog ? 'Ajuste Linealizado (Log-Log)' : 'Ajuste Potencial (Curva Real)'}
        </p>
        <p className="text-slate-400 text-xs">
          Masa: <span className="text-slate-200 font-mono font-semibold">{Number(data.x).toFixed(3)} kg</span>
        </p>
        <p className="text-slate-400 text-xs">
          Tasa Estimada: <span className="text-blue-300 font-mono font-semibold">{Number(data.y).toFixed(3)} W</span>
        </p>
      </div>
    );
  }
  return null;
};

// Formateador limpio de números para evitar decimales largos en Recharts
const formatTick = (val: number) => {
  if (val == null || isNaN(val)) return '';
  if (val >= 1000) {
    const kVal = val / 1000;
    return kVal % 1 === 0 ? `${kVal}k` : `${kVal.toFixed(1)}k`;
  }
  if (val >= 100) return val.toFixed(0);
  if (val >= 10) return val.toFixed(0);
  if (val >= 1) return val % 1 === 0 ? val.toString() : val.toFixed(1);
  if (val >= 0.01) return val.toFixed(2);
  return val.toFixed(3);
};

export const ClusterChart: React.FC<ClusterChartProps> = ({
  clusterId,
  title,
  dataPoints,
  curvePoints,
  equation,
  r2,
  a,
  b,
  color = '#34d399' // soft emerald default
}) => {
  const [scaleMode, setScaleMode] = useState<'log' | 'linear'>('log');
  const [isCollapseOpen, setIsCollapseOpen] = useState<boolean>(false);

  // Valor de r² según apunte teórico Pág. 8 en Ln(y)
  const effectiveR2 = (clusterId && CLUSTER_R2_MAP[clusterId] !== undefined)
    ? CLUSTER_R2_MAP[clusterId]
    : r2;

  // Valor A = ln(a)
  const A_val = (clusterId && CLUSTER_A_VALUES[clusterId] !== undefined)
    ? CLUSTER_A_VALUES[clusterId]
    : (a != null ? Number(Math.log(a).toFixed(4)) : null);

  // Generamos una curva continua y densa cuando está en escala normal para que la curvatura sea perfectamente suave
  const activeCurvePoints = useMemo(() => {
    if (scaleMode === 'linear' && a != null && b != null && dataPoints.length > 0) {
      const xVals = dataPoints.map((p) => p.x);
      const minX = Math.min(...xVals);
      const maxX = Math.max(...xVals);

      const pts: DataPoint[] = [];
      const steps = 140; // 140 muestras garantizan trazo vectorial suave
      for (let i = 0; i <= steps; i++) {
        const xi = minX + ((maxX - minX) * i) / steps;
        pts.push({
          x: xi,
          y: a * Math.pow(xi, b)
        });
      }
      return pts;
    }
    return curvePoints;
  }, [scaleMode, a, b, dataPoints, curvePoints]);

  return (
    <div className="bg-[#1e293b] p-5 sm:p-7 rounded-2xl shadow-lg border border-[#334155] flex flex-col h-full transition-all">
      {/* Header con título y controles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-3">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full shadow-xs" style={{ backgroundColor: color }} />
          {title}
        </h3>

        {/* Botones de control rápido y despliegue del Collapse */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Selector rápido tipo pastilla */}
          <div className="bg-[#111827]/80 p-1 rounded-xl border border-slate-700/60 flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setScaleMode('log')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                scaleMode === 'log'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Escala logarítmica (Log-Log: tendencia en línea recta)"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Log-Log</span>
            </button>
            <button
              type="button"
              onClick={() => setScaleMode('linear')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                scaleMode === 'linear'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Escala normal lineal (se observa la curva potencial y = a·x^b)"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Normal</span>
            </button>
          </div>

          {/* Botón Collapse para ver detalles y explicaciones */}
          <button
            type="button"
            onClick={() => setIsCollapseOpen(!isCollapseOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 cursor-pointer transition-all ${
              isCollapseOpen
                ? 'bg-slate-700 text-slate-100 border-slate-500 shadow-sm'
                : 'bg-[#1a2436] hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="Desplegar opciones de escala y fundamentos visuales"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Explicación & Escalas</span>
            <span className="sm:hidden">Escalas</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                isCollapseOpen ? 'rotate-180 text-blue-400' : 'text-slate-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Collapse con los modos de visualización y explicaciones didácticas */}
      <AnimatePresence>
        {isCollapseOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden mb-5"
          >
            <div className="bg-[#141d2e] border border-[#2d3b52] rounded-xl p-4 sm:p-5 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-[#2d3b52] pb-3">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-300 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  Modos de Visualización del Ajuste
                </span>
                <span className="text-[11px] text-slate-400">
                  Selecciona una opción para alternar la visualización
                </span>
              </div>

              {/* Tarjetas interactivas de selección */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Opción 1: Log-Log */}
                <div
                  onClick={() => setScaleMode('log')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all relative ${
                    scaleMode === 'log'
                      ? 'bg-blue-950/50 border-blue-500 shadow-md ring-1 ring-blue-500/40'
                      : 'bg-[#1a2436] border-[#334155] hover:border-slate-500 hover:bg-[#202c42]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${scaleMode === 'log' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-100">Escala Logarítmica (Log-Log)</h4>
                        <span className="text-[11px] text-blue-300 font-mono font-medium">Tendencia: Línea Recta</span>
                      </div>
                    </div>
                    {scaleMode === 'log' && (
                      <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Aplica <InlineMath math="\ln" /> en ambos ejes. La potencia <InlineMath math="y = a \cdot x^b" /> se transforma en la recta <InlineMath math="Y = A + b \cdot X" /> con pendiente <InlineMath math="b" />. Permite ajustar por mínimos cuadrados lineales y visualizar órdenes de magnitud de gramos a toneladas sin amontonamiento.
                  </p>
                </div>

                {/* Opción 2: Normal (Lineal) */}
                <div
                  onClick={() => setScaleMode('linear')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all relative ${
                    scaleMode === 'linear'
                      ? 'bg-emerald-950/50 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                      : 'bg-[#1a2436] border-[#334155] hover:border-slate-500 hover:bg-[#202c42]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${scaleMode === 'linear' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-100">Escala Normal (Lineal)</h4>
                        <span className="text-[11px] text-emerald-300 font-mono font-medium">Tendencia: Curva Potencial Cóncava</span>
                      </div>
                    </div>
                    {scaleMode === 'linear' && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Grafica masa y metabolismo en valores físicos naturales (kg y Watts). Aquí se aprecia la <strong>verdadera curvatura alométrica</strong> (<InlineMath math="b < 1" />): el metabolismo basal crece con rendimientos decrecientes frente a la masa corporal.
                  </p>
                </div>
              </div>

              {/* Nota explicativa de por qué una es recta y otra curva */}
              <div className="bg-[#1b273b] p-3 rounded-lg border border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-300">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-amber-300">¿Por qué cambia de recta a curva?</strong> En escala log-log, la relación se "endereza" matemáticamente (<InlineMath math="\ln(y) = \ln(a) + b \cdot \ln(x)" />) y su pendiente representa directamente a <InlineMath math="b" />. En escala normal se restituye la función exponencial/potencial <InlineMath math="y = a \cdot x^b" />, mostrando su típica curvatura cóncava.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barra de estado con la escala activa */}
      <div className="flex items-center justify-between text-xs px-3 py-1.5 mb-2 bg-[#141f30] rounded-lg border border-[#2a374f]">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${scaleMode === 'log' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
          <span className="text-slate-300 font-medium">
            Visualización:{' '}
            <strong className={scaleMode === 'log' ? 'text-blue-300' : 'text-emerald-300'}>
              {scaleMode === 'log' ? 'Escala Log-Log (Recta de Regresión)' : 'Escala Normal (Curva Potencial)'}
            </strong>
          </span>
        </div>
        <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
          {scaleMode === 'log'
            ? `Y = ${A_val != null ? A_val.toFixed(4) : 'A'} ${b != null && b >= 0 ? '+' : '-'} ${b != null ? Math.abs(b).toFixed(4) : 'b'}·X`
            : `y = ${a?.toFixed(4) ?? 'a'} · x^${b?.toFixed(4) ?? 'b'}`}
        </span>
      </div>

      {/* Gráfico Recharts */}
      <div className="h-[340px] sm:h-[400px] w-full bg-[#1a2436] rounded-xl p-1 sm:p-4 border border-[#334155]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            key={`${title}-${scaleMode}`}
            margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="x"
              type="number"
              name="Masa"
              scale={scaleMode === 'log' ? 'log' : 'linear'}
              domain={scaleMode === 'log' ? ['auto', 'auto'] : [0, 'auto']}
              label={{
                value: scaleMode === 'log' ? 'Masa (kg) [Escala Logarítmica]' : 'Masa (kg) [Escala Normal]',
                position: 'insideBottom',
                offset: -15,
                fill: '#cbd5e1',
                fontSize: 12,
                fontWeight: 500
              }}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickFormatter={formatTick}
              stroke="#64748b"
            />
            <YAxis
              dataKey="y"
              type="number"
              name="Metabolismo"
              scale={scaleMode === 'log' ? 'log' : 'linear'}
              domain={scaleMode === 'log' ? ['auto', 'auto'] : [0, 'auto']}
              label={{
                value: scaleMode === 'log' ? 'Tasa Metabólica (W) [Escala Logarítmica]' : 'Tasa Metabólica (W) [Escala Normal]',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
                fill: '#cbd5e1',
                offset: -10,
                fontSize: 12,
                fontWeight: 500
              }}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickFormatter={formatTick}
              stroke="#64748b"
            />
            <Tooltip
              content={<CustomTooltip isLog={scaleMode === 'log'} />}
              cursor={{ strokeDasharray: '3 3', stroke: '#64748b' }}
            />

            {/* Puntos experimentales */}
            <Scatter
              name="Datos Experimentales"
              data={dataPoints}
              fill={color}
              r={scaleMode === 'log' ? 5.5 : 5}
            />

            {/* Curva de ajuste */}
            <Line
              data={activeCurvePoints}
              type="monotone"
              dataKey="y"
              stroke="#f1f5f9"
              strokeWidth={3}
              dot={false}
              activeDot={false}
              name={scaleMode === 'log' ? 'Ajuste Linealizado (Log-Log)' : 'Ajuste Potencial (Curva Real)'}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <ResultCard
          equation={equation}
          r2={effectiveR2}
          a={a}
          b={b}
          scaleMode={scaleMode}
          clusterId={clusterId}
        />
      </div>
    </div>
  );
};
