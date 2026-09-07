import React from 'react';
import { BlockMath } from 'react-katex';

interface ResultCardProps {
  equation: string;
  r2: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ equation, r2 }) => {
  const quality = r2 >= 0.9 ? 'Excelente' : r2 >= 0.7 ? 'Bueno' : 'Regular';
  const color = r2 >= 0.9 ? 'text-emerald-600' : r2 >= 0.7 ? 'text-blue-600' : 'text-amber-600';

  return (
    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 flex flex-col justify-center items-center">
        <p className="text-emerald-800 text-sm font-semibold mb-2 self-start">Ecuación Calculada</p>
        <div className="text-emerald-900 text-lg sm:text-xl w-full flex justify-center overflow-x-auto py-2">
          <BlockMath math={equation} />
        </div>
      </div>
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col justify-center">
        <p className="text-slate-600 text-sm font-semibold mb-1">
          Bondad del Ajuste (r²)
        </p>
        <div className="flex items-baseline gap-2">
          <p className={`font-mono font-bold text-xl ${color}`}>
            {r2.toFixed(4)}
          </p>
          <span className="text-xs font-bold px-2 py-1 bg-white rounded shadow-sm text-slate-600 uppercase tracking-wider">
            {quality}
          </span>
        </div>
      </div>
    </div>
  );
};
