import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormulaCollapseProps {
  title: string;
  subtitle?: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const FormulaCollapse: React.FC<FormulaCollapseProps> = ({
  title,
  subtitle,
  badge = "Fórmula LaTeX",
  defaultOpen = false,
  children
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden my-3 sm:my-4 transition-all duration-300 hover:border-purple-500/40 w-full max-w-full min-w-0">
      <motion.button
        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
        whileTap={{ scale: 0.995 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 sm:p-4 md:p-5 flex items-center justify-between gap-2.5 sm:gap-4 text-left transition-colors cursor-pointer outline-none select-none"
        type="button"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="p-2 sm:p-2.5 bg-purple-500/20 rounded-xl text-purple-300 border border-purple-500/30 shadow-sm flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="font-bold text-white text-xs sm:text-base md:text-lg break-words leading-tight">
                {title}
              </span>
              {badge && (
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex-shrink-0">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 mt-0.5 font-light leading-snug break-words">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="text-slate-400 p-1 sm:p-1.5 rounded-lg bg-white/5 border border-white/10 flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden w-full max-w-full"
          >
            <div className="p-2.5 sm:p-4 md:p-6 border-t border-white/5 bg-black/40 text-slate-200 w-full max-w-full overflow-hidden">
              {/* Contenedor adaptativo para fórmulas matemáticas con scroll horizontal suave sin romper bordes */}
              <div className="overflow-x-auto table-scroll-2d py-2 px-1 sm:px-2 flex flex-col items-center w-full max-w-full">
                <div className="w-max min-w-full mx-auto flex flex-col gap-3 sm:gap-4 items-center justify-center text-center">
                  {children}
                </div>
              </div>
              <p className="text-[10px] text-slate-500 text-center mt-1 sm:hidden">
                ↔ Desliza la fórmula si excede el ancho de tu pantalla
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
