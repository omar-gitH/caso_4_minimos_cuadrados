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
  color?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.especie) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
          <p className="font-bold text-slate-800">{data.especie}</p>
          <p className="text-slate-600 text-sm">Masa: {data.x} kg</p>
          <p className="text-slate-600 text-sm">Metabolismo: {data.y} W</p>
        </div>
      );
    }
    return (
      <div className="bg-white p-2 border border-slate-200 shadow rounded">
        <p className="text-slate-600 text-sm font-semibold mb-1">Ajuste Teórico</p>
        <p className="text-slate-500 text-xs">Masa: {data.x.toFixed(3)} kg</p>
        <p className="text-slate-500 text-xs">Tasa Estimada: {data.y.toFixed(3)} W</p>
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
  color = '#059669'
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-slate-800 mb-6">{title}</h3>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="x" 
              type="number" 
              name="Masa" 
              scale="log"
              domain={['auto', 'auto']}
              label={{ value: 'Masa (kg)', position: 'insideBottom', offset: -15, fill: '#64748b' }}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
            />
            <YAxis 
              dataKey="y" 
              type="number" 
              name="Metabolismo" 
              scale="log"
              domain={['auto', 'auto']}
              label={{ value: 'Tasa Metabólica (W)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, fill: '#64748b', offset: -10 }}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            
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
              stroke="#0f172a" 
              strokeWidth={3}
              dot={false}
              activeDot={false}
              name="Ajuste Potencial"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-auto pt-6">
        <ResultCard equation={equation} r2={r2} />
      </div>
    </div>
  );
};
