import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  GitBranch, 
  Sparkles, 
  Activity, 
  ChevronDown, 
  CheckCircle2, 
  Info, 
  Zap, 
  X,
  Eye,
  EyeOff,
  Sliders
} from 'lucide-react';
import { BlockMath } from 'react-katex';

interface MetricCollapseData {
  id: string;
  icon: React.ElementType;
  label: string;
  value: string;
  badge: string;
  accentColor: string;
  accentBorder: string;
  accentGlow: string;
  accentBg: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  description: string;
  points: { 
    title: string; 
    text: string; 
    math?: string;
    isBlockMath?: boolean;
  }[];
  highlightMath?: string;
  footerNote: string;
}

const METRICS_DATA: MetricCollapseData[] = [
  {
    id: 'observaciones',
    icon: Database,
    label: 'Observaciones',
    value: '88 Especies',
    badge: 'Dataset Experimental',
    accentColor: 'text-blue-400',
    accentBorder: 'border-blue-500/40',
    accentGlow: 'hover:shadow-[0_0_15px_rgba(59,130,246,0.25)]',
    accentBg: 'bg-blue-950/40',
    iconBg: 'bg-blue-950/80',
    iconColor: 'text-blue-400',
    title: 'Muestreo Experimental y Cobertura Multiespecie',
    subtitle: '88 especies zoológicas reales distribuidas en 4 grupos filogenéticos',
    description:
      'El conjunto de datos recopilado comprende 88 mediciones experimentales independientes de especies vivientes, balanceado equitativamente con 22 especies por cada grupo animal.',
    points: [
      {
        title: 'Distribución Balanceada por Clúster',
        text: 'Exactamente 22 especies por grupo (Mamíferos, Aves, Reptiles y Peces), evitando sesgos de representación taxonómica y garantizando significancia estadística.'
      },
      {
        title: 'Amplitud de Masa (7 órdenes de magnitud)',
        text: 'Abarca desde organismos minúsculos como el colibrí abeja (0.002 kg) hasta megafauna como el elefante africano (6,000 kg) y la ballena azul (12,000 kg).',
        math: '\\displaystyle x \\in [0.002\\text{ kg}, \\; 12,000\\text{ kg}]'
      },
      {
        title: 'Variables Medidas en Laboratorio',
        text: 'Pares discretos (x, y) donde x es la masa corporal en kilogramos (kg) e y es la tasa metabólica basal o estándar en Watts (W).',
        math: '\\displaystyle (x_i, y_i) \\in \\mathbb{R}^+ \\times \\mathbb{R}^+'
      },
      {
        title: 'Condiciones Basales Estandarizadas',
        text: 'Mediciones tomadas en reposo térmico, estado postabsortivo (sin digestión activa) y normotermia ambiental para asegurar comparabilidad física.'
      }
    ],
    highlightMath: '\\displaystyle N = 88 \\text{ especies} = 22_{\\mathrm{MAM}} + 22_{\\mathrm{AVE}} + 22_{\\mathrm{REP}} + 22_{\\mathrm{PEC}}',
    footerNote: 'La amplitud de 7 órdenes de magnitud hace indispensable el análisis en escala logarítmica para evitar dominancia visual de la megafauna.'
  },
  {
    id: 'clusteres',
    icon: GitBranch,
    label: 'Clústeres',
    value: '4 Grupos',
    badge: 'Segmentación Fisiológica',
    accentColor: 'text-indigo-400',
    accentBorder: 'border-indigo-500/40',
    accentGlow: 'hover:shadow-[0_0_15px_rgba(99,102,241,0.25)]',
    accentBg: 'bg-indigo-950/40',
    iconBg: 'bg-indigo-950/80',
    iconColor: 'text-indigo-400',
    title: 'Clasificación por Termorregulación y Medio Físico',
    subtitle: 'Endotermos vs Ectotermos y adaptaciones biomecánicas acuáticas y terrestres',
    description:
      'La separación en cuatro clústeres biológicos obedece a las diferencias fundamentales en la estrategia energética de los animales, evidenciadas por sus coeficientes de escala a y exponentes b.',
    points: [
      {
        title: 'Endotermos (Mamíferos y Aves)',
        text: 'Mantienen temperatura corporal constante (37°C a 41°C). Presentan coeficientes basales elevados (a ≈ 3.39 a 3.81 W) debido al elevado costo de la termogénesis mitocondrial continua.',
        math: '\\displaystyle a_{\\mathrm{Endotermos}} \\gg a_{\\mathrm{Ectotermos}}'
      },
      {
        title: 'Ectotermos (Reptiles y Peces)',
        text: 'Poiquilotermos dependientes del entorno térmico externo. Coeficientes a drásticamente inferiores (a ≈ 0.23 a 0.28 W), consumiendo aproximadamente 15 veces menos energía en reposo que un endotermo de igual masa.',
        math: '\\displaystyle a_{\\mathrm{REP}} = 0.2796 \\qquad a_{\\mathrm{PEC}} = 0.2281'
      },
      {
        title: 'Efecto del Medio Acuático en Peces',
        text: 'El empuje de flotación hidrostático neutraliza la fuerza gravitatoria, reduciendo el trabajo postural y modificando la pendiente alométrica (b ≈ 0.79).',
        math: '\\displaystyle b_{\\mathrm{PEC}} = 0.7937 > b_{\\mathrm{MAM}} = 0.7412'
      },
      {
        title: 'Vuelo y Respiración en Aves',
        text: 'El sistema respiratorio con sacos aéreos de flujo unidireccional otorga una tasa metabólica basal ligeramente superior a los mamíferos (a = 3.8118 W).'
      }
    ],
    highlightMath: '\\displaystyle \\text{Mamíferos (Endo)} \\;\\gg\\; \\text{Aves (Endo)} \\;\\gg\\; \\text{Reptiles (Ecto)} \\;\\approx\\; \\text{Peces (Ecto)}',
    footerNote: 'La segmentación por clústeres demuestra que una regresión global única enmascara las leyes físicas subyacentes de cada fisiología.'
  },
  {
    id: 'kleiber',
    icon: Sparkles,
    label: 'Ley Biofísica',
    value: 'Kleiber (3/4)',
    badge: 'Teoría Alométrica WBE',
    accentColor: 'text-amber-400',
    accentBorder: 'border-amber-500/40',
    accentGlow: 'hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    accentBg: 'bg-amber-950/40',
    iconBg: 'bg-amber-950/80',
    iconColor: 'text-amber-400',
    title: 'Ley Alométrica de Max Kleiber (Exponente 3/4)',
    subtitle: 'El modelo no lineal de potencia y las redes fractales de transporte biológico',
    description:
      'En 1932, Max Kleiber formuló que la tasa metabólica basal escala con la masa corporal elevada a una potencia de 3/4, desafiando tanto la proporcionalidad lineal como la regla geométrica de superficie.',
    points: [
      {
        title: 'Falla del Modelo Lineal (b = 1)',
        text: 'Si el metabolismo fuera proporcional a la masa, un animal grande como un elefante generaría miles de veces más calor del que su superficie puede disipar, colapsando térmicamente.',
        math: '\\displaystyle b = 1 \\implies \\text{Inviable por Disipación Térmica}'
      },
      {
        title: 'Falla de la Regla de Superficie de Rubner (b = 2/3 ≈ 0.67)',
        text: 'Basada en geometría euclidiana pura (Área ∝ Volumen^(2/3)). Aunque mejor que el modelo lineal, subestima notablemente el metabolismo de especies grandes.',
        math: '\\displaystyle b = \\dfrac{2}{3} = 0.6667 \\; < \\; b_{\\mathrm{real}} \\approx 0.75'
      },
      {
        title: 'Teoría Fractal WBE (West, Brown y Enquist, 1997)',
        text: 'Demostró analíticamente que las redes vasculares y respiratorias ramificadas autosimilares que distribuyen nutrientes con mínima disipación hidrodinámica operan en 4 dimensiones efectivas.',
        math: '\\displaystyle b = \\dfrac{D}{D+1} = \\dfrac{3}{3+1} = \\dfrac{3}{4} = 0.75'
      },
      {
        title: 'Validación Numérica en este Caso',
        text: 'Los 4 grupos analizados arrojan exponentes b empíricos entre 0.7412 y 0.7937, en perfecta concordancia con la teoría de Kleiber-WBE.'
      }
    ],
    highlightMath: '\\displaystyle y = a \\cdot x^{3/4} \\iff \\ln(y) = \\ln(a) + \\dfrac{3}{4} \\cdot \\ln(x)',
    footerNote: 'La alometría de 3/4 es uno de los principios unificadores más trascendentes de la biología cuantitativa moderna.'
  },
  {
    id: 'r2',
    icon: Activity,
    label: 'Ajuste (r²)',
    value: '> 0.9100',
    badge: 'Mínimos Cuadrados',
    accentColor: 'text-emerald-400',
    accentBorder: 'border-emerald-500/40',
    accentGlow: 'hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    accentBg: 'bg-emerald-950/40',
    iconBg: 'bg-emerald-950/80',
    iconColor: 'text-emerald-400',
    title: 'Bondad de Ajuste y Precisión por Mínimos Cuadrados',
    subtitle: 'Linealización logarítmica canónica y análisis de varianza explicada',
    description:
      'El ajuste por mínimos cuadrados sobre las variables transformadas ln(x) y ln(y) garantiza la minimización exacta de la suma de residuos cuadráticos, logrando coeficientes de determinación sobresalientes.',
    points: [
      {
        title: 'Linealización Canónica',
        text: 'Transforma la ecuación potencial no lineal en un sistema algebraico lineal exacto sin necesidad de optimización iterativa inicial.',
        math: '\\displaystyle Y = A + B \\cdot X, \\quad \\text{donde } Y = \\ln(y), \\; X = \\ln(x), \\; A = \\ln(a)'
      },
      {
        title: 'Valores Obtenidos por Grupo',
        text: 'Mamíferos (99.08% de varianza explicada), Aves (98.59%), Peces (96.34%) y Reptiles (91.07%).',
        math: '\\displaystyle {r^2}_{\\mathrm{MAM}} = 0.9908 \\qquad {r^2}_{\\mathrm{AVE}} = 0.9859'
      },
      {
        title: 'Métrica de Coeficiente de Determinación',
        text: 'Cuantifica la fracción de la variabilidad total de la tasa metabólica explicada por el modelo alométrico respecto a la media.',
        math: '\\displaystyle r^2 = 1 - \\dfrac{S_r}{S_t} = 1 - \\dfrac{\\sum_{i=1}^n (y_i - \\hat{y}_i)^2}{\\sum_{i=1}^n (y_i - \\bar{y})^2}'
      },
      {
        title: 'Homocedasticidad y Residuos',
        text: 'La transformación logarítmica estabiliza la varianza residual a lo largo de los 7 órdenes de magnitud, cumpliendo con los supuestos de Gauss-Markov.'
      }
    ],
    highlightMath: '\\displaystyle r^2 \\ge 0.9107 \\quad \\text{en todos los grupos} \\quad \\left(\\bar{r}^2_{\\mathrm{promedio}} = 0.9627\\right)',
    footerNote: 'Un valor r² > 0.91 confirma el ajuste del modelo potencial alométrico frente a alternativas lineales o polinómicas.'
  }
];

export const HeaderMetricCollapses: React.FC = () => {
  const [activeCollapse, setActiveCollapse] = useState<string | null>(null);
  const [expandAll, setExpandAll] = useState<boolean>(false);
  // Formula scaling slider: 1.0 = 100%, 1.25 = 125%, 1.5 = 150%
  const [formulaScale, setFormulaScale] = useState<number>(1.15);

  const toggleCollapse = (id: string) => {
    if (expandAll) {
      setExpandAll(false);
      setActiveCollapse(activeCollapse === id ? null : id);
    } else {
      setActiveCollapse(prev => (prev === id ? null : id));
    }
  };

  const handleToggleAll = () => {
    if (expandAll) {
      setExpandAll(false);
      setActiveCollapse(null);
    } else {
      setExpandAll(true);
      setActiveCollapse(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* 4 Clickable Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full text-left">
        {METRICS_DATA.map((metric) => {
          const Icon = metric.icon;
          const isItemActive = expandAll || activeCollapse === metric.id;

          return (
            <motion.button
              key={metric.id}
              type="button"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleCollapse(metric.id)}
              aria-expanded={isItemActive}
              aria-controls={`collapse-panel-${metric.id}`}
              className={`p-3.5 transition-all rounded-xl border flex flex-col justify-between cursor-pointer outline-none relative overflow-hidden select-none btn-shimmer ${
                isItemActive
                  ? `bg-[#283852] border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-blue-400/50`
                  : `bg-[#243147]/90 hover:bg-[#2a3850] border-[#334155] ${metric.accentBorder} ${metric.accentGlow}`
              }`}
            >
              {/* Top Row: Icon + Indicator Chevron */}
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`p-1.5 rounded-lg border border-slate-700/60 ${metric.iconBg} ${metric.iconColor}`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                    {isItemActive ? 'Ocultar' : 'Ver'}
                  </span>
                  <motion.div
                    animate={{ rotate: isItemActive ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className={`p-1 rounded-md transition-colors ${
                      isItemActive ? 'text-blue-300 bg-blue-950/80' : 'text-slate-400 bg-slate-800/80'
                    }`}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </motion.div>
                </div>
              </div>

              {/* Bottom Row: Metric Text */}
              <div>
                <span className="block text-[11px] text-slate-400 font-medium leading-tight">
                  {metric.label}
                </span>
                <span className={`text-sm sm:text-base font-bold font-mono tracking-tight leading-tight ${metric.accentColor}`}>
                  {metric.value}
                </span>
              </div>

              {/* Active Indicator Light */}
              {isItemActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Toolbar: Info + Slider de Escala de Fórmulas + Toggle All */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between pt-3 px-1 gap-2 text-xs text-slate-400 border-b border-slate-800/60 pb-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
          <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
          <span>Haz clic en cualquier cuadrícula para expandir sus descripciones</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-end">
          {/* Slider de Escala de Fórmulas */}
          <div className="flex items-center gap-2 bg-[#1a2436] px-2.5 py-1 rounded-lg border border-slate-700/60">
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] text-slate-300 font-medium whitespace-nowrap">
              Tamaño de fórmulas:
            </span>
            <input
              type="range"
              min="0.9"
              max="1.5"
              step="0.05"
              value={formulaScale}
              onChange={(e) => setFormulaScale(parseFloat(e.target.value))}
              className="w-20 sm:w-24 accent-blue-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              title="Ajustar tamaño de visualización de las fórmulas"
            />
            <span className="text-[10px] font-mono font-bold text-blue-300 w-9 text-right">
              {Math.round(formulaScale * 100)}%
            </span>
          </div>

          {/* Toggle All Button */}
          <button
            type="button"
            onClick={handleToggleAll}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors py-1 px-2.5 rounded-md hover:bg-slate-800/60 border border-slate-700/40"
          >
            {expandAll ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Colapsar todas</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Ver todas</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Collapses Container */}
      <div className="w-full mt-3 space-y-4">
        {METRICS_DATA.map((metric) => {
          const Icon = metric.icon;
          const isVisible = expandAll || activeCollapse === metric.id;

          return (
            <AnimatePresence key={metric.id} initial={false}>
              {isVisible && (
                <motion.div
                  id={`collapse-panel-${metric.id}`}
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{ duration: 0.26, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className={`p-5 sm:p-7 bg-[#1c2638] rounded-2xl border ${metric.accentBorder} shadow-xl relative backdrop-blur-md`}>
                    
                    {/* Header of the Collapse Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4 mb-5">
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 sm:p-3 rounded-xl border border-slate-700/70 ${metric.iconBg} ${metric.iconColor} shadow-sm`}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base sm:text-xl font-bold text-slate-100">
                              {metric.title}
                            </span>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${metric.accentBg} ${metric.accentColor} ${metric.accentBorder}`}>
                              {metric.badge}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                            {metric.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Close this single collapse button */}
                      <button
                        type="button"
                        onClick={() => toggleCollapse(metric.id)}
                        className="self-end sm:self-center p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
                        title="Cerrar esta descripción"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* General Summary */}
                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-5">
                      {metric.description}
                    </p>

                    {/* Highlight Math Formula Banner (Generous Padding & Dynamic Scale) */}
                    {metric.highlightMath && (
                      <div className="my-5 p-5 sm:p-7 bg-[#121926] rounded-2xl border border-blue-900/50 text-center overflow-x-auto shadow-lg relative">
                        <span className="text-[11px] text-slate-400 uppercase tracking-widest font-mono block mb-2 font-medium">
                          Expresión Biofísica & Matemática Canónica
                        </span>
                        <div 
                          className="text-blue-300 font-bold py-3 flex justify-center items-center overflow-x-auto transition-transform duration-200 origin-center"
                          style={{ fontSize: `${formulaScale}em` }}
                        >
                          <BlockMath math={metric.highlightMath} />
                        </div>
                      </div>
                    )}

                    {/* Detailed Points Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                      {metric.points.map((pt, idx) => (
                        <div
                          key={idx}
                          className="p-4 sm:p-5 bg-[#233044]/95 rounded-xl border border-slate-700/60 hover:border-slate-600 transition-colors space-y-3 flex flex-col justify-between shadow-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${metric.accentColor}`} />
                              <h4 className="text-sm sm:text-base font-semibold text-slate-100">
                                {pt.title}
                              </h4>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                              {pt.text}
                            </p>
                          </div>
                          {pt.math && (
                            <div className="pl-6 pt-2">
                              <div 
                                className="p-2.5 sm:p-3 rounded-xl bg-slate-900/95 border border-slate-700/70 inline-flex items-center text-blue-300 font-mono shadow-inner overflow-x-auto max-w-full"
                                style={{ fontSize: `${formulaScale * 0.95}em` }}
                              >
                                <BlockMath math={pt.math} />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Footer Note */}
                    <div className="mt-5 pt-4 border-t border-slate-700/40 flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
                      <Zap className={`w-4 h-4 flex-shrink-0 ${metric.accentColor}`} />
                      <span>{metric.footerNote}</span>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>
    </div>
  );
};
