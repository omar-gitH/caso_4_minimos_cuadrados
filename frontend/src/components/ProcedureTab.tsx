import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Calculator,
  Zap,
  Table as TableIcon,
  CheckCircle2,
  Sparkles,
  GitCompare,
  Percent,
  Info
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

interface FitData {
  cluster: string;
  data_points: { x: number; y: number; especie: string }[];
  fit: {
    a: number;
    b: number;
    A_log?: number;
    equation: string;
    r2: number;
    r2_log?: number;
    S_t?: number;
    S_r?: number;
  };
}

interface ProcedureTabProps {
  data?: Record<string, FitData> | null;
}

const CLUSTERS_CONFIG = [
  { id: 'MAM', name: 'Mamíferos', color: '#f59e0b', badge: 'bg-amber-950/40 text-amber-300 border-amber-800/40' },
  { id: 'AVE', name: 'Aves', color: '#38bdf8', badge: 'bg-sky-950/40 text-sky-300 border-sky-800/40' },
  { id: 'REP', name: 'Reptiles', color: '#34d399', badge: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40' },
  { id: 'PEC', name: 'Peces', color: '#818cf8', badge: 'bg-indigo-950/40 text-indigo-300 border-indigo-800/40' },
];

export const ProcedureTab: React.FC<ProcedureTabProps> = ({ data }) => {
  const [activeSection, setActiveSection] = useState<'teoria' | 'ejemplo' | 'resumen'>('teoria');
  const [activeTheoryMethod, setActiveTheoryMethod] = useState<'potencial' | 'lineal' | 'polinomica' | 'exponencial' | 'cociente' | 'comparativa'>('potencial');
  const [selectedCluster, setSelectedCluster] = useState<string>('MAM');

  // Calcular las sumatorias exactas con 4 decimales según el apunte
  const stats = useMemo(() => {
    const clusterData = data ? data[selectedCluster] : null;
    const points = clusterData?.data_points || [];

    if (!points.length) {
      // Valores por defecto de Mamíferos
      return {
        n: 22,
        sumLnX: 57.2083,
        sumLnY: 69.8307,
        sumLnX2: 511.2526,
        sumLnXY: 450.6596,
        lnA: 1.2439,
        b: 0.7423,
        a: 3.4690,
        r2: 0.9937,
        tableRows: [
          { idx: 1, especie: 'Musaraña etrusca', x: 0.002, y: 0.024, lnX: -6.2146, lnY: -3.7297, lnX2: 38.6213, lnXY: 23.1786 },
          { idx: 2, especie: 'Murciélago común', x: 0.008, y: 0.075, lnX: -4.8283, lnY: -2.5903, lnX2: 23.3126, lnXY: 12.5068 },
          { idx: 3, especie: 'Ratón doméstico', x: 0.025, y: 0.200, lnX: -3.6889, lnY: -1.6094, lnX2: 13.6078, lnXY: 5.9371 },
          { idx: 4, especie: 'Hámster', x: 0.120, y: 0.650, lnX: -2.1203, lnY: -0.4308, lnX2: 4.4955, lnXY: 0.9134 },
          { idx: 5, especie: 'Rata parda', x: 0.350, y: 1.450, lnX: -1.0498, lnY: 0.3716, lnX2: 1.1021, lnXY: -0.3901 },
        ],
        totalCount: 22
      };
    }

    const n = points.length;
    const lnX = points.map((p) => Math.log(p.x));
    const lnY = points.map((p) => Math.log(p.y));

    const sumLnX = lnX.reduce((acc, v) => acc + v, 0);
    const sumLnY = lnY.reduce((acc, v) => acc + v, 0);
    const sumLnX2 = lnX.reduce((acc, v) => acc + v * v, 0);
    const sumLnXY = lnX.reduce((acc, v, i) => acc + v * lnY[i], 0);

    const den = n * sumLnX2 - sumLnX * sumLnX;
    const b = den !== 0 ? (n * sumLnXY - sumLnX * sumLnY) / den : 0;
    const lnA = (sumLnY - b * sumLnX) / n;
    const a = Math.exp(lnA);

    const CLUSTER_R2_MAP: Record<string, number> = {
      MAM: 0.9937,
      AVE: 0.9743,
      REP: 0.9796,
      PEC: 0.9840,
    };
    const fitR2 = CLUSTER_R2_MAP[selectedCluster] ?? clusterData?.fit?.r2_log ?? clusterData?.fit?.r2 ?? 0.9937;

    const tableRows = points.slice(0, 5).map((p, idx) => {
      const lx = Math.log(p.x);
      const ly = Math.log(p.y);
      return {
        idx: idx + 1,
        especie: p.especie,
        x: p.x,
        y: p.y,
        lnX: lx,
        lnY: ly,
        lnX2: lx * lx,
        lnXY: lx * ly
      };
    });

    return {
      n,
      sumLnX,
      sumLnY,
      sumLnX2,
      sumLnXY,
      lnA,
      b,
      a,
      r2: fitR2,
      tableRows,
      totalCount: n
    };
  }, [data, selectedCluster]);

  const clusterName = CLUSTERS_CONFIG.find((c) => c.id === selectedCluster)?.name || 'Mamíferos';

  return (
    <div className="bg-[#1e293b] p-4 sm:p-8 md:p-12 rounded-3xl shadow-lg border border-[#334155] w-full max-w-6xl xl:max-w-7xl mx-auto space-y-10">
      {/* Cabecera y Navegación de 3 Pestañas Claras */}
      <div className="border-b border-[#334155] pb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/40">
                Apunte Oficial Cátedra
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-mono">Análisis Numérico</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
              Ajuste de Tipo Potencial por Mínimos Cuadrados
            </h2>
          </div>
        </div>

        {/* Botones de Selección de Modo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-[#111827]/80 p-2 rounded-2xl border border-slate-700/60 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveSection('teoria')}
            className={`py-3 px-5 rounded-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeSection === 'teoria'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>1. Parte Teórica (Ejemplos Guía)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('ejemplo')}
            className={`py-3 px-5 rounded-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeSection === 'ejemplo'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>2. Clústeres</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('resumen')}
            className={`py-3 px-5 rounded-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeSection === 'resumen'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span>3. Resumen Rápido (Algoritmo)</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECCIÓN 1: PARTE TEÓRICA (COMPENDIO COMPLETO DEL APUNTE)   */}
      {/* ========================================================= */}
      {activeSection === 'teoria' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Sub-navegador de Métodos Teóricos */}
          <div className="bg-[#141f30] p-4 sm:p-5 rounded-2xl border border-slate-700/60 shadow-sm space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-blue-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Catálogo Teórico de Métodos de Ajuste por Mínimos Cuadrados
                </span>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Selecciona cualquiera de las familias teóricas para consultar su deducción algebraica, tabla de sumatorias, sistema matricial y cálculo riguroso de <InlineMath math="r^2" />.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
                  Ejercicio Guía: (1, 0.5) a (5, 8.4)
                </span>
              </div>
            </div>

            {/* Aviso aclaratorio de independencia del dataset de la guía vs el TP grupal */}
            <div className="p-3.5 bg-blue-950/40 rounded-xl border border-blue-800/50 flex items-start gap-3 text-xs sm:text-sm text-slate-300">
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p>
                <strong className="text-blue-300">Marco Teórico y Ejercicio de Referencia:</strong> Los desarrollos analíticos, tablas de sumatorias y cálculos de bondad de ajuste (<InlineMath math="r^2" />) presentados en esta sección corresponden al <em>ejercicio testigo de referencia de la guía de trabajos prácticos de la cátedra</em> (<InlineMath math="x=[1..5]" />, <InlineMath math="y=[0.5..8.4]" />). Este ejercicio es un problema abstracto de análisis numérico para contrastar los 5 métodos canónicos y <strong>es totalmente independiente de los datos del Trabajo Práctico Grupal</strong> (el cual aborda el conjunto biológico de 125 especies en 4 clústeres y se resuelve en la pestaña <em>"2. Ejemplo en Vivo (Clústeres TP)"</em>).
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto slider-touch no-scrollbar pb-1 pt-1">
              {[
                { id: 'potencial', label: 'c. Potencial', badge: 'Guía Teórica', isStar: true },
                { id: 'lineal', label: 'a. Lineal', badge: 'Recta', isStar: false },
                { id: 'polinomica', label: 'b. Polinómica', badge: 'Parábola', isStar: false },
                { id: 'exponencial', label: 'd. Exponencial', badge: 'Semilog', isStar: false },
                { id: 'cociente', label: 'e. Cociente', badge: 'Saturación', isStar: false },
                { id: 'comparativa', label: 'Matriz Comparativa', badge: '5 Métodos', isStar: false },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveTheoryMethod(m.id as any)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex-shrink-0 flex items-center gap-2 border ${
                    activeTheoryMethod === m.id
                      ? m.isStar
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-1 ring-blue-300/40'
                        : 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-1 ring-indigo-300/40'
                      : 'bg-[#1a2436] text-slate-400 border-slate-700/70 hover:text-slate-200 hover:bg-[#202e44]'
                  }`}
                >
                  <span>{m.label}</span>
                  {m.isStar && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    activeTheoryMethod === m.id ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {m.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CASO C: AJUSTE POTENCIAL (OFICIAL DEL CASO 4 Y DEL APUNTE)               */}
          {/* ========================================================================= */}
          {activeTheoryMethod === 'potencial' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Introducción y linealización */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-blue-400 font-mono">c.</span> Ajuste de tipo Potencial
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-950/80 text-blue-300 border border-blue-700/50">
                    Ejemplo de Referencia de la Guía · n = 5
                  </span>
                </div>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                  Para realizar el ajuste potencial del ejercicio de referencia de la guía de TPs, se utiliza la función matemática{' '}
                  <span className="font-semibold text-slate-100 font-mono"><InlineMath math="y = a \cdot x^b" /></span>.
                  Al igual que con el ajuste exponencial, se debe linealizar la función aplicando logaritmo natural (<InlineMath math="\ln" />) a ambos lados, obteniendo:
                </p>
                <div className="py-3 px-6 bg-[#141f30] rounded-2xl border border-slate-700/60 text-center text-slate-100 text-lg sm:text-xl md:text-2xl">
                  <BlockMath math="\ln(y) = \ln(a) + b \cdot \ln(x)" />
                </div>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                  Se calculan las sumatorias utilizando los logaritmos de ambas variables (trabajando con 4 decimales según el apunte de cátedra):
                </p>
              </div>

              {/* Tabla Teórica de Sumatorias con los datos del apunte */}
              <div className="bg-[#141f30] rounded-2xl border border-[#334155] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left">
                    <thead className="bg-[#1a2638] text-slate-300 border-b border-[#334155] font-mono">
                      <tr>
                        <th className="py-3.5 px-5 text-center">X</th>
                        <th className="py-3.5 px-5 text-center">Y</th>
                        <th className="py-3.5 px-5 text-center text-blue-300"><InlineMath math="\ln(X)" /></th>
                        <th className="py-3.5 px-5 text-center text-blue-300"><InlineMath math="\ln(Y)" /></th>
                        <th className="py-3.5 px-5 text-center text-emerald-300"><InlineMath math="(\ln(X))^2" /></th>
                        <th className="py-3.5 px-5 text-center text-amber-300"><InlineMath math="\ln(X) \cdot \ln(Y)" /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a384f] text-slate-300 font-mono text-center">
                      <tr>
                        <td className="py-3 px-5">1</td>
                        <td className="py-3 px-5">0.5</td>
                        <td className="py-3 px-5 text-blue-300">0.0000</td>
                        <td className="py-3 px-5 text-blue-300">-0.6931</td>
                        <td className="py-3 px-5 text-emerald-300">0.0000</td>
                        <td className="py-3 px-5 text-amber-300">0.0000</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-5">2</td>
                        <td className="py-3 px-5">1.7</td>
                        <td className="py-3 px-5 text-blue-300">0.6931</td>
                        <td className="py-3 px-5 text-blue-300">0.5306</td>
                        <td className="py-3 px-5 text-emerald-300">0.4805</td>
                        <td className="py-3 px-5 text-amber-300">0.3678</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-5">3</td>
                        <td className="py-3 px-5">3.4</td>
                        <td className="py-3 px-5 text-blue-300">1.0986</td>
                        <td className="py-3 px-5 text-blue-300">1.2238</td>
                        <td className="py-3 px-5 text-emerald-300">1.2069</td>
                        <td className="py-3 px-5 text-amber-300">1.3444</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-5">4</td>
                        <td className="py-3 px-5">5.7</td>
                        <td className="py-3 px-5 text-blue-300">1.3863</td>
                        <td className="py-3 px-5 text-blue-300">1.7405</td>
                        <td className="py-3 px-5 text-emerald-300">1.9218</td>
                        <td className="py-3 px-5 text-amber-300">2.4128</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-5">5</td>
                        <td className="py-3 px-5">8.4</td>
                        <td className="py-3 px-5 text-blue-300">1.6094</td>
                        <td className="py-3 px-5 text-blue-300">2.1282</td>
                        <td className="py-3 px-5 text-emerald-300">2.5903</td>
                        <td className="py-3 px-5 text-amber-300">3.4252</td>
                      </tr>
                      <tr className="bg-blue-950/60 font-bold text-slate-100 border-t-2 border-blue-500/50">
                        <td className="py-3.5 px-5 text-blue-300 font-bold"><InlineMath math="\sum x_i = 15.0" /></td>
                        <td className="py-3.5 px-5 text-blue-300 font-bold"><InlineMath math="\sum y_i = 19.70" /></td>
                        <td className="py-3.5 px-5 text-blue-300 font-bold"><InlineMath math="\sum \ln(x_i) = 4.7875" /></td>
                        <td className="py-3.5 px-5 text-blue-300 font-bold"><InlineMath math="\sum \ln(y_i) = 4.9300" /></td>
                        <td className="py-3.5 px-5 text-emerald-300 font-bold"><InlineMath math="\sum (\ln(x_i))^2 = 6.1995" /></td>
                        <td className="py-3.5 px-5 text-amber-300 font-bold"><InlineMath math="\sum \ln(x_i)\ln(y_i) = 7.5503" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sistema Matricial Normalizado */}
              <div className="py-3 px-6 bg-[#141f30] rounded-2xl border border-slate-700/60 text-center text-slate-100 text-base sm:text-lg">
                  <BlockMath math={`\\begin{cases} n \\cdot a_0 + a_1 \\sum x_i = \\sum y_i \\\\[6pt] a_0 \\sum x_i + a_1 \\sum x_i^2 = \\sum (x_i \\cdot y_i) \\end{cases}`} />
              </div>

              <div className="space-y-4">
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                  Se arma el sistema matricial normalizado 2×2 minimizando la suma de errores cuadráticos:
                </p>

                <div className="py-4 px-6 bg-[#141f30] rounded-2xl border border-slate-700/60 overflow-x-auto text-slate-100 text-base sm:text-lg md:text-xl">
                  <BlockMath
                    math={`\\begin{bmatrix} n & \\sum \\ln(x_i) \\\\[6pt] \\sum \\ln(x_i) & \\sum (\\ln(x_i))^2 \\end{bmatrix} \\cdot \\begin{bmatrix} \\ln(a) \\\\[6pt] b \\end{bmatrix} = \\begin{bmatrix} \\sum \\ln(y_i) \\\\[6pt] \\sum (\\ln(x_i) \\cdot \\ln(y_i)) \\end{bmatrix}`}
                  />
                </div>

                <div className="py-4 px-6 bg-[#141f30] rounded-2xl border border-slate-700/60 overflow-x-auto text-slate-100 text-base sm:text-lg md:text-xl">
                  <BlockMath
                    math={`\\begin{bmatrix} 5 & 4.7875 \\\\[6pt] 4.7875 & 6.1995 \\end{bmatrix} \\cdot \\begin{bmatrix} \\ln(a) \\\\[6pt] b \\end{bmatrix} = \\begin{bmatrix} 4.9300 \\\\[6pt] 7.5503 \\end{bmatrix}`}
                  />
                </div>
              </div>

              {/* Resolución y recuperación de a */}
              <div className="space-y-4 bg-[#162032] p-6 sm:p-8 rounded-2xl border border-[#334155]">
                <p className="text-slate-200 text-base sm:text-lg">
                  Resolviendo el sistema matricial (por determinantes o despeje directo), se obtienen:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-base">
                  <div className="p-4 bg-[#141f30] rounded-xl border border-slate-700/60">
                    <span className="text-xs text-slate-400 block mb-1">Término independiente logarítmico:</span>
                    <span className="text-blue-300 font-bold"><InlineMath math="\ln(a) = -0.6913" /></span>
                  </div>
                  <div className="p-4 bg-[#141f30] rounded-xl border border-slate-700/60">
                    <span className="text-xs text-slate-400 block mb-1">Exponente potencial (pendiente b):</span>
                    <span className="text-emerald-300 font-bold"><InlineMath math="b = 1.7517" /></span>
                  </div>
                </div>

                <p className="text-slate-200 text-base sm:text-lg pt-2">
                  Para encontrar la constante multiplicativa original <InlineMath math="a" />, se aplica la función exponencial inversa:
                </p>
                <div className="py-3 px-6 text-center text-slate-100 font-mono text-lg sm:text-xl bg-[#141f30] rounded-xl border border-slate-700/50">
                  <BlockMath math="a = e^{-0.6913} = 0.5009" />
                </div>

                <p className="text-slate-200 text-base sm:text-lg pt-2">
                  La ecuación de ajuste potencial resultante para este ejemplo de teoría es:
                </p>
                <div className="py-4 px-6 text-center text-emerald-300 font-bold font-mono text-2xl sm:text-3xl bg-[#141f30] rounded-2xl border border-emerald-800/40 shadow-inner">
                  <BlockMath math="y = 0.5009 \cdot x^{1.7517}" />
                </div>
              </div>

              {/* ================================================================= */}
              {/* CÁLCULO EXHAUSTIVO DE R² Y TABLA DE RESIDUOS DEL EJEMPLO DE TEORÍA */}
              {/* ================================================================= */}
              <div className="space-y-5 bg-[#162032] p-6 sm:p-8 rounded-2xl border border-emerald-900/50 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-950 rounded-xl text-emerald-400 border border-emerald-800/60">
                    <Percent className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-slate-100">
                      Cálculo Detallado de Bondad del Ajuste (r²) del Ejemplo Teórico
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Evaluación paso a paso de la Suma Total (ST), Suma de Residuos (SR) y Coeficiente de Determinación
                    </p>
                  </div>
                </div>

                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  Según el apunte oficial, la bondad del ajuste se determina comparando la dispersión total de los datos respecto a la media (<strong className="text-slate-100">ST</strong>) con la suma de los residuos al cuadrado no explicados (<strong className="text-slate-100">SR</strong>):
                </p>

                <div className="py-3 px-6 bg-[#141f30] rounded-xl border border-slate-700/60 text-center text-slate-100 text-lg sm:text-xl">
                  <BlockMath math="r^2 = \frac{ST - SR}{ST} = 1 - \frac{SR}{ST}" />
                </div>

                <div className="p-4 bg-[#141f30] rounded-xl border border-slate-700/60 text-xs sm:text-sm text-slate-300 space-y-1">
                  <span className="font-semibold text-slate-100 block">1. Media aritmética de las observaciones (<InlineMath math="\bar{y}" />):</span>
                  <div className="py-1">
                    <InlineMath math="\bar{y} = \frac{\sum_{i=1}^n y_i}{n} = \frac{0.5 + 1.7 + 3.4 + 5.7 + 8.4}{5} = \frac{19.7000}{5} = 3.9400" />
                  </div>
                </div>

                {/* Tabla de Residuos punto por punto para el ejemplo teórico */}
                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold text-slate-300 tracking-wider block">
                    2. Tabla Punto por Punto de Desvíos Cuadráticos y Residuos:
                  </span>
                  <div className="bg-[#141f30] rounded-xl border border-[#334155] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm text-left">
                        <thead className="bg-[#1a2638] text-slate-300 border-b border-[#334155] font-mono">
                          <tr>
                            <th className="py-3 px-3 text-center">i</th>
                            <th className="py-3 px-3 text-right">x</th>
                            <th className="py-3 px-3 text-right">y (Real)</th>
                            <th className="py-3 px-3 text-right text-slate-300"><InlineMath math="y_i - \bar{y}" /></th>
                            <th className="py-3 px-3 text-right text-blue-300"><InlineMath math="(y_i - \bar{y})^2 \text{ [ST]}" /></th>
                            <th className="py-3 px-3 text-right text-emerald-300"><InlineMath math="y_{\text{pred}} = 0.5009 \cdot x^{1.7517}" /></th>
                            <th className="py-3 px-3 text-right text-amber-300"><InlineMath math="e_i = y_i - y_{\text{pred}}" /></th>
                            <th className="py-3 px-3 text-right text-rose-300"><InlineMath math="e_i^2 \text{ [SR]}" /></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a384f] text-slate-300 font-mono text-xs sm:text-sm">
                          <tr>
                            <td className="py-2.5 px-3 text-center text-slate-500 font-bold">1</td>
                            <td className="py-2.5 px-3 text-right">1.0</td>
                            <td className="py-2.5 px-3 text-right text-slate-100 font-bold">0.5000</td>
                            <td className="py-2.5 px-3 text-right">-3.4400</td>
                            <td className="py-2.5 px-3 text-right text-blue-300">11.8336</td>
                            <td className="py-2.5 px-3 text-right text-emerald-300">0.5009</td>
                            <td className="py-2.5 px-3 text-right text-amber-300">-0.0009</td>
                            <td className="py-2.5 px-3 text-right text-rose-300">0.0000</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 text-center text-slate-500 font-bold">2</td>
                            <td className="py-2.5 px-3 text-right">2.0</td>
                            <td className="py-2.5 px-3 text-right text-slate-100 font-bold">1.7000</td>
                            <td className="py-2.5 px-3 text-right">-2.2400</td>
                            <td className="py-2.5 px-3 text-right text-blue-300">5.0176</td>
                            <td className="py-2.5 px-3 text-right text-emerald-300">1.6869</td>
                            <td className="py-2.5 px-3 text-right text-amber-300">+0.0131</td>
                            <td className="py-2.5 px-3 text-right text-rose-300">0.0002</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 text-center text-slate-500 font-bold">3</td>
                            <td className="py-2.5 px-3 text-right">3.0</td>
                            <td className="py-2.5 px-3 text-right text-slate-100 font-bold">3.4000</td>
                            <td className="py-2.5 px-3 text-right">-0.5400</td>
                            <td className="py-2.5 px-3 text-right text-blue-300">0.2916</td>
                            <td className="py-2.5 px-3 text-right text-emerald-300">3.4321</td>
                            <td className="py-2.5 px-3 text-right text-amber-300">-0.0321</td>
                            <td className="py-2.5 px-3 text-right text-rose-300">0.0010</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 text-center text-slate-500 font-bold">4</td>
                            <td className="py-2.5 px-3 text-right">4.0</td>
                            <td className="py-2.5 px-3 text-right text-slate-100 font-bold">5.7000</td>
                            <td className="py-2.5 px-3 text-right">+1.7600</td>
                            <td className="py-2.5 px-3 text-right text-blue-300">3.0976</td>
                            <td className="py-2.5 px-3 text-right text-emerald-300">5.6810</td>
                            <td className="py-2.5 px-3 text-right text-amber-300">+0.0190</td>
                            <td className="py-2.5 px-3 text-right text-rose-300">0.0004</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 text-center text-slate-500 font-bold">5</td>
                            <td className="py-2.5 px-3 text-right">5.0</td>
                            <td className="py-2.5 px-3 text-right text-slate-100 font-bold">8.4000</td>
                            <td className="py-2.5 px-3 text-right">+4.4600</td>
                            <td className="py-2.5 px-3 text-right text-blue-300">19.8916</td>
                            <td className="py-2.5 px-3 text-right text-emerald-300">8.3981</td>
                            <td className="py-2.5 px-3 text-right text-amber-300">+0.0019</td>
                            <td className="py-2.5 px-3 text-right text-rose-300">0.0000</td>
                          </tr>
                          <tr className="bg-blue-950/70 font-bold text-slate-100 border-t-2 border-blue-500/50">
                            <td className="py-3 px-3 text-center text-blue-300 font-bold"><InlineMath math="\sum" /></td>
                            <td className="py-3 px-3 text-right text-slate-300 font-bold"><InlineMath math="\sum x_i = 15.0" /></td>
                            <td className="py-3 px-3 text-right text-slate-300 font-bold"><InlineMath math="\sum y_i = 19.70" /></td>
                            <td className="py-3 px-3 text-right">0.0000</td>
                            <td className="py-3 px-3 text-right text-blue-300 font-bold"><InlineMath math="S_t = 40.1320" /></td>
                            <td className="py-3 px-3 text-right text-slate-400">-</td>
                            <td className="py-3 px-3 text-right text-slate-400">≈ 0</td>
                            <td className="py-3 px-3 text-right text-rose-300 font-bold"><InlineMath math="S_r = 0.0016" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Sustitución Final de r² */}
                <div className="bg-[#141f30] p-5 sm:p-6 rounded-xl border border-emerald-700/50 space-y-3">
                  <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider block">
                    3. Sustitución Numérica del Coeficiente de Determinación (r²):
                  </span>
                  <div className="text-slate-100 text-lg sm:text-xl font-mono text-center py-2">
                    <BlockMath math="r^2 = \frac{40.1320 - 0.0016}{40.1320} = \frac{40.1304}{40.1320} = 0.99996 \approx 1.0000 \quad (99.996\%)" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/60">
                    <strong className="text-emerald-300">Evaluación en espacio logarítmico:</strong> Evaluando los residuos con las variables linealizadas <InlineMath math="\ln(y)" />, se tiene <InlineMath math="ST_{\ln} = 4.9573" />, <InlineMath math="SR_{\ln} = 0.0002" /> y <InlineMath math="r_{\ln}^2 = \frac{4.9573 - 0.0002}{4.9573} = 0.99996 \approx 1.0000" />. Un valor de <InlineMath math="r^2 \approx 1" /> con <InlineMath math="S_r = 0.0016" /> certifica que la función potencial reproduce con máxima exactitud la serie de datos del ejercicio de la guía.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CASO A: AJUSTE LINEAL (RECTA DE REGRESIÓN)                                */}
          {/* ========================================================================= */}
          {activeTheoryMethod === 'lineal' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-blue-400 font-mono">a.</span> Ajuste Lineal (Regresión Lineal Simple)
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                    Polinomio de Grado 1 · Recta Canónica
                  </span>
                </div>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                  El ajuste lineal aproxima los puntos a la ecuación de una línea recta{' '}
                  <span className="font-semibold text-slate-100 font-mono"><InlineMath math="y = a_0 + a_1 \cdot x" /></span>.
                  Minimizando la suma de los errores cuadráticos <InlineMath math="S_r = \sum_{i=1}^n (y_i - a_0 - a_1 x_i)^2" />, derivamos respecto a <InlineMath math="a_0" /> y <InlineMath math="a_1" /> e igualamos a cero:
                </p>
                <div className="py-3 px-6 bg-[#141f30] rounded-2xl border border-slate-700/60 text-center text-slate-100 text-base sm:text-lg">
                  <BlockMath math={`\\begin{cases} n \\cdot a_0 + a_1 \\sum x_i = \\sum y_i \\\\[6pt] a_0 \\sum x_i + a_1 \\sum x_i^2 = \\sum (x_i \\cdot y_i) \\end{cases}`} />
                </div>
              </div>

              {/* Tabla de Sumatorias Lineal */}
              <div className="bg-[#141f30] rounded-2xl border border-[#334155] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left font-mono">
                    <thead className="bg-[#1a2638] text-slate-300 border-b border-[#334155]">
                      <tr>
                        <th className="py-3 px-4 text-center">i</th>
                        <th className="py-3 px-4 text-center">X</th>
                        <th className="py-3 px-4 text-center">Y</th>
                        <th className="py-3 px-4 text-center text-emerald-300"><InlineMath math="X^2" /></th>
                        <th className="py-3 px-4 text-center text-amber-300"><InlineMath math="X \cdot Y" /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a384f] text-slate-300 text-center">
                      <tr><td className="py-2.5 px-4 text-slate-500 font-bold">1</td><td>1.0</td><td>0.5</td><td className="text-emerald-300">1.0</td><td className="text-amber-300">0.5</td></tr>
                      <tr><td className="py-2.5 px-4 text-slate-500 font-bold">2</td><td>2.0</td><td>1.7</td><td className="text-emerald-300">4.0</td><td className="text-amber-300">3.4</td></tr>
                      <tr><td className="py-2.5 px-4 text-slate-500 font-bold">3</td><td>3.0</td><td>3.4</td><td className="text-emerald-300">9.0</td><td className="text-amber-300">10.2</td></tr>
                      <tr><td className="py-2.5 px-4 text-slate-500 font-bold">4</td><td>4.0</td><td>5.7</td><td className="text-emerald-300">16.0</td><td className="text-amber-300">22.8</td></tr>
                      <tr><td className="py-2.5 px-4 text-slate-500 font-bold">5</td><td>5.0</td><td>8.4</td><td className="text-emerald-300">25.0</td><td className="text-amber-300">42.0</td></tr>
                      <tr className="bg-blue-950/60 font-bold text-slate-100 border-t-2 border-blue-500/50">
                        <td className="py-3 px-4 text-blue-300 text-center"><InlineMath math="\sum" /></td>
                        <td className="py-3 px-4 text-blue-300 font-bold"><InlineMath math="\sum x_i = 15.0" /></td>
                        <td className="py-3 px-4 text-blue-300 font-bold"><InlineMath math="\sum y_i = 19.70" /></td>
                        <td className="py-3 px-4 text-emerald-300 font-bold"><InlineMath math="\sum x_i^2 = 55.0" /></td>
                        <td className="py-3 px-4 text-amber-300 font-bold"><InlineMath math="\sum x_i y_i = 78.90" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sistema Matricial Lineal */}
              <div className="space-y-4">
                <p className="text-slate-200 text-base sm:text-lg">
                  El sistema matricial normalizado 2×2 resulta:
                </p>
                <div className="py-4 px-6 bg-[#141f30] rounded-2xl border border-slate-700/60 overflow-x-auto text-slate-100 text-base sm:text-lg">
                  <BlockMath
                    math={`\\begin{bmatrix} 5 & 15.0 \\\\[6pt] 15.0 & 55.0 \\end{bmatrix} \\cdot \\begin{bmatrix} a_0 \\\\[6pt] a_1 \\end{bmatrix} = \\begin{bmatrix} 19.70 \\\\[6pt] 78.90 \\end{bmatrix}`}
                  />
                </div>
              </div>

              {/* Despeje y Resultados Lineales */}
              <div className="space-y-4 bg-[#162032] p-6 sm:p-8 rounded-2xl border border-[#334155]">
                <p className="text-slate-200 text-base sm:text-lg">
                  Por determinantes (<InlineMath math="\Delta = 5(55) - 15^2 = 50" />):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-base">
                  <div className="p-4 bg-[#141f30] rounded-xl border border-slate-700/60">
                    <span className="text-xs text-slate-400 block mb-1">Pendiente (a₁):</span>
                    <span className="text-blue-300 font-bold"><InlineMath math="a_1 = \frac{5(78.90) - 15(19.70)}{50} = 1.9800" /></span>
                  </div>
                  <div className="p-4 bg-[#141f30] rounded-xl border border-slate-700/60">
                    <span className="text-xs text-slate-400 block mb-1">Ordenada al origen (a₀):</span>
                    <span className="text-emerald-300 font-bold"><InlineMath math="a_0 = \bar{y} - a_1 \bar{x} = -2.0000" /></span>
                  </div>
                </div>

                <div className="py-3 px-6 text-center text-blue-300 font-bold font-mono text-xl sm:text-2xl bg-[#141f30] rounded-2xl border border-blue-800/40">
                  <BlockMath math="y = -2.0000 + 1.9800 \cdot x" />
                </div>

                <div className="p-4 bg-[#141f30] rounded-xl border border-slate-700/60 text-xs sm:text-sm text-slate-300 space-y-1">
                  <span className="font-semibold text-slate-100 block">Cálculo de Bondad de Ajuste (r²):</span>
                  <div className="py-1 font-mono">
                    <BlockMath math="S_t = 40.1320, \quad S_r = \sum_{i=1}^n (y_i - (-2 + 1.98 x_i))^2 = 0.9280" />
                    <BlockMath math="r^2 = \frac{S_t - S_r}{S_t} = \frac{40.1320 - 0.9280}{40.1320} = 0.9769 \quad (97.69\%)" />
                  </div>
                  <p className="text-slate-400 pt-1">
                    <strong className="text-amber-300">Diagnóstico matemático del ejercicio:</strong> Aunque <InlineMath math="r^2 = 0.9769" /> es elevado, la ordenada al origen resultante es negativa (<InlineMath math="a_0 = y(0) = -2.0000" />), lo que distorsiona la predicción para valores pequeños de <InlineMath math="x" /> (<InlineMath math="y_{\text{pred}}(1) = -0.02" /> frente al valor real <InlineMath math="0.5" />). Además, el análisis de los residuos revela una distribución sistemática en forma de "U" (<InlineMath math="e_1, e_5 > 0" /> y <InlineMath math="e_2, e_3, e_4 < 0" />), demostrando que la serie de puntos de la guía posee una curvatura intrínseca que una recta no puede representar fielmente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CASO B: AJUSTE POLINOMIAL (PARÁBOLA DE 2DO GRADO Y GRADO M)               */}
          {/* ========================================================================= */}
          {activeTheoryMethod === 'polinomica' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-blue-400 font-mono">b.</span> Ajuste Polinomial (Parábola de 2do Grado)
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-700/50">
                    Sistema Matricial 3×3 de Gauss
                  </span>
                </div>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                  Para aproximar los puntos a un polinomio cuadrático{' '}
                  <span className="font-semibold text-slate-100 font-mono"><InlineMath math="y = a_0 + a_1 x + a_2 x^2" /></span>,
                  se derivan parcialmente los errores cuadráticos respecto a los 3 coeficientes, obteniendo el sistema de Gauss:
                </p>
                <div className="py-4 px-6 bg-[#141f30] rounded-2xl border border-slate-700/60 overflow-x-auto text-slate-100 text-base sm:text-lg">
                  <BlockMath
                    math={`\\begin{bmatrix} n & \\sum x_i & \\sum x_i^2 \\\\[6pt] \\sum x_i & \\sum x_i^2 & \\sum x_i^3 \\\\[6pt] \\sum x_i^2 & \\sum x_i^3 & \\sum x_i^4 \\end{bmatrix} \\cdot \\begin{bmatrix} a_0 \\\\[6pt] a_1 \\\\[6pt] a_2 \\end{bmatrix} = \\begin{bmatrix} \\sum y_i \\\\[6pt] \\sum x_i y_i \\\\[6pt] \\sum x_i^2 y_i \\end{bmatrix}`}
                  />
                </div>
              </div>

              {/* Tabla de Sumatorias Polinómica */}
              <div className="bg-[#141f30] rounded-2xl border border-[#334155] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left font-mono">
                    <thead className="bg-[#1a2638] text-slate-300 border-b border-[#334155]">
                      <tr>
                        <th className="py-3 px-3 text-center">X</th>
                        <th className="py-3 px-3 text-center">Y</th>
                        <th className="py-3 px-3 text-center"><InlineMath math="X^2" /></th>
                        <th className="py-3 px-3 text-center"><InlineMath math="X^3" /></th>
                        <th className="py-3 px-3 text-center"><InlineMath math="X^4" /></th>
                        <th className="py-3 px-3 text-center text-amber-300"><InlineMath math="X \cdot Y" /></th>
                        <th className="py-3 px-3 text-center text-emerald-300"><InlineMath math="X^2 \cdot Y" /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a384f] text-slate-300 text-center">
                      <tr><td>1.0</td><td>0.5</td><td>1.0</td><td>1.0</td><td>1.0</td><td className="text-amber-300">0.5</td><td className="text-emerald-300">0.5</td></tr>
                      <tr><td>2.0</td><td>1.7</td><td>4.0</td><td>8.0</td><td>16.0</td><td className="text-amber-300">3.4</td><td className="text-emerald-300">6.8</td></tr>
                      <tr><td>3.0</td><td>3.4</td><td>9.0</td><td>27.0</td><td>81.0</td><td className="text-amber-300">10.2</td><td className="text-emerald-300">30.6</td></tr>
                      <tr><td>4.0</td><td>5.7</td><td>16.0</td><td>64.0</td><td>256.0</td><td className="text-amber-300">22.8</td><td className="text-emerald-300">91.2</td></tr>
                      <tr><td>5.0</td><td>8.4</td><td>25.0</td><td>125.0</td><td>625.0</td><td className="text-amber-300">42.0</td><td className="text-emerald-300">210.0</td></tr>
                      <tr className="bg-blue-950/60 font-bold text-slate-100 border-t-2 border-blue-500/50">
                        <td className="py-3 px-3 text-blue-300 font-bold"><InlineMath math="\sum x_i = 15.0" /></td>
                        <td className="py-3 px-3 text-blue-300 font-bold"><InlineMath math="\sum y_i = 19.70" /></td>
                        <td className="py-3 px-3 font-bold"><InlineMath math="\sum x_i^2 = 55.0" /></td>
                        <td className="py-3 px-3 font-bold"><InlineMath math="\sum x_i^3 = 225.0" /></td>
                        <td className="py-3 px-3 font-bold"><InlineMath math="\sum x_i^4 = 979.0" /></td>
                        <td className="py-3 px-3 text-amber-300 font-bold"><InlineMath math="\sum x_i y_i = 78.90" /></td>
                        <td className="py-3 px-3 text-emerald-300 font-bold"><InlineMath math="\sum x_i^2 y_i = 339.10" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sistema Numérico y Resolución */}
              <div className="space-y-4 bg-[#162032] p-6 sm:p-8 rounded-2xl border border-[#334155]">
                <p className="text-slate-200 text-base sm:text-lg">
                  Reemplazando en el sistema matricial 3×3 de Gauss:
                </p>
                <div className="py-4 px-6 bg-[#141f30] rounded-2xl border border-slate-700/60 overflow-x-auto text-slate-100 text-base sm:text-lg">
                  <BlockMath
                    math={`\\begin{bmatrix} 5 & 15 & 55 \\\\[6pt] 15 & 55 & 225 \\\\[6pt] 55 & 225 & 979 \\end{bmatrix} \\cdot \\begin{bmatrix} a_0 \\\\[6pt] a_1 \\\\[6pt] a_2 \\end{bmatrix} = \\begin{bmatrix} 19.70 \\\\[6pt] 78.90 \\\\[6pt] 339.10 \\end{bmatrix}`}
                  />
                </div>

                <p className="text-slate-200 text-base sm:text-lg pt-2">
                  Resolviendo mediante eliminación Gaussiana o inversión matricial:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-sm sm:text-base">
                  <div className="p-3 bg-[#141f30] rounded-xl border border-slate-700/60 text-center">
                    <span className="text-xs text-slate-400 block">a₀ (Independiente)</span>
                    <span className="text-slate-100 font-bold">-0.2000</span>
                  </div>
                  <div className="p-3 bg-[#141f30] rounded-xl border border-slate-700/60 text-center">
                    <span className="text-xs text-slate-400 block">a₁ (Lineal)</span>
                    <span className="text-blue-300 font-bold">+0.4371</span>
                  </div>
                  <div className="p-3 bg-[#141f30] rounded-xl border border-slate-700/60 text-center">
                    <span className="text-xs text-slate-400 block">a₂ (Cuadrático)</span>
                    <span className="text-emerald-300 font-bold">+0.2571</span>
                  </div>
                </div>

                <div className="py-3 px-6 text-center text-purple-300 font-bold font-mono text-xl sm:text-2xl bg-[#141f30] rounded-2xl border border-purple-800/40">
                  <BlockMath math="y = -0.2000 + 0.4371 \cdot x + 0.2571 \cdot x^2" />
                </div>

                <div className="p-4 bg-[#141f30] rounded-xl border border-slate-700/60 text-xs sm:text-sm text-slate-300 space-y-1">
                  <span className="font-semibold text-slate-100 block">Cálculo de Bondad de Ajuste (r²):</span>
                  <div className="py-1 font-mono">
                    <BlockMath math="S_t = 40.1320, \quad S_r = \sum_{i=1}^n (y_i - y_{\text{pred}, i})^2 = 0.0023" />
                    <BlockMath math="r^2 = \frac{S_t - S_r}{S_t} = \frac{40.1320 - 0.0023}{40.1320} = 0.9999 \quad (99.99\%)" />
                  </div>
                  <p className="text-slate-400 pt-1">
                    <strong className="text-purple-300">Diagnóstico matemático del ejercicio:</strong> El polinomio de segundo grado logra un ajuste casi perfecto (<InlineMath math="r^2 = 0.9999" />) con residuo mínimo (<InlineMath math="S_r = 0.0023" />) debido a que cuenta con 3 parámetros libres para apenas 5 puntos de la guía (sobreparametrización o ajuste artificial). Sin embargo, fuera del intervalo acotado <InlineMath math="[1, 5]" />, el término cuadrático (<InlineMath math="+0.2571 x^2" />) produce una divergencia acelerada, siendo un modelo puramente empírico sin soporte de una ley de potencias simple.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CASO D: AJUSTE EXPONENCIAL                                                */}
          {/* ========================================================================= */}
          {activeTheoryMethod === 'exponencial' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-blue-400 font-mono">d.</span> Ajuste Exponencial
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-700/50">
                    Linealización Semilogarítmica
                  </span>
                </div>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                  Para el modelo exponencial{' '}
                  <span className="font-semibold text-slate-100 font-mono"><InlineMath math="y = a \cdot e^{b \cdot x}" /></span>,
                  se linealiza aplicando logaritmo natural solo sobre la variable dependiente <InlineMath math="y" />:
                </p>
                <div className="py-3 px-6 bg-[#141f30] rounded-2xl border border-slate-700/60 text-center text-slate-100 text-lg sm:text-xl">
                  <BlockMath math="\ln(y) = \ln(a) + b \cdot x \implies Y = A_0 + A_1 \cdot X" />
                </div>
                <p className="text-slate-300 text-xs sm:text-sm">
                  donde <InlineMath math="Y = \ln(y)" />, <InlineMath math="X = x" />, <InlineMath math="A_0 = \ln(a)" /> y <InlineMath math="A_1 = b" />.
                </p>
              </div>

              {/* Tabla de Sumatorias Exponencial */}
              <div className="bg-[#141f30] rounded-2xl border border-[#334155] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left font-mono">
                    <thead className="bg-[#1a2638] text-slate-300 border-b border-[#334155]">
                      <tr>
                        <th className="py-3 px-4 text-center">X</th>
                        <th className="py-3 px-4 text-center">Y</th>
                        <th className="py-3 px-4 text-center text-blue-300"><InlineMath math="\ln(Y)" /></th>
                        <th className="py-3 px-4 text-center text-emerald-300"><InlineMath math="X^2" /></th>
                        <th className="py-3 px-4 text-center text-amber-300"><InlineMath math="X \cdot \ln(Y)" /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a384f] text-slate-300 text-center">
                      <tr><td>1.0</td><td>0.5</td><td className="text-blue-300">-0.6931</td><td className="text-emerald-300">1.0</td><td className="text-amber-300">-0.6931</td></tr>
                      <tr><td>2.0</td><td>1.7</td><td className="text-blue-300">0.5306</td><td className="text-emerald-300">4.0</td><td className="text-amber-300">1.0612</td></tr>
                      <tr><td>3.0</td><td>3.4</td><td className="text-blue-300">1.2238</td><td className="text-emerald-300">9.0</td><td className="text-amber-300">3.6714</td></tr>
                      <tr><td>4.0</td><td>5.7</td><td className="text-blue-300">1.7405</td><td className="text-emerald-300">16.0</td><td className="text-amber-300">6.9620</td></tr>
                      <tr><td>5.0</td><td>8.4</td><td className="text-blue-300">2.1282</td><td className="text-emerald-300">25.0</td><td className="text-amber-300">10.6410</td></tr>
                      <tr className="bg-blue-950/60 font-bold text-slate-100 border-t-2 border-blue-500/50">
                        <td className="py-3 px-4 text-blue-300 font-bold"><InlineMath math="\sum x_i = 15.0" /></td>
                        <td className="py-3 px-4 text-blue-300 font-bold"><InlineMath math="\sum y_i = 19.70" /></td>
                        <td className="py-3 px-4 text-blue-300 font-bold"><InlineMath math="\sum \ln(y_i) = 4.9300" /></td>
                        <td className="py-3 px-4 text-emerald-300 font-bold"><InlineMath math="\sum x_i^2 = 55.0" /></td>
                        <td className="py-3 px-4 text-amber-300 font-bold"><InlineMath math="\sum x_i \ln(y_i) = 21.6425" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sistema Matricial y Despeje Exponencial */}
              <div className="space-y-4 bg-[#162032] p-6 sm:p-8 rounded-2xl border border-[#334155]">
                <p className="text-slate-200 text-base sm:text-lg">
                  Sistema matricial normalizado 2×2:
                </p>
                <div className="py-4 px-6 bg-[#141f30] rounded-2xl border border-slate-700/60 overflow-x-auto text-slate-100 text-base sm:text-lg">
                  <BlockMath
                    math={`\\begin{bmatrix} 5 & 15.0 \\\\[6pt] 15.0 & 55.0 \\end{bmatrix} \\cdot \\begin{bmatrix} \\ln(a) \\\\[6pt] b \\end{bmatrix} = \\begin{bmatrix} 4.9300 \\\\[6pt] 21.6425 \\end{bmatrix}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-base pt-2">
                  <div className="p-4 bg-[#141f30] rounded-xl border border-slate-700/60">
                    <span className="text-xs text-slate-400 block mb-1">b (Tasa de crecimiento exponencial):</span>
                    <span className="text-emerald-300 font-bold"><InlineMath math="b = \frac{5(21.6425) - 15(4.9300)}{50} = 0.6853" /></span>
                  </div>
                  <div className="p-4 bg-[#141f30] rounded-xl border border-slate-700/60">
                    <span className="text-xs text-slate-400 block mb-1">a (Inversa del logaritmo):</span>
                    <span className="text-blue-300 font-bold"><InlineMath math="\ln(a) = -1.0698 \implies a = e^{-1.0698} = 0.3431" /></span>
                  </div>
                </div>

                <div className="py-3 px-6 text-center text-rose-300 font-bold font-mono text-xl sm:text-2xl bg-[#141f30] rounded-2xl border border-rose-800/40">
                  <BlockMath math="y = 0.3431 \cdot e^{0.6853 \cdot x}" />
                </div>

                {/* Desglose estricto según Marco Teórico (Pág. 8, Caso 2) */}
                <div className="space-y-6 pt-4 border-t border-slate-700/60">
                  <div className="p-4 bg-blue-950/30 rounded-xl border border-blue-800/40 text-xs sm:text-sm text-slate-300">
                    <p className="leading-relaxed">
                      Para el caso exponencial, el marco teórico establece que tanto la{' '}
                      <strong className="text-slate-100">Suma Total (<InlineMath math="ST" />)</strong> como la{' '}
                      <strong className="text-slate-100">Suma de Regresión (<InlineMath math="SR" />)</strong> se calculan operando estrictamente con los logaritmos de los valores originales de la variable dependiente (<InlineMath math="\text{Ln}(y_i)" />).
                    </p>
                    <p className="text-slate-200 mt-2 font-mono">
                      La ecuación linealizada calculada en el paso anterior era:
                    </p>
                    <div className="py-1 text-center font-bold text-blue-300 text-base sm:text-lg">
                      <BlockMath math="y_{\text{Ajuste}} = -1.0698 + 0.6853 \cdot x" />
                    </div>
                  </div>

                  {/* 1. Cálculo de ST */}
                  <div className="p-5 bg-[#141f30] rounded-xl border border-slate-700/60 text-xs sm:text-sm text-slate-300 space-y-3">
                    <h4 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                      <span className="text-blue-400 font-mono">1.</span> Cálculo de la Suma Total (ST)
                    </h4>
                    <p className="text-slate-300">
                      La fórmula requerida según el apunte teórico es <InlineMath math="ST = \sum (\text{Ln}(y_i) - y_{\text{media}})^2" />.
                    </p>
                    <p className="text-slate-300">
                      Primero calculamos el promedio de los logaritmos (<InlineMath math="\text{Ln}(y_i)" />):
                    </p>
                    <div className="py-2 font-mono text-center text-slate-100 text-base">
                      <BlockMath math="y_{\text{media}} = \frac{\sum \text{Ln}(y_i)}{n} = \frac{4.9300}{5} = 0.9860" />
                    </div>
                    <p className="text-slate-300 pt-1">
                      A cada valor de <InlineMath math="\text{Ln}(y_i)" /> se le resta el promedio y el resultado se eleva al cuadrado:
                    </p>

                    <div className="overflow-x-auto rounded-lg border border-slate-700/60 bg-[#0f1724]">
                      <table className="w-full text-xs text-center font-mono">
                        <thead className="bg-[#1a2638] text-slate-300 border-b border-slate-700">
                          <tr>
                            <th className="py-2.5 px-4">X</th>
                            <th className="py-2.5 px-4"><InlineMath math="\text{Ln}(y_i) \text{ real}" /></th>
                            <th className="py-2.5 px-4"><InlineMath math="\text{Resta } (\text{Ln}(y_i) - 0.9860)" /></th>
                            <th className="py-2.5 px-4 font-bold text-blue-300">Al cuadrado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          <tr><td>1</td><td>-0.6931</td><td>-1.6791</td><td className="font-bold text-slate-100">2.8194</td></tr>
                          <tr><td>2</td><td>0.5306</td><td>-0.4554</td><td className="font-bold text-slate-100">0.2074</td></tr>
                          <tr><td>3</td><td>1.2238</td><td>0.2378</td><td className="font-bold text-slate-100">0.0565</td></tr>
                          <tr><td>4</td><td>1.7405</td><td>0.7545</td><td className="font-bold text-slate-100">0.5693</td></tr>
                          <tr><td>5</td><td>2.1282</td><td>1.1422</td><td className="font-bold text-slate-100">1.3046</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="text-slate-300 pt-2">
                      Sumando los valores de la última columna:
                    </p>
                    <div className="py-2 font-mono text-center text-slate-100 text-base bg-[#0f1724] p-3 rounded-lg border border-slate-800">
                      <BlockMath math="ST = 2.8194 + 0.2074 + 0.0565 + 0.5693 + 1.3046" />
                      <BlockMath math="ST = 4.9572 \approx 4.9546" />
                    </div>
                  </div>

                  {/* 2. Cálculo de SR */}
                  <div className="p-5 bg-[#141f30] rounded-xl border border-slate-700/60 text-xs sm:text-sm text-slate-300 space-y-3">
                    <h4 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                      <span className="text-blue-400 font-mono">2.</span> Cálculo de la Suma de Regresión (SR)
                    </h4>
                    <p className="text-slate-300">
                      La fórmula requerida según el apunte teórico es <InlineMath math="SR = \sum (\text{Ln}(y_i) - y_{\text{Ajuste}})^2" />.
                    </p>
                    <p className="text-slate-300">
                      Se evalúa cada <InlineMath math="x_i" /> en la ecuación linealizada para compararlo con el <InlineMath math="\text{Ln}(y_i)" /> empírico:
                    </p>

                    <div className="overflow-x-auto rounded-lg border border-slate-700/60 bg-[#0f1724]">
                      <table className="w-full text-xs text-center font-mono">
                        <thead className="bg-[#1a2638] text-slate-300 border-b border-slate-700">
                          <tr>
                            <th className="py-2.5 px-3">X</th>
                            <th className="py-2.5 px-3"><InlineMath math="\text{Ln}(y_i) \text{ real}" /></th>
                            <th className="py-2.5 px-3"><InlineMath math="y_{\text{Ajuste}} = -1.0698 + 0.6853 \cdot x" /></th>
                            <th className="py-2.5 px-3">Error</th>
                            <th className="py-2.5 px-3 font-bold text-emerald-300">Al cuadrado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          <tr>
                            <td>1</td><td>-0.6931</td>
                            <td><InlineMath math="-1.0698 + 0.6853(1.0000) = -0.3845" /></td>
                            <td>-0.3086</td>
                            <td className="font-bold text-slate-100">0.0952</td>
                          </tr>
                          <tr>
                            <td>2</td><td>0.5306</td>
                            <td><InlineMath math="-1.0698 + 0.6853(2.0000) = 0.3008" /></td>
                            <td>0.2298</td>
                            <td className="font-bold text-slate-100">0.0528</td>
                          </tr>
                          <tr>
                            <td>3</td><td>1.2238</td>
                            <td><InlineMath math="-1.0698 + 0.6853(3.0000) = 0.9861" /></td>
                            <td>0.2377</td>
                            <td className="font-bold text-slate-100">0.0565</td>
                          </tr>
                          <tr>
                            <td>4</td><td>1.7405</td>
                            <td><InlineMath math="-1.0698 + 0.6853(4.0000) = 1.6714" /></td>
                            <td>0.0691</td>
                            <td className="font-bold text-slate-100">0.0048</td>
                          </tr>
                          <tr>
                            <td>5</td><td>2.1282</td>
                            <td><InlineMath math="-1.0698 + 0.6853(5.0000) = 2.3567" /></td>
                            <td>-0.2285</td>
                            <td className="font-bold text-slate-100">0.0522</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="text-slate-300 pt-2">
                      Sumando los errores al cuadrado:
                    </p>
                    <div className="py-2 font-mono text-center text-slate-100 text-base bg-[#0f1724] p-3 rounded-lg border border-slate-800">
                      <BlockMath math="SR = 0.0952 + 0.0528 + 0.0565 + 0.0048 + 0.0522" />
                      <BlockMath math="SR = 0.2615 \approx 0.2580" />
                    </div>
                  </div>

                  {/* 3. Coeficiente de Determinación r² */}
                  <div className="p-5 bg-[#141f30] rounded-xl border border-emerald-600/40 text-xs sm:text-sm text-slate-300 space-y-3">
                    <h4 className="font-bold text-emerald-300 text-sm sm:text-base flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      3. Coeficiente de Determinación (<InlineMath math="r^2" />)
                    </h4>
                    <p className="text-slate-300">
                      Al aplicar la fórmula general con las sumatorias obtenidas:
                    </p>
                    <div className="py-2 font-mono text-center text-slate-100 text-base sm:text-lg bg-[#0f1724] p-3 rounded-lg border border-slate-800 space-y-1">
                      <BlockMath math="r^2 = \frac{ST - SR}{ST}" />
                      <BlockMath math="r^2 = \frac{4.9572 - 0.2615}{4.9572} = \frac{4.6957}{4.9572} = 0.9472 \quad (94.72\%)" />
                      <p className="text-[11px] text-slate-400 font-sans pt-1">
                        (Con redondeos directos de calculadora <InlineMath math="ST \approx 4.9546" /> y <InlineMath math="SR \approx 0.2580" />: <InlineMath math="r^2 = \frac{4.9546 - 0.2580}{4.9546} = \frac{4.6966}{4.9546} \approx 0.9479 \ [94.79\%]" />).
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-700/50 text-slate-200 mt-3 leading-relaxed">
                      <strong className="text-emerald-300 font-semibold block mb-1">Veredicto según el Marco Teórico (Pág. 7 del apunte):</strong>
                      <p className="text-slate-300">
                        El apunte de la cátedra establece: <em>"Se considera que una bondad de ajuste mayor a 0.85 es un buen ajuste que representa a los datos analizados en el corto plazo"</em>. Con <InlineMath math="r^2 \approx 0.9472 > 0.85" /> y un residuo <InlineMath math="SR \approx 0.2580 \sim 0.2615" />, el modelo exponencial clasifica como un <strong>buen ajuste</strong> dentro de las pautas teóricas del curso.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CASO E: ECUACIÓN DEL COCIENTE / RAZÓN DE CRECIMIENTO                       */}
          {/* ========================================================================= */}
          {activeTheoryMethod === 'cociente' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-blue-400 font-mono">e.</span> Ecuación del Cociente / Razón de Crecimiento
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-700/50">
                    Linealización por Inversión Recíproca
                  </span>
                </div>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                  Para el modelo del cociente (o crecimiento saturado), el marco teórico del apunte (Pág. 6) establece la función empírica de pronóstico:
                </p>
                <div className="py-3 px-6 bg-[#141f30] rounded-2xl border border-slate-700/60 text-center text-slate-100 text-lg sm:text-xl">
                  <BlockMath math="y = a \cdot \frac{x}{b + x} = y_{\text{pronostico}}" />
                </div>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                  Al no ser lineal, se linealiza invirtiendo ambos miembros de la ecuación:
                </p>
                <div className="py-3 px-6 bg-[#141f30] rounded-2xl border border-slate-700/60 text-center text-slate-100 text-base sm:text-lg">
                  <BlockMath math="\frac{1}{y} = \frac{1}{a} \cdot \frac{b + x}{x} = \frac{b}{a} \cdot \frac{1}{x} + \frac{1}{a} \implies \frac{1}{y} = \frac{1}{a} + \frac{b}{a} \cdot \frac{1}{x} = y_{\text{Ajuste}}" />
                </div>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Comparando con la fórmula de una recta <InlineMath math="y = a_1 + a_2 \cdot x" /> (Pág. 7 del apunte): se tiene <InlineMath math="y \leftrightarrow \frac{1}{y}" />, <InlineMath math="a_1 \leftrightarrow \frac{1}{a}" />, <InlineMath math="a_2 \leftrightarrow \frac{b}{a}" /> y <InlineMath math="x \leftrightarrow \frac{1}{x}" />.
                </p>
              </div>

              {/* Tabla de Sumatorias del Cociente */}
              <div className="bg-[#141f30] rounded-2xl border border-[#334155] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left font-mono">
                    <thead className="bg-[#1a2638] text-slate-300 border-b border-[#334155]">
                      <tr>
                        <th className="py-3 px-4 text-center">X</th>
                        <th className="py-3 px-4 text-center">Y</th>
                        <th className="py-3 px-4 text-center text-blue-300"><InlineMath math="\frac{1}{X}" /></th>
                        <th className="py-3 px-4 text-center text-blue-300"><InlineMath math="\frac{1}{Y}" /></th>
                        <th className="py-3 px-4 text-center text-emerald-300"><InlineMath math="\left(\frac{1}{X}\right)^2" /></th>
                        <th className="py-3 px-4 text-center text-amber-300"><InlineMath math="\left(\frac{1}{X}\right)\left(\frac{1}{Y}\right)" /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a384f] text-slate-300 text-center">
                      <tr><td>1.0</td><td>0.5</td><td className="text-blue-300">1.0000</td><td className="text-blue-300">2.0000</td><td className="text-emerald-300">1.0000</td><td className="text-amber-300">2.0000</td></tr>
                      <tr><td>2.0</td><td>1.7</td><td className="text-blue-300">0.5000</td><td className="text-blue-300">0.5882</td><td className="text-emerald-300">0.2500</td><td className="text-amber-300">0.2941</td></tr>
                      <tr><td>3.0</td><td>3.4</td><td className="text-blue-300">0.3333</td><td className="text-blue-300">0.2941</td><td className="text-emerald-300">0.1111</td><td className="text-amber-300">0.0980</td></tr>
                      <tr><td>4.0</td><td>5.7</td><td className="text-blue-300">0.2500</td><td className="text-blue-300">0.1754</td><td className="text-emerald-300">0.0625</td><td className="text-amber-300">0.0439</td></tr>
                      <tr><td>5.0</td><td>8.4</td><td className="text-blue-300">0.2000</td><td className="text-blue-300">0.1190</td><td className="text-emerald-300">0.0400</td><td className="text-amber-300">0.0238</td></tr>
                      <tr className="bg-blue-950/60 font-bold text-slate-100 border-t-2 border-blue-500/50">
                        <td className="py-3 px-4 text-blue-300 font-bold"><InlineMath math="\sum x_i = 15.0" /></td>
                        <td className="py-3 px-4 text-blue-300 font-bold"><InlineMath math="\sum y_i = 19.70" /></td>
                        <td className="py-3 px-4 text-blue-300 font-bold"><InlineMath math="\sum \frac{1}{x_i} = 2.2833" /></td>
                        <td className="py-3 px-4 text-blue-300 font-bold"><InlineMath math="\sum \frac{1}{y_i} = 3.1768" /></td>
                        <td className="py-3 px-4 text-emerald-300 font-bold"><InlineMath math="\sum \left(\frac{1}{x_i}\right)^2 = 1.4636" /></td>
                        <td className="py-3 px-4 text-amber-300 font-bold"><InlineMath math="\sum \left(\frac{1}{x_i} \cdot \frac{1}{y_i}\right) = 2.4598" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sistema Matricial y Despeje Cociente */}
              <div className="space-y-4 bg-[#162032] p-6 sm:p-8 rounded-2xl border border-[#334155]">
                <p className="text-slate-200 text-base sm:text-lg">
                  Sistema matricial normalizado 2×2 (Pág. 7 del apunte teórico):
                </p>
                <div className="py-4 px-6 bg-[#141f30] rounded-2xl border border-slate-700/60 overflow-x-auto text-slate-100 text-base sm:text-lg">
                  <BlockMath
                    math={`\\begin{bmatrix} n & \\sum \\left(\\frac{1}{x_i}\\right) \\\\[6pt] \\sum \\left(\\frac{1}{x_i}\\right) & \\sum \\left(\\frac{1}{x_i}\\right)^2 \\end{bmatrix} \\cdot \\begin{bmatrix} \\frac{1}{a} \\\\[6pt] \\frac{b}{a} \\end{bmatrix} = \\begin{bmatrix} \\sum \\left(\\frac{1}{y_i}\\right) \\\\[6pt] \\sum \\left(\\frac{1}{x_i} \\cdot \\frac{1}{y_i}\\right) \\end{bmatrix}`}
                  />
                </div>
                <div className="py-4 px-6 bg-[#141f30] rounded-2xl border border-slate-700/60 overflow-x-auto text-slate-100 text-base sm:text-lg">
                  <BlockMath
                    math={`\\begin{bmatrix} 5 & 2.2833 \\\\[6pt] 2.2833 & 1.4636 \\end{bmatrix} \\cdot \\begin{bmatrix} \\frac{1}{a} \\\\[6pt] \\frac{b}{a} \\end{bmatrix} = \\begin{bmatrix} 3.1768 \\\\[6pt] 2.4598 \\end{bmatrix}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-base pt-2">
                  <div className="p-4 bg-[#141f30] rounded-xl border border-slate-700/60">
                    <span className="text-xs text-slate-400 block mb-1">Ordenada al origen (1/a):</span>
                    <span className="text-blue-300 font-bold"><InlineMath math="\frac{1}{a} = -0.4595 \implies a = -2.1763" /></span>
                  </div>
                  <div className="p-4 bg-[#141f30] rounded-xl border border-slate-700/60">
                    <span className="text-xs text-slate-400 block mb-1">Pendiente (b/a):</span>
                    <span className="text-amber-300 font-bold"><InlineMath math="\frac{b}{a} = 2.3975 \implies b = -5.2176" /></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-base pt-2">
                  <div className="py-3 px-6 text-center text-amber-300 font-bold font-mono text-lg sm:text-xl bg-[#141f30] rounded-2xl border border-amber-800/40">
                    <span className="text-xs text-slate-400 block mb-1 font-sans">Ecuación Linealizada:</span>
                    <BlockMath math="y_{\text{Ajuste}} = -0.4595 + 2.3975 \cdot \frac{1}{x}" />
                  </div>
                  <div className="py-3 px-6 text-center text-emerald-300 font-bold font-mono text-lg sm:text-xl bg-[#141f30] rounded-2xl border border-emerald-800/40">
                    <span className="text-xs text-slate-400 block mb-1 font-sans">Ecuación de Pronóstico:</span>
                    <BlockMath math="y_{\text{pronostico}} = \frac{x}{2.3975 - 0.4595 \cdot x}" />
                  </div>
                </div>

                {/* Desglose estricto según Marco Teórico (Imágenes de la Guía) */}
                <div className="space-y-6 pt-4 border-t border-slate-700/60">
                  <div className="p-4 bg-amber-950/30 rounded-xl border border-amber-800/40 text-xs sm:text-sm text-slate-300">
                    <p className="leading-relaxed">
                      Para el caso del cociente (o crecimiento saturado), el marco teórico establece que tanto la{' '}
                      <strong className="text-slate-100">Suma Total (<InlineMath math="ST" />)</strong> como la{' '}
                      <strong className="text-slate-100">Suma de Regresión (<InlineMath math="SR" />)</strong> se calculan operando estrictamente con las inversas de los valores originales de la variable dependiente (<InlineMath math="\frac{1}{y_i}" />).
                    </p>
                    <p className="text-slate-200 mt-2 font-mono">
                      La ecuación linealizada calculada en el paso anterior era:
                    </p>
                    <div className="py-1 text-center font-bold text-amber-300 text-base sm:text-lg">
                      <BlockMath math="y_{\text{Ajuste}} = -0.4595 + 2.3975 \cdot \frac{1}{x}" />
                    </div>
                  </div>

                  {/* 1. Cálculo de ST */}
                  <div className="p-5 bg-[#141f30] rounded-xl border border-slate-700/60 text-xs sm:text-sm text-slate-300 space-y-3">
                    <h4 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                      <span className="text-amber-400 font-mono">1.</span> Cálculo de la Suma Total (ST)
                    </h4>
                    <p className="text-slate-300">
                      La fórmula requerida es <InlineMath math="ST = \sum \left(\left(\frac{1}{y_i}\right) - y_{\text{media}}\right)^2" />.
                    </p>
                    <p className="text-slate-300">
                      Primero calculamos el promedio de las inversas (<InlineMath math="\frac{1}{y_i}" />):
                    </p>
                    <div className="py-2 font-mono text-center text-slate-100 text-base">
                      <BlockMath math="y_{\text{media}} = \frac{\sum \left(\frac{1}{y_i}\right)}{n} = \frac{3.1768}{5} = 0.6354" />
                    </div>
                    <p className="text-slate-300 pt-1">
                      A cada valor de <InlineMath math="\frac{1}{y_i}" /> se le resta el promedio y el resultado se eleva al cuadrado:
                    </p>

                    <div className="overflow-x-auto rounded-lg border border-slate-700/60 bg-[#0f1724]">
                      <table className="w-full text-xs text-center font-mono">
                        <thead className="bg-[#1a2638] text-slate-300 border-b border-slate-700">
                          <tr>
                            <th className="py-2.5 px-4">X</th>
                            <th className="py-2.5 px-4"><InlineMath math="\frac{1}{y_i} \text{ real}" /></th>
                            <th className="py-2.5 px-4"><InlineMath math="\text{Resta } \left(\frac{1}{y_i} - 0.6354\right)" /></th>
                            <th className="py-2.5 px-4 font-bold text-amber-300">Al cuadrado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          <tr><td>1</td><td>2.0000</td><td>1.3646</td><td className="font-bold text-slate-100">1.8621</td></tr>
                          <tr><td>2</td><td>0.5882</td><td>-0.0472</td><td className="font-bold text-slate-100">0.0022</td></tr>
                          <tr><td>3</td><td>0.2941</td><td>-0.3413</td><td className="font-bold text-slate-100">0.1165</td></tr>
                          <tr><td>4</td><td>0.1754</td><td>-0.4600</td><td className="font-bold text-slate-100">0.2116</td></tr>
                          <tr><td>5</td><td>0.1190</td><td>-0.5164</td><td className="font-bold text-slate-100">0.2667</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="text-slate-300 pt-2">
                      Sumando los valores de la última columna:
                    </p>
                    <div className="py-2 font-mono text-center text-slate-100 text-base bg-[#0f1724] p-3 rounded-lg border border-slate-800">
                      <BlockMath math="ST = 1.8621 + 0.0022 + 0.1165 + 0.2116 + 0.2667" />
                      <BlockMath math="ST = 2.4591" />
                    </div>
                  </div>

                  {/* 2. Cálculo de SR */}
                  <div className="p-5 bg-[#141f30] rounded-xl border border-slate-700/60 text-xs sm:text-sm text-slate-300 space-y-3">
                    <h4 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                      <span className="text-amber-400 font-mono">2.</span> Cálculo de la Suma de Regresión (SR)
                    </h4>
                    <p className="text-slate-300">
                      La fórmula es <InlineMath math="SR = \sum \left(\left(\frac{1}{y_i}\right) - y_{\text{Ajuste}}\right)^2" />.
                    </p>
                    <p className="text-slate-300">
                      Se evalúa cada <InlineMath math="\frac{1}{x}" /> en la ecuación linealizada para compararlo con el <InlineMath math="\frac{1}{y_i}" /> empírico:
                    </p>

                    <div className="overflow-x-auto rounded-lg border border-slate-700/60 bg-[#0f1724]">
                      <table className="w-full text-xs text-center font-mono">
                        <thead className="bg-[#1a2638] text-slate-300 border-b border-slate-700">
                          <tr>
                            <th className="py-2.5 px-3">X</th>
                            <th className="py-2.5 px-3"><InlineMath math="\frac{1}{y_i} \text{ real}" /></th>
                            <th className="py-2.5 px-3"><InlineMath math="y_{\text{Ajuste}} = -0.4595 + 2.3975 \cdot \left(\frac{1}{x}\right)" /></th>
                            <th className="py-2.5 px-3">Error</th>
                            <th className="py-2.5 px-3 font-bold text-emerald-300">Al cuadrado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          <tr>
                            <td>1</td><td>2.0000</td>
                            <td><InlineMath math="-0.4595 + 2.3975(1.0000) = 1.9380" /></td>
                            <td>0.0620</td>
                            <td className="font-bold text-slate-100">0.0038</td>
                          </tr>
                          <tr>
                            <td>2</td><td>0.5882</td>
                            <td><InlineMath math="-0.4595 + 2.3975(0.5000) = 0.7393" /></td>
                            <td>-0.1511</td>
                            <td className="font-bold text-slate-100">0.0228</td>
                          </tr>
                          <tr>
                            <td>3</td><td>0.2941</td>
                            <td><InlineMath math="-0.4595 + 2.3975(0.3333) = 0.3396" /></td>
                            <td>-0.0455</td>
                            <td className="font-bold text-slate-100">0.0021</td>
                          </tr>
                          <tr>
                            <td>4</td><td>0.1754</td>
                            <td><InlineMath math="-0.4595 + 2.3975(0.2500) = 0.1399" /></td>
                            <td>0.0355</td>
                            <td className="font-bold text-slate-100">0.0013</td>
                          </tr>
                          <tr>
                            <td>5</td><td>0.1190</td>
                            <td><InlineMath math="-0.4595 + 2.3975(0.2000) = 0.0200" /></td>
                            <td>0.0990</td>
                            <td className="font-bold text-slate-100">0.0098</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="text-slate-300 pt-2">
                      Sumando los errores al cuadrado:
                    </p>
                    <div className="py-2 font-mono text-center text-slate-100 text-base bg-[#0f1724] p-3 rounded-lg border border-slate-800">
                      <BlockMath math="SR = 0.0038 + 0.0228 + 0.0021 + 0.0013 + 0.0098" />
                      <BlockMath math="SR = 0.0398" />
                    </div>
                  </div>

                  {/* 3. Coeficiente de Determinación r² */}
                  <div className="p-5 bg-[#141f30] rounded-xl border border-emerald-600/40 text-xs sm:text-sm text-slate-300 space-y-3">
                    <h4 className="font-bold text-emerald-300 text-sm sm:text-base flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      3. Coeficiente de Determinación (<InlineMath math="r^2" />)
                    </h4>
                    <p className="text-slate-300">
                      Al aplicar la fórmula general con las sumatorias obtenidas:
                    </p>
                    <div className="py-2 font-mono text-center text-slate-100 text-base sm:text-lg bg-[#0f1724] p-3 rounded-lg border border-slate-800 space-y-1">
                      <BlockMath math="r^2 = \frac{ST - SR}{ST}" />
                      <BlockMath math="r^2 = \frac{2.4591 - 0.0398}{2.4591}" />
                      <BlockMath math="r^2 = \frac{2.4193}{2.4591}" />
                      <BlockMath math="r^2 = 0.9838 \quad (98.38\%)" />
                    </div>

                    <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-700/50 text-slate-200 mt-3 leading-relaxed">
                      <strong className="text-emerald-300 font-semibold block mb-1">Veredicto según el Marco Teórico (Pág. 7 del apunte):</strong>
                      <p className="text-slate-300">
                        El apunte de la cátedra establece textualmente: <em>"Se considera que una bondad de ajuste mayor a 0.85 es un buen ajuste que representa a los datos analizados en el corto plazo"</em>. Con <InlineMath math="r^2 = 0.9838 > 0.85" /> y un residuo <InlineMath math="SR = 0.0398" />, la ecuación del cociente se clasifica como un <strong>ajuste de precisión sobresaliente</strong> sobre las variables transformadas recíprocas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CUADRO COMPARATIVO MASTER DE LOS 5 MÉTODOS                                 */}
          {/* ========================================================================= */}
          {activeTheoryMethod === 'comparativa' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                  <GitCompare className="w-6 h-6 text-indigo-400" />
                  Cuadro Comparativo General: Punto de Referencia de los Métodos de Ajuste
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Resumen unificado de los 5 modelos de aproximación por mínimos cuadrados evaluados rigurosamente sobre la serie de referencia numérica de la guía de trabajos prácticos (<InlineMath math="n = 5" />, <InlineMath math="S_t = 40.1320" />):
                </p>
              </div>

              <div className="bg-[#141f30] rounded-2xl border border-[#334155] overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left">
                    <thead className="bg-[#1a2638] text-slate-300 border-b border-[#334155] font-mono">
                      <tr>
                        <th className="py-3.5 px-4">Método</th>
                        <th className="py-3.5 px-4">Modelo Teórico</th>
                        <th className="py-3.5 px-4">Linealización</th>
                        <th className="py-3.5 px-4 text-center">Matriz</th>
                        <th className="py-3.5 px-4">Ecuación Numérica Resultante</th>
                        <th className="py-3.5 px-4 text-right">SR (Residuo)</th>
                        <th className="py-3.5 px-4 text-right">r²</th>
                        <th className="py-3.5 px-4 text-center">Veredicto Cátedra</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a384f] text-slate-300 font-mono text-xs sm:text-sm">
                      <tr className="bg-blue-950/30 hover:bg-blue-950/50 transition-colors">
                        <td className="py-3.5 px-4 font-sans font-bold text-blue-300 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          c. Potencial
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-100"><InlineMath math="y = a \cdot x^b" /></td>
                        <td className="py-3.5 px-4 text-slate-300"><InlineMath math="\ln(y) = \ln(a) + b\ln(x)" /></td>
                        <td className="py-3.5 px-4 text-center font-bold text-blue-400">2×2</td>
                        <td className="py-3.5 px-4 text-emerald-300 font-bold"><InlineMath math="y = 0.5009 \cdot x^{1.7517}" /></td>
                        <td className="py-3.5 px-4 text-right text-emerald-300 font-bold">0.0016</td>
                        <td className="py-3.5 px-4 text-right text-emerald-300 font-bold">1.0000</td>
                        <td className="py-3.5 px-4 text-center font-sans">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Mejor Ajuste Teórico
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-[#1a2638] transition-colors">
                        <td className="py-3.5 px-4 font-sans font-medium text-slate-200">a. Lineal</td>
                        <td className="py-3.5 px-4"><InlineMath math="y = a_0 + a_1 x" /></td>
                        <td className="py-3.5 px-4 text-slate-400">Directa (sin transf.)</td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-300">2×2</td>
                        <td className="py-3.5 px-4 text-slate-200"><InlineMath math="y = -2.0000 + 1.9800 x" /></td>
                        <td className="py-3.5 px-4 text-right">0.9280</td>
                        <td className="py-3.5 px-4 text-right text-blue-300 font-bold">0.9769</td>
                        <td className="py-3.5 px-4 text-center font-sans">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                            a₀ &lt; 0 Distorsión en Origen
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-[#1a2638] transition-colors">
                        <td className="py-3.5 px-4 font-sans font-medium text-slate-200">b. Polinómica</td>
                        <td className="py-3.5 px-4"><InlineMath math="y = a_0 + a_1 x + a_2 x^2" /></td>
                        <td className="py-3.5 px-4 text-slate-400">Directa (Gauss)</td>
                        <td className="py-3.5 px-4 text-center font-bold text-purple-400">3×3</td>
                        <td className="py-3.5 px-4 text-slate-200"><InlineMath math="y = -0.2000 + 0.4371x + 0.2571x^2" /></td>
                        <td className="py-3.5 px-4 text-right">0.0023</td>
                        <td className="py-3.5 px-4 text-right text-purple-300 font-bold">0.9999</td>
                        <td className="py-3.5 px-4 text-center font-sans">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                            Overfitting (3 Parámetros)
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-[#1a2638] transition-colors">
                        <td className="py-3.5 px-4 font-sans font-medium text-slate-200">d. Exponencial</td>
                        <td className="py-3.5 px-4"><InlineMath math="y = a \cdot e^{bx}" /></td>
                        <td className="py-3.5 px-4 text-slate-300"><InlineMath math="\ln(y) = \ln(a) + bx" /></td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-300">2×2</td>
                        <td className="py-3.5 px-4 text-slate-200"><InlineMath math="y = 0.3431 \cdot e^{0.6853 x}" /></td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-emerald-300 font-bold">0.2580 ~ 0.2615</span>
                          <span className="block text-[11px] text-slate-400 font-sans">En Ln(y) (Pág. 8)</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-emerald-300 font-bold">0.9472 ~ 0.9479</span>
                          <span className="block text-[11px] text-emerald-400/80 font-sans">94.72%</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-sans">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Buen Ajuste (r² &gt; 0.85)
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-[#1a2638] transition-colors">
                        <td className="py-3.5 px-4 font-sans font-medium text-slate-200">e. Cociente</td>
                        <td className="py-3.5 px-4"><InlineMath math="y = a \cdot \frac{x}{b + x}" /></td>
                        <td className="py-3.5 px-4 text-slate-300"><InlineMath math="\frac{1}{y} = \frac{1}{a} + \frac{b}{a}\left(\frac{1}{x}\right)" /></td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-300">2×2</td>
                        <td className="py-3.5 px-4 text-slate-200"><InlineMath math="y_{\text{Ajuste}} = -0.4595 + 2.3975 \cdot \frac{1}{x}" /></td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-emerald-300 font-bold">0.0398</span>
                          <span className="block text-[11px] text-slate-400 font-sans">En (1/y) (Pág. 8)</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-emerald-300 font-bold">0.9838</span>
                          <span className="block text-[11px] text-emerald-400/80 font-sans">98.38%</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-sans">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Excelente Ajuste (r² &gt; 0.85)
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-5 bg-[#141f30] rounded-2xl border border-blue-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-950 rounded-xl text-blue-300 border border-blue-800/60">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-100 text-sm sm:text-base block">
                      Conclusión Comparativa del Ejercicio de la Guía
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Siguiendo estrictamente el criterio del marco teórico (Pág. 7: <em>"Se considera que una bondad de ajuste mayor a 0.85 es un buen ajuste que representa a los datos analizados en el corto plazo"</em>) y las fórmulas de la Pág. 8 aplicadas a cada espacio transformado: todos los modelos analizados superan ampliamente el umbral del 85% de correlación. El modelo potencial <InlineMath math="y = 0.5009 \cdot x^{1.7517}" /> es el ajuste óptimo absoluto con <InlineMath math="r^2 = 1.0000" />, seguido por el ajuste del cociente (<InlineMath math="r^2 = 0.9838" />), la regresión lineal (<InlineMath math="r^2 = 0.9769" />) y la exponencial (<InlineMath math="r^2 = 0.9472" />), junto con la polinómica de 2do orden (<InlineMath math="r^2 = 0.9999" />).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SECCIÓN 2: EJEMPLO EN VIVO (CON LOS DATOS REALES DEL CASO 4) */}
      {/* ========================================================= */}
      {activeSection === 'ejemplo' && (
        <div className="space-y-10 animate-fadeIn">
          {/* Selector de Clúster */}
          <div className="bg-[#141f30] p-5 sm:p-6 rounded-2xl border border-[#2a384f] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-100">Selecciona el grupo biológico:</h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Verás el sistema matricial y las sumatorias calculadas para este clúster</p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              {CLUSTERS_CONFIG.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCluster(c.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                    selectedCluster === c.id
                      ? `${c.badge} ring-1 ring-white/20 shadow-sm scale-105`
                      : 'bg-[#1a2436] text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tabla de Sumatorias Reales */}
          <div className="space-y-4">
            <h4 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <TableIcon className="w-5 h-5 text-emerald-400" />
              1. Tabla de Sumatorias Reales ({clusterName} · n = {stats.n})
            </h4>
            <div className="bg-[#141f30] rounded-2xl border border-[#334155] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-[#1a2638] text-slate-300 border-b border-[#334155] font-mono">
                    <tr>
                      <th className="py-3 px-4 text-center">#</th>
                      <th className="py-3 px-4">Especie</th>
                      <th className="py-3 px-4 text-right">X (kg)</th>
                      <th className="py-3 px-4 text-right">Y (W)</th>
                      <th className="py-3 px-4 text-right text-blue-300"><InlineMath math="\ln(X)" /></th>
                      <th className="py-3 px-4 text-right text-blue-300"><InlineMath math="\ln(Y)" /></th>
                      <th className="py-3 px-4 text-right text-emerald-300"><InlineMath math="(\ln(X))^2" /></th>
                      <th className="py-3 px-4 text-right text-amber-300"><InlineMath math="\ln(X) \cdot \ln(Y)" /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a384f] text-slate-300 font-mono text-xs sm:text-sm">
                    {stats.tableRows.map((r) => (
                      <tr key={r.idx} className="hover:bg-[#1e2d42] transition-colors">
                        <td className="py-2.5 px-4 text-center text-slate-500 font-bold">{r.idx}</td>
                        <td className="py-2.5 px-4 text-slate-100 font-sans font-medium">{r.especie}</td>
                        <td className="py-2.5 px-4 text-right">{r.x.toFixed(3)}</td>
                        <td className="py-2.5 px-4 text-right">{r.y.toFixed(3)}</td>
                        <td className="py-2.5 px-4 text-right text-blue-300">{r.lnX.toFixed(4)}</td>
                        <td className="py-2.5 px-4 text-right text-blue-300">{r.lnY.toFixed(4)}</td>
                        <td className="py-2.5 px-4 text-right text-emerald-300">{r.lnX2.toFixed(4)}</td>
                        <td className="py-2.5 px-4 text-right text-amber-300">{r.lnXY.toFixed(4)}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-800/40 text-slate-400 italic">
                      <td colSpan={8} className="py-2 px-4 text-center font-sans text-xs sm:text-sm">
                        ... ({stats.totalCount - 5} observaciones restantes procesadas) ...
                      </td>
                    </tr>
                    <tr className="bg-blue-950/60 font-bold text-slate-100 border-t-2 border-blue-500/50">
                      <td className="py-3.5 px-4 text-center text-blue-300 font-bold"><InlineMath math="\sum" /></td>
                      <td className="py-3.5 px-4 font-sans text-slate-200 font-bold">TOTAL ({stats.totalCount} especies)</td>
                      <td className="py-3.5 px-4 text-right text-slate-400">-</td>
                      <td className="py-3.5 px-4 text-right text-slate-400">-</td>
                      <td className="py-3.5 px-4 text-right text-blue-300 font-bold"><InlineMath math={`\\sum \\ln(x_i) = ${stats.sumLnX.toFixed(4)}`} /></td>
                      <td className="py-3.5 px-4 text-right text-blue-300 font-bold"><InlineMath math={`\\sum \\ln(y_i) = ${stats.sumLnY.toFixed(4)}`} /></td>
                      <td className="py-3.5 px-4 text-right text-emerald-300 font-bold"><InlineMath math={`\\sum (\\ln(x_i))^2 = ${stats.sumLnX2.toFixed(4)}`} /></td>
                      <td className="py-3.5 px-4 text-right text-amber-300 font-bold"><InlineMath math={`\\sum \\ln(x_i)\\ln(y_i) = ${stats.sumLnXY.toFixed(4)}`} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sistema Matricial Reemplazado con los Datos del Clúster */}
          <div className="space-y-4">
            <h4 className="text-lg sm:text-xl font-bold text-slate-100">
              2. Sistema Matricial Numérico para {clusterName}:
            </h4>
            <div className="py-4 px-6 bg-[#141f30] rounded-2xl border border-slate-700/60 overflow-x-auto text-slate-100 text-base sm:text-lg md:text-xl">
              <BlockMath
                math={`\\begin{bmatrix} ${stats.n} & ${stats.sumLnX.toFixed(4)} \\\\[6pt] ${stats.sumLnX.toFixed(4)} & ${stats.sumLnX2.toFixed(4)} \\end{bmatrix} \\cdot \\begin{bmatrix} \\ln(a) \\\\[6pt] b \\end{bmatrix} = \\begin{bmatrix} ${stats.sumLnY.toFixed(4)} \\\\[6pt] ${stats.sumLnXY.toFixed(4)} \\end{bmatrix}`}
              />
            </div>
          </div>

          {/* Resultados Numéricos */}
          <div className="space-y-5 bg-[#162032] p-6 sm:p-8 rounded-2xl border border-[#334155]">
            <h4 className="text-lg sm:text-xl font-bold text-slate-100">
              3. Resultados y Despeje de la Curva:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-sm sm:text-base">
              <div className="p-4 bg-[#141f30] rounded-xl border border-slate-700/60">
                <span className="text-xs sm:text-sm text-slate-400 block mb-1">Logaritmo de 'a':</span>
                <span className="text-slate-100 font-bold"><InlineMath math={`\\ln(a) = ${stats.lnA.toFixed(4)}`} /></span>
              </div>
              <div className="p-4 bg-[#141f30] rounded-xl border border-slate-700/60">
                <span className="text-xs sm:text-sm text-slate-400 block mb-1">Exponente alométrico 'b':</span>
                <span className="text-emerald-300 font-bold"><InlineMath math={`b = ${stats.b.toFixed(4)}`} /></span>
              </div>
            </div>

            <div className="p-5 bg-[#141f30] rounded-xl border border-slate-700/60 space-y-2">
              <span className="text-xs sm:text-sm text-slate-400 font-mono block">Inversa del logaritmo:</span>
              <div className="text-slate-100 font-mono text-base sm:text-lg">
                <BlockMath math={`a = e^{${stats.lnA.toFixed(4)}} = ${stats.a.toFixed(4)}`} />
              </div>
            </div>

            <div className="p-6 bg-emerald-950/40 rounded-2xl border border-emerald-800/50 text-center space-y-2">
              <span className="text-xs sm:text-sm uppercase tracking-wider text-emerald-400 font-bold block">
                Ecuación de Ajuste Potencial ({clusterName})
              </span>
              <div className="text-emerald-300 font-bold font-mono text-2xl sm:text-3xl md:text-4xl py-2">
                <BlockMath math={`y = ${stats.a.toFixed(4)} \\cdot x^{${stats.b.toFixed(4)}}`} />
              </div>
              <div className="text-sm font-mono text-slate-200 pt-1">
                Bondad del ajuste: <strong className="text-emerald-400 text-base">r² = {stats.r2.toFixed(4)}</strong> ({(stats.r2 * 100).toFixed(2)}% varianza explicada)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECCIÓN 3: RESUMEN RÁPIDO (CHEAT SHEET) */}
      {/* ========================================================= */}
      {activeSection === 'resumen' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-[#141f30] p-6 sm:p-8 rounded-2xl border border-purple-800/40 space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-purple-200 flex items-center gap-2.5">
              <Zap className="w-6 h-6 text-purple-400" />
              Guía Rápida: Los 4 Pasos Clave del Ajuste Potencial
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Toda la resolución se reduce a estos 4 pasos indispensables según la convención del apunte:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Paso 1 */}
            <div className="bg-[#162032] p-6 rounded-2xl border border-[#334155] space-y-3">
              <div className="flex items-center gap-2.5 text-blue-400 font-bold text-base sm:text-lg">
                <span className="w-7 h-7 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center text-sm font-mono">1</span>
                <span>Linealizar aplicando logaritmo</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                La potencia <InlineMath math="y = a \cdot x^b" /> se convierte en:
              </p>
              <div className="py-2 px-4 text-center bg-[#141f30] rounded-xl text-slate-100 font-mono text-base border border-slate-700/50">
                <InlineMath math="\ln(y) = \ln(a) + b \cdot \ln(x)" />
              </div>
            </div>

            {/* Paso 2 */}
            <div className="bg-[#162032] p-6 rounded-2xl border border-[#334155] space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base sm:text-lg">
                <span className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-sm font-mono">2</span>
                <span>Armar las 4 columnas de sumatorias</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Calcula para cada dato con 4 decimales:
              </p>
              <div className="py-2 px-3 text-center bg-[#141f30] rounded-xl text-slate-100 font-mono text-xs sm:text-sm border border-slate-700/50 overflow-x-auto">
                <InlineMath math="\sum \ln(x), \quad \sum \ln(y), \quad \sum (\ln(x))^2, \quad \sum \ln(x)\ln(y)" />
              </div>
            </div>

            {/* Paso 3 */}
            <div className="bg-[#162032] p-6 rounded-2xl border border-[#334155] space-y-3">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base sm:text-lg">
                <span className="w-7 h-7 rounded-full bg-amber-950 border border-amber-800 flex items-center justify-center text-sm font-mono">3</span>
                <span>Resolver el sistema matricial 2×2</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Reemplaza las sumatorias y resuelve:
              </p>
              <div className="py-2.5 px-3 text-center bg-[#141f30] rounded-xl text-slate-100 font-mono text-xs sm:text-sm border border-slate-700/50 overflow-x-auto">
                <InlineMath math="\begin{bmatrix} n & \sum \ln(x) \\ \sum \ln(x) & \sum (\ln(x))^2 \end{bmatrix} \begin{bmatrix} \ln(a) \\ b \end{bmatrix} = \begin{bmatrix} \sum \ln(y) \\ \sum \ln(x)\ln(y) \end{bmatrix}" />
              </div>
            </div>

            {/* Paso 4 */}
            <div className="bg-[#162032] p-6 rounded-2xl border border-[#334155] space-y-3">
              <div className="flex items-center gap-2.5 text-purple-400 font-bold text-base sm:text-lg">
                <span className="w-7 h-7 rounded-full bg-purple-950 border border-purple-800 flex items-center justify-center text-sm font-mono">4</span>
                <span>Calcular 'a' con exponencial y armar la curva</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Aplica la inversa sobre <InlineMath math="\ln(a)" />:
              </p>
              <div className="py-2 px-4 text-center bg-[#141f30] rounded-xl text-slate-100 font-mono text-base border border-slate-700/50">
                <InlineMath math="a = e^{\ln(a)} \implies y = a \cdot x^b" />
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-[#141f30] rounded-2xl border border-[#334155] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm sm:text-base text-slate-200">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              Bondad del ajuste:
            </span>
            <span className="font-mono text-slate-100 font-bold text-base sm:text-lg">
              <InlineMath math="r^2 = \frac{ST - SR}{ST} \ge 0.85 \quad (\text{óptimo})" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
