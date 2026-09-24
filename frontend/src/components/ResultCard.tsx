import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { BlockMath, InlineMath } from 'react-katex';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResultCardProps {
  equation: string;
  r2: number;
  a?: number;
  b?: number;
  scaleMode?: 'log' | 'linear';
  clusterId?: string;
}

const CLUSTER_A_VALUES: Record<string, number> = {
  MAM: 1.2439,
  AVE: 1.5732,
  REP: -0.3926,
  PEC: -0.7089,
};

export const ResultCard: React.FC<ResultCardProps> = ({
  equation,
  r2,
  a,
  b,
  scaleMode = 'linear',
  clusterId,
}) => {
  const isLog = scaleMode === 'log';

  // Obtener A = ln(a) exacto según los valores de la cátedra solicitados
  const A = clusterId && CLUSTER_A_VALUES[clusterId] !== undefined
    ? CLUSTER_A_VALUES[clusterId]
    : (a !== undefined ? Number(Math.log(a).toFixed(4)) : 0);

  // Ecuación normal y = a * x^b
  const cleanEquation = equation.trim().startsWith('y =') ? equation : `y = ${equation}`;

  // Ecuación linealizada Log-Log: Y = A + b · X
  const bVal = b !== undefined ? b : 0;
  const signB = bVal >= 0 ? '+' : '-';
  const absB = Math.abs(bVal).toFixed(4);
  const signA = A < 0 ? '-' : '';
  const absA = Math.abs(A).toFixed(4);
  const formattedA = `${signA}${absA}`;
  const logEquation = `Y = ${formattedA} ${signB} ${absB} \\cdot X`;

  // Ecuación activa según el modo seleccionado
  const displayEquation = isLog ? logEquation : cleanEquation;

  const quality = r2 >= 0.9 ? 'Excelente' : r2 >= 0.7 ? 'Bueno' : 'Regular';
  const colorClass = r2 >= 0.9 ? 'text-emerald-400' : r2 >= 0.7 ? 'text-blue-400' : 'text-amber-400';
  const borderClass = r2 >= 0.9 ? 'border-emerald-800/40' : r2 >= 0.7 ? 'border-blue-800/40' : 'border-amber-800/40';
  const bgClass = r2 >= 0.9 ? 'bg-emerald-950/30' : r2 >= 0.7 ? 'bg-blue-950/30' : 'bg-amber-950/30';
  const badgeClass = r2 >= 0.9 ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50' : r2 >= 0.7 ? 'bg-blue-900/60 text-blue-300 border-blue-700/50' : 'bg-amber-900/60 text-amber-300 border-amber-700/50';

  const eqScrollRef = useRef<HTMLDivElement>(null);

  const slideEquation = (dir: 'left' | 'right') => {
    if (eqScrollRef.current) {
      const offset = dir === 'left' ? -120 : 120;
      eqScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      {/* Ecuación Calculada */}
      <div className="bg-[#243147] rounded-2xl p-5 border border-[#334155] flex flex-col justify-between shadow-xs relative overflow-hidden transition-all hover:border-slate-500">
        <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <p className="text-slate-400 text-xs font-bold tracking-wider uppercase">
              Ecuación de Ajuste
            </p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
              isLog
                ? 'bg-blue-950/70 text-blue-300 border-blue-800/60'
                : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
            }`}>
              {isLog ? 'Linealizada (Log-Log)' : 'Potencial (Normal)'}
            </span>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#1a2436] border border-[#334155] text-slate-300">
            {isLog ? (
              <span>Modelo: <InlineMath math="Y = A + b \cdot X" /></span>
            ) : (
              <span>Modelo: <InlineMath math="y = a \cdot x^b" /></span>
            )}
          </span>
        </div>

        {/* Horizontal Slider with Touch & Navigation Controls for Smaller Screens */}
        <div className="relative w-full my-1">
          <div
            ref={eqScrollRef}
            className="w-full overflow-x-auto slider-touch no-scrollbar sm:custom-scrollbar py-2"
          >
            <div className="inline-flex items-center justify-center min-w-full px-4 text-slate-100 text-base sm:text-lg md:text-xl xl:text-2xl font-semibold whitespace-nowrap">
              <BlockMath math={displayEquation} />
            </div>
          </div>

          {/* Slider Left / Right Buttons for Mobile & Tablets with Micro-Animations */}
          <div className="flex justify-between items-center px-1 pt-1.5 sm:hidden">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => slideEquation('left')}
              className="p-1 px-2.5 rounded-lg bg-[#1a2436] hover:bg-[#1e293b] text-slate-300 text-[11px] flex items-center gap-1 border border-[#334155] cursor-pointer shadow-xs btn-shimmer"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Deslizar</span>
            </motion.button>
            <span className="text-[10px] text-slate-400 font-mono">↔ Mover</span>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => slideEquation('right')}
              className="p-1 px-2.5 rounded-lg bg-[#1a2436] hover:bg-[#1e293b] text-slate-300 text-[11px] flex items-center gap-1 border border-[#334155] cursor-pointer shadow-xs btn-shimmer"
            >
              <span>Deslizar</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </motion.button>
          </div>
        </div>

        {/* Parámetros explícitos según el modo activo */}
        {isLog ? (
          <div className="flex items-center justify-around pt-3 border-t border-[#334155] text-xs font-mono">
            <span><strong className="text-blue-300 font-bold">A = ln(a):</strong> <span className="text-slate-200">{A.toFixed(4)}</span></span>
            <span><strong className="text-emerald-300 font-bold">b (pendiente):</strong> <span className="text-slate-200">{b !== undefined ? b.toFixed(4) : '-'}</span></span>
            <span><strong className="text-slate-400">a original:</strong> <span className="text-slate-400">{a !== undefined ? a.toFixed(4) : '-'}</span></span>
          </div>
        ) : (
          (a !== undefined && b !== undefined) && (
            <div className="flex items-center justify-around pt-3 border-t border-[#334155] text-xs font-mono">
              <span><strong className="text-slate-200">a:</strong> <span className="text-slate-300">{a.toFixed(4)}</span></span>
              <span><strong className="text-emerald-300">b:</strong> <span className="text-slate-200 font-bold">{b.toFixed(4)}</span></span>
            </div>
          )
        )}
      </div>

      {/* Bondad del Ajuste */}
      <div className={`rounded-2xl p-5 border ${borderClass} ${bgClass} flex flex-col justify-between shadow-xs relative`}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-slate-300 text-xs font-bold tracking-wider uppercase">
            Bondad del Ajuste (r²)
          </p>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${badgeClass}`}>
            {quality}
          </span>
        </div>

        <div className="flex items-baseline justify-start gap-3 my-auto py-2">
          <p className={`font-mono font-extrabold text-3xl sm:text-4xl lg:text-5xl ${colorClass}`}>
            {r2.toFixed(4)}
          </p>
          <span className="text-xs text-slate-400 font-medium">
            ({(r2 * 100).toFixed(2)}% varianza explicada)
          </span>
        </div>

        <div className="text-[11px] text-slate-400 font-normal pt-2 border-t border-[#334155]/60 flex justify-between items-center">
          <span>En variable linealizada <strong className="text-slate-300">Ln(y)</strong> (Pág. 8 Apunte)</span>
          <span className="text-slate-500 font-mono">UTN FRP</span>
        </div>
      </div>
    </div>
  );
};

