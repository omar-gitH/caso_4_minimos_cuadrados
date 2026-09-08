import React from 'react';
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
import { ResultCard } from './ResultCard';

interface DataPoint {
  x: number;
  y: number;
  especie?: string;
}

interface ClusterChartProps {
  title: string;
  dataPoints: DataPoint[];
  curvePoints: DataPoint[];
  equation: string;
  r2: number;
  a?: number;
  b?: number;
  color?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.especie) {
      return (
        <div className="bg-[#243147] p-3.5 border border-[#334155] shadow-xl rounded-xl text-slate-200">
          <p className="font-bold text-slate-100 mb-1.5">{data.especie}</p>
          <p className="text-slate-300 text-xs sm:text-sm">Masa: <span className="text-slate-100 font-mono font-semibold">{data.x} kg</span></p>
          <p className="text-slate-300 text-xs sm:text-sm">Metabolismo: <span className="text-blue-300 font-mono font-semibold">{data.y} W</span></p>
        </div>
      );
    }
    return (
      <div className="bg-[#243147] p-3 border border-[#334155] shadow-xl rounded-xl text-slate-200">
        <p className="text-slate-100 text-xs font-bold mb-1.5">Ajuste Teórico</p>
        <p className="text-slate-400 text-xs">Masa: <span className="text-slate-200 font-mono font-semibold">{data.x.toFixed(3)} kg</span></p>
        <p className="text-slate-400 text-xs">Tasa Estimada: <span className="text-blue-300 font-mono font-semibold">{data.y.toFixed(3)} W</span></p>
      </div>
    );
  }
  return null;
};

export const ClusterChart: React.FC<ClusterChartProps> = ({
  title,
  dataPoints,
  curvePoints,
  equation,
  r2,
  a,
  b,
  color = '#34d399' // soft emerald default
}) => {
  return (
    <div className="bg-[#1e293b] p-5 sm:p-7 rounded-2xl shadow-lg border border-[#334155] flex flex-col h-full transition-all">
      <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full shadow-xs" style={{ backgroundColor: color }}></div>
        {title}
      </h3>

      <div className="h-[340px] sm:h-[400px] w-full bg-[#1a2436] rounded-xl p-1 sm:p-4 border border-[#334155]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="x"
              type="number"
              name="Masa"
              scale="log"
              domain={['auto', 'auto']}
              label={{ value: 'Masa (kg)', position: 'insideBottom', offset: -15, fill: '#cbd5e1', fontSize: 12, fontWeight: 500 }}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val}
              stroke="#64748b"
            />
            <YAxis
              dataKey="y"
              type="number"
              name="Metabolismo"
              scale="log"
              domain={['auto', 'auto']}
              label={{ value: 'Tasa Metabólica (W)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, fill: '#cbd5e1', offset: -10, fontSize: 12, fontWeight: 500 }}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              stroke="#64748b"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#64748b' }} />

            {/* Puntos experimentales */}
            <Scatter
              name="Datos Experimentales"
              data={dataPoints}
              fill={color}
              r={6}
            />

            {/* Curva de ajuste */}
            <Line
              data={curvePoints}
              type="monotone"
              dataKey="y"
              stroke="#f1f5f9"
              strokeWidth={3}
              dot={false}
              activeDot={false}
              name="Ajuste Potencial"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <ResultCard equation={equation} r2={r2} a={a} b={b} />
      </div>
    </div>
  );
};
