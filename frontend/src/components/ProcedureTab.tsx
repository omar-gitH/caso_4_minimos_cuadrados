import React from 'react';
import { ListChecks } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { FormulaCollapse } from './FormulaCollapse';

export const ProcedureTab: React.FC = () => {
  return (
    <div className="glass-panel p-3.5 sm:p-6 md:p-10 rounded-3xl shadow-2xl border border-white/10 w-full max-w-6xl xl:max-w-7xl mx-auto space-y-6 sm:space-y-8 transform-gpu">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 text-center">
        <div className="p-3 sm:p-4 bg-purple-500/20 rounded-2xl border border-purple-500/30 flex-shrink-0">
          <ListChecks className="text-purple-400 w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Algoritmo y Nomenclatura Completa
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Metodología estricta de Mínimos Cuadrados (Cátedra de Análisis Numérico - UTN FRP)
          </p>
        </div>
      </div>

      <div className="text-slate-300 space-y-5 sm:space-y-6 font-light">
        <p className="text-xs sm:text-base md:text-lg pb-4 border-b border-white/10 text-center text-slate-300 leading-relaxed">
          A continuación se detalla cada paso matemático para resolver el ajuste potencial{' '}
          <InlineMath math="y = a \cdot x^b" /> mediante su equivalente linealizado. Haz clic en las fórmulas
          desplegables para examinar la notación completa en LaTeX.
        </p>

        {/* Step 1 */}
        <div className="p-3.5 sm:p-6 bg-black/40 rounded-2xl border border-white/5 shadow-lg backdrop-blur-md w-full max-w-full min-w-0">
          <div className="flex items-start gap-3 sm:gap-4 w-full max-w-full min-w-0">
            <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 text-purple-300 rounded-xl flex items-center justify-center font-bold text-sm sm:text-lg border border-purple-500/30 mt-0.5">
              1
            </span>
            <div className="w-full min-w-0 flex-1 overflow-hidden">
              <h3 className="text-base sm:text-xl font-bold text-slate-100 mb-1.5 leading-snug break-words">
                Paso 1: Definición de Variables y Datos Experimentales
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed break-words">
                Se recopila una muestra discreta de <InlineMath math="n" /> observaciones de masa corporal (
                <InlineMath math="x_i" /> en kg) y metabolismo basal (<InlineMath math="y_i" /> en W):
              </p>
              <FormulaCollapse
                title="Tabla de Datos Experimentales"
                subtitle="Matriz de datos originales del fenómeno alométrico"
                badge="Definición Discreta"
              >
                <BlockMath math="\{(x_1, y_1), (x_2, y_2), \dots, (x_n, y_n)\}" />
              </FormulaCollapse>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-3.5 sm:p-6 bg-black/40 rounded-2xl border border-white/5 shadow-lg backdrop-blur-md w-full max-w-full min-w-0">
          <div className="flex items-start gap-3 sm:gap-4 w-full max-w-full min-w-0">
            <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 text-purple-300 rounded-xl flex items-center justify-center font-bold text-sm sm:text-lg border border-purple-500/30 mt-0.5">
              2
            </span>
            <div className="w-full min-w-0 flex-1 overflow-hidden">
              <h3 className="text-base sm:text-xl font-bold text-slate-100 mb-1.5 leading-snug break-words">
                Paso 2: Linealización mediante Logaritmo Natural
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed break-words">
                Para aplicar el principio de mínimos cuadrados lineales a un modelo potencial{' '}
                <InlineMath math="y = a \cdot x^b" />, aplicamos logaritmos en ambos miembros para reducir la
                expresión a una recta <InlineMath math="Y = A + B \cdot X" />:
              </p>
              <FormulaCollapse
                title="Transformación Logarítmica"
                subtitle="Equivalencia entre modelo exponencial/potencial y el modelo lineal"
                badge="Linealización"
                defaultOpen={true}
              >
                <div className="flex flex-col gap-3 text-purple-300 w-full items-center">
                  <BlockMath math="\ln(y) = \ln(a \cdot x^b) = \ln(a) + b \cdot \ln(x)" />
                  <div className="w-full h-px bg-white/10 my-1"></div>
                  <p className="text-xs text-slate-400 font-sans text-center">Sustitución de variables para analogía lineal:</p>
                  <BlockMath math="X_i = \ln(x_i), \quad Y_i = \ln(y_i), \quad A = \ln(a), \quad B = b" />
                </div>
              </FormulaCollapse>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-3.5 sm:p-6 bg-black/40 rounded-2xl border border-white/5 shadow-lg backdrop-blur-md w-full max-w-full min-w-0">
          <div className="flex items-start gap-3 sm:gap-4 w-full max-w-full min-w-0">
            <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 text-purple-300 rounded-xl flex items-center justify-center font-bold text-sm sm:text-lg border border-purple-500/30 mt-0.5">
              3
            </span>
            <div className="w-full min-w-0 flex-1 overflow-hidden">
              <h3 className="text-base sm:text-xl font-bold text-slate-100 mb-1.5 leading-snug break-words">
                Paso 3: Matriz de Ecuaciones Normales de Mínimos Cuadrados
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed break-words">
                Maximizando la precisión resolviendo las derivadas parciales{' '}
                <InlineMath math="\frac{\partial \delta}{\partial A} = 0" /> y{' '}
                <InlineMath math="\frac{\partial \delta}{\partial B} = 0" /> (según el apunte de la cátedra), se
                obtiene el sistema matricial de ecuaciones normales:
              </p>
              <FormulaCollapse
                title="Sistema Matricial de Ecuaciones Normales"
                subtitle="Representación matricial exacta para hallar A y B"
                badge="Matriz 2x2"
                defaultOpen={true}
              >
                <div className="flex flex-col gap-3 items-center text-cyan-300 w-full max-w-full py-1">
                  <BlockMath
                    math={`\\begin{bmatrix} n & \\sum_{i=1}^{n} X_i \\\\ \\sum_{i=1}^{n} X_i & \\sum_{i=1}^{n} X_i^2 \\end{bmatrix} \\begin{bmatrix} A \\\\ b \\end{bmatrix} = \\begin{bmatrix} \\sum_{i=1}^{n} Y_i \\\\ \\sum_{i=1}^{n} (X_i \\cdot Y_i) \\end{bmatrix}`}
                  />
                </div>
              </FormulaCollapse>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-3.5 sm:p-6 bg-black/40 rounded-2xl border border-white/5 shadow-lg backdrop-blur-md w-full max-w-full min-w-0">
          <div className="flex items-start gap-3 sm:gap-4 w-full max-w-full min-w-0">
            <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 text-purple-300 rounded-xl flex items-center justify-center font-bold text-sm sm:text-lg border border-purple-500/30 mt-0.5">
              4
            </span>
            <div className="w-full min-w-0 flex-1 overflow-hidden">
              <h3 className="text-base sm:text-xl font-bold text-slate-100 mb-1.5 leading-snug break-words">
                Paso 4: Solución Analítica de los Coeficientes
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed break-words">
                Resolviendo el sistema lineal (por Regla de Cramer o eliminación directa), obtenemos los valores
                analíticos de la pendiente <InlineMath math="b" /> y la ordenada <InlineMath math="A" />:
              </p>
              <FormulaCollapse
                title="Fórmulas Directas de Coeficientes"
                subtitle="Cálculo explícito de la pendiente b y la constante A"
                badge="Solución Directa"
                defaultOpen={true}
              >
                <div className="flex flex-col gap-4 sm:gap-6 items-center text-emerald-300 w-full max-w-full py-1">
                  <BlockMath math="b = \frac{n \sum_{i=1}^{n} (X_i \cdot Y_i) - \left(\sum_{i=1}^{n} X_i\right)\left(\sum_{i=1}^{n} Y_i\right)}{n \sum_{i=1}^{n} X_i^2 - \left(\sum_{i=1}^{n} X_i\right)^2}" />
                  <BlockMath math="A = \frac{\sum_{i=1}^{n} Y_i - b \sum_{i=1}^{n} X_i}{n}" />
                </div>
              </FormulaCollapse>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="p-3.5 sm:p-6 bg-black/40 rounded-2xl border border-white/5 shadow-lg backdrop-blur-md w-full max-w-full min-w-0">
          <div className="flex items-start gap-3 sm:gap-4 w-full max-w-full min-w-0">
            <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 text-purple-300 rounded-xl flex items-center justify-center font-bold text-sm sm:text-lg border border-purple-500/30 mt-0.5">
              5
            </span>
            <div className="w-full min-w-0 flex-1 overflow-hidden">
              <h3 className="text-base sm:text-xl font-bold text-slate-100 mb-1.5 leading-snug break-words">
                Paso 5: Anti-logaritmo y Ecuación Potencial Final
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed break-words">
                Para retornar al modelo original no lineal, aplicamos la función exponencial sobre el parámetro{' '}
                <InlineMath math="A" />:
              </p>
              <FormulaCollapse
                title="Recuperación de Parámetro Original"
                subtitle="Transformación inversa para obtener 'a' y armar la curva"
                badge="Anti-logaritmo"
              >
                <div className="flex flex-col gap-2.5 items-center text-purple-300 w-full max-w-full">
                  <BlockMath math="a = e^A" />
                  <BlockMath math="y = a \cdot x^b" />
                </div>
              </FormulaCollapse>
            </div>
          </div>
        </div>

        {/* Step 6 */}
        <div className="p-3.5 sm:p-6 bg-black/40 rounded-2xl border border-white/5 shadow-lg backdrop-blur-md w-full max-w-full min-w-0">
          <div className="flex items-start gap-3 sm:gap-4 w-full max-w-full min-w-0">
            <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 text-purple-300 rounded-xl flex items-center justify-center font-bold text-sm sm:text-lg border border-purple-500/30 mt-0.5">
              6
            </span>
            <div className="w-full min-w-0 flex-1 overflow-hidden">
              <h3 className="text-base sm:text-xl font-bold text-slate-100 mb-1.5 leading-snug break-words">
                Paso 6: Evaluación de la Bondad del Ajuste (r²)
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed break-words">
                Según la teoría del apunte (Cátedras de Análisis Numérico - UTN FRP), la bondad del ajuste se determina
                evaluando la variación total (<InlineMath math="ST" />) frente a la variación de los residuos (
                <InlineMath math="SR" />):
              </p>
              <FormulaCollapse
                title="Fórmulas de Bondad de Ajuste (r²)"
                subtitle="Descomposición en Suma Total de Cuadrados (ST) y Residuo (SR)"
                badge="Estadística r²"
                defaultOpen={true}
              >
                <div className="flex flex-col gap-3 sm:gap-4 items-center text-emerald-300 w-full max-w-full">
                  <BlockMath math="r^2 = \frac{ST - SR}{ST} = 1 - \frac{SR}{ST}" />
                  <div className="w-full h-px bg-white/10 my-1"></div>
                  <div className="text-xs text-slate-400 font-sans text-center">En el espacio transformado linealmente:</div>
                  <BlockMath math="ST = \sum_{i=1}^{n} (Y_i - \bar{Y})^2, \quad \text{con } \bar{Y} = \frac{\sum_{i=1}^{n} Y_i}{n}" />
                  <BlockMath math="SR = \sum_{i=1}^{n} \left( Y_i - (A + b \cdot X_i) \right)^2" />
                </div>
              </FormulaCollapse>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
