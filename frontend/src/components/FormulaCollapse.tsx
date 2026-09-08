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
    <div className="glass-panel rounded-2xl overflow-hidden my-4 transition-all duration-300 hover:border-purple-500/40">
      <motion.button
        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
        whileTap={{ scale: 0.995 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 md:p-5 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer outline-none"
        type="button"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-300 border border-purple-500/30 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-base md:text-lg">{title}</span>
              {badge && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs md:text-sm text-slate-400 mt-0.5 font-light">{subtitle}</p>}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="text-slate-400 p-1.5 rounded-lg bg-white/5 border border-white/10"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-6 border-t border-white/5 bg-black/40 text-slate-200">
              <div className="overflow-x-auto slider-touch py-3 px-2 flex flex-col gap-4 items-center font-katex text-base md:text-lg leading-relaxed w-full">
                <div className="inline-flex flex-col gap-4 min-w-full items-center justify-center text-center">
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
