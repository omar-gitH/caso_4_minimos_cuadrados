import React, { useState } from 'react';
import { ChevronDown, FunctionSquare } from 'lucide-react';
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
  badge = "Fórmula KaTeX",
  defaultOpen = false,
  children
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-2xl border transition-all duration-300 shadow-md overflow-hidden my-4 w-full max-w-full min-w-0 ${isOpen ? 'border-blue-500/40 shadow-[0_4px_25px_rgba(59,130,246,0.12)] bg-[#1e293b]' : 'border-[#334155] bg-[#1e293b] hover:border-slate-400'}`}>
      <motion.button
        whileHover={{ backgroundColor: "rgba(36, 49, 71, 0.85)" }}
        whileTap={{ scale: 0.995 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3.5 sm:p-4 md:p-5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer outline-none select-none btn-shimmer"
        type="button"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="p-2 sm:p-2.5 bg-blue-950/70 rounded-xl text-blue-300 border border-blue-800/50 shadow-xs flex-shrink-0 transition-transform group-hover:scale-105">
            <FunctionSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-100 text-sm sm:text-base md:text-lg break-words leading-tight">
                {title}
              </span>
              {badge && (
                <span className={`text-[10px] sm:text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-md border flex-shrink-0 transition-colors ${isOpen ? 'bg-blue-950/80 text-blue-300 border-blue-700/60' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-normal leading-snug break-words">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
          className={`p-2 rounded-xl border flex-shrink-0 transition-all ${isOpen ? 'text-blue-300 bg-blue-950/70 border-blue-700/50 shadow-[0_0_12px_rgba(59,130,246,0.3)]' : 'text-slate-400 bg-slate-800 border-slate-700 hover:text-white'}`}
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
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden w-full max-w-full border-t border-[#334155]"
          >
            <div className="p-4 sm:p-6 md:p-8 bg-[#162032] text-slate-100 w-full max-w-full overflow-hidden">
              {/* Contenedor adaptativo con espaciado amplio y scroll suave */}
              <div className="overflow-x-auto table-scroll-2d py-3 px-1 sm:px-3 flex flex-col items-center w-full max-w-full">
                <div className="w-max min-w-full mx-auto flex flex-col gap-6 sm:gap-8 items-center justify-center text-center">
                  {children}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-center mt-3 font-mono sm:hidden">
                ↔ Desliza horizontalmente la fórmula si excede tu pantalla
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
