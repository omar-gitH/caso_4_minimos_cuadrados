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
        <div className="bg-slate-900/90 backdrop-blur-md p-4 border border-white/20 shadow-2xl rounded-xl">
          <p className="font-bold text-white mb-2">{data.especie}</p>
          <p className="text-slate-300 text-sm">Masa: <span className="text-emerald-400 font-mono">{data.x} kg</span></p>
          <p className="text-slate-300 text-sm">Metabolismo: <span className="text-cyan-400 font-mono">{data.y} W</span></p>
        </div>
      );
    }
    return (
      <div className="bg-slate-900/90 backdrop-blur-md p-3 border border-emerald-500/50 shadow-2xl rounded-xl">
        <p className="text-emerald-400 text-sm font-semibold mb-2">Ajuste Teórico</p>
        <p className="text-slate-400 text-xs">Masa: <span className="text-white font-mono">{data.x.toFixed(3)} kg</span></p>
        <p className="text-slate-400 text-xs">Tasa Estimada: <span className="text-white font-mono">{data.y.toFixed(3)} W</span></p>
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
  color = '#34d399' // emerald-400 default
}) => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 flex flex-col h-full hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <div className="w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: color, color: color }}></div>
        {title}
      </h3>
      
      <div className="h-[400px] w-full bg-black/20 rounded-2xl p-4 border border-white/5">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
            <XAxis 
              dataKey="x" 
              type="number" 
              name="Masa" 
              scale="log"
              domain={['auto', 'auto']}
              label={{ value: 'Masa (kg)', position: 'insideBottom', offset: -15, fill: '#94a3b8' }}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
              stroke="#475569"
            />
            <YAxis 
              dataKey="y" 
              type="number" 
              name="Metabolismo" 
              scale="log"
              domain={['auto', 'auto']}
              label={{ value: 'Tasa Metabólica (W)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, fill: '#94a3b8', offset: -10 }}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              stroke="#475569"
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
              stroke="#f8fafc" 
              strokeWidth={4}
              dot={false}
              activeDot={false}
              name="Ajuste Potencial"
              style={{ filter: 'drop-shadow(0px 0px 5px rgba(255,255,255,0.5))' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8">
        <ResultCard equation={equation} r2={r2} a={a} b={b} />
      </div>
    </div>
  );
};
