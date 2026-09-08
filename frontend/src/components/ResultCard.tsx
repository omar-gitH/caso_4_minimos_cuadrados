import React, { useRef } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResultCardProps {
  equation: string;
  r2: number;
  a?: number;
  b?: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ equation, r2, a, b }) => {
  const quality = r2 >= 0.9 ? 'Excelente' : r2 >= 0.7 ? 'Bueno' : 'Regular';
  const colorClass = r2 >= 0.9 ? 'text-emerald-400' : r2 >= 0.7 ? 'text-cyan-400' : 'text-amber-400';
  const borderClass = r2 >= 0.9 ? 'border-emerald-500/30' : r2 >= 0.7 ? 'border-cyan-500/30' : 'border-amber-500/30';
  const bgClass = r2 >= 0.9 ? 'bg-emerald-500/10' : r2 >= 0.7 ? 'bg-cyan-500/10' : 'bg-amber-500/10';

  const eqScrollRef = useRef<HTMLDivElement>(null);

  const slideEquation = (dir: 'left' | 'right') => {
    if (eqScrollRef.current) {
      const offset = dir === 'left' ? -120 : 120;
      eqScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Ensure equation starts with y =
  const cleanEquation = equation.trim().startsWith('y =') ? equation : `y = ${equation}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      {/* Ecuación Calculada */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between shadow-inner relative overflow-hidden group hover:border-emerald-500/40 transition-all">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-60 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="flex items-center justify-between mb-2">
          <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">
            Ecuación de Ajuste
          </p>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
            Modelo: <InlineMath math="y = a \cdot x^b" />
          </span>
        </div>

        {/* Horizontal Slider with Touch & Navigation Controls for Smaller Screens */}
        <div className="relative w-full my-1">
          <div 
            ref={eqScrollRef}
            className="w-full overflow-x-auto slider-touch no-scrollbar sm:custom-scrollbar py-2"
          >
            <div className="inline-flex items-center justify-center min-w-full px-4 text-emerald-400 text-base sm:text-lg md:text-xl xl:text-2xl font-medium whitespace-nowrap">
              <BlockMath math={cleanEquation} />
            </div>
          </div>

          {/* Slider Left / Right Buttons for Mobile & Tablets */}
          <div className="flex justify-between items-center px-1 pt-1 sm:hidden">
            <button
              onClick={() => slideEquation('left')}
              className="p-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] flex items-center gap-1 border border-white/5 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>Deslizar</span>
            </button>
            <span className="text-[10px] text-slate-500 font-mono">↔ Mover</span>
            <button
              onClick={() => slideEquation('right')}
              className="p-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] flex items-center gap-1 border border-white/5 cursor-pointer"
            >
              <span>Deslizar</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Parámetros explícitos si están disponibles */}
        {(a !== undefined && b !== undefined) && (
          <div className="flex items-center justify-around pt-2 border-t border-white/5 text-xs text-slate-400 font-mono">
            <span><strong className="text-slate-300">a:</strong> {a.toFixed(4)}</span>
            <span><strong className="text-slate-300">b:</strong> {b.toFixed(4)}</span>
          </div>
        )}
      </div>
      
      {/* Bondad del Ajuste */}
      <div className={`backdrop-blur-md rounded-2xl p-5 border ${borderClass} ${bgClass} flex flex-col justify-between shadow-lg relative`}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-slate-300 text-xs font-semibold tracking-wider uppercase">
            Bondad del Ajuste (r²)
          </p>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${borderClass} bg-black/40 ${colorClass}`}>
            {quality}
          </span>
        </div>

        <div className="flex items-baseline justify-start gap-3 my-auto py-2">
          <p className={`font-mono font-extrabold text-3xl sm:text-4xl lg:text-5xl ${colorClass} drop-shadow-md`}>
            {r2.toFixed(4)}
          </p>
          <span className="text-xs text-slate-400 font-light">
            ({(r2 * 100).toFixed(2)}% varianza explicada)
          </span>
        </div>

        <div className="text-[11px] text-slate-400 font-light pt-2 border-t border-white/5 flex justify-between items-center">
          <span>Criterio: <strong className="text-slate-300">r² &gt; 0.85</strong> óptimo</span>
          <span className="text-slate-500">UTN FRP</span>
        </div>
      </div>
    </div>
  );
};
