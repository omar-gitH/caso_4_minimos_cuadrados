import React from 'react';
import { ListChecks } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { FormulaCollapse } from './FormulaCollapse';

export const ProcedureTab: React.FC = () => {
  return (
    <div className="bg-[#1e293b] p-4 sm:p-8 md:p-12 rounded-3xl shadow-lg border border-[#334155] w-full max-w-6xl xl:max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 sm:mb-8 text-center border-b border-[#334155] pb-8">
        <div className="p-3 sm:p-4 bg-blue-950/60 rounded-2xl border border-blue-800/40 flex-shrink-0 text-blue-300 shadow-xs">
          <ListChecks className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/40">
              Metodología Rigurosa
            </span>
            <span className="text-xs text-slate-400 font-mono">UTN FRP - Análisis Numérico</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
            Algoritmo y Nomenclatura Completa
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-1">
            Deducción matemática paso a paso del Método de Mínimos Cuadrados para el modelo potencial
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[#243147] p-4 sm:p-6 rounded-2xl border border-[#334155] text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed text-center font-normal">
          A continuación se detalla cada paso matemático para resolver el ajuste potencial{' '}
          <span className="font-semibold text-slate-100 px-2 py-0.5 bg-[#1a2436] rounded-md border border-[#334155]">
            <InlineMath math="y = a \cdot x^b" />
          </span>{' '}
          mediante su equivalente linealizado. Las fórmulas cuentan con espaciado vertical holgado y estricta sintaxis KaTeX.
        </div>

        {/* Step 1 */}
        <div className="p-4 sm:p-6 md:p-8 bg-[#243147] rounded-2xl border border-[#334155] w-full max-w-full min-w-0">
          <div className="flex items-start gap-4 w-full max-w-full min-w-0">
            <span className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-blue-900/60 text-blue-200 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg border border-blue-700/50 mt-0.5 shadow-xs">
              1
            </span>
            <div className="w-full min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-1 leading-snug">
                Paso 1: Definición de Variables y Conjunto Experimental
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-3">
                Se recopila una muestra discreta de <InlineMath math="n = 22" /> observaciones experimentales por clúster biológico (88 en total), compuestas por la masa corporal (<InlineMath math="x_i" /> en kg) y el metabolismo basal (<InlineMath math="y_i" /> en W):
              </p>

              <FormulaCollapse
                title="Conjunto Discreto de Datos Experimentales"
                subtitle="Pares ordenados que describen la muestra para cada clúster"
                badge="Definición Discreta"
              >
                <div className="w-full max-w-2xl mx-auto py-2">
                  <div className="bg-[#1a2436] p-5 sm:p-6 rounded-xl border border-[#334155] shadow-xs">
                    <span className="text-xs text-slate-400 font-mono block mb-2 uppercase tracking-wider">Matriz de Pares Ordenados</span>
                    <div className="text-slate-100 text-base sm:text-lg">
                      <BlockMath math="\{(x_1, y_1), \; (x_2, y_2), \; \dots, \; (x_n, y_n)\}" />
                    </div>
                    <p className="text-xs text-slate-400 mt-3 font-normal">
                      Donde cada par representa una especie biológica con masa <InlineMath math="x_i > 0" /> y tasa metabólica <InlineMath math="y_i > 0" />.
                    </p>
                  </div>
                </div>
              </FormulaCollapse>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-4 sm:p-6 md:p-8 bg-[#243147] rounded-2xl border border-[#334155] w-full max-w-full min-w-0">
          <div className="flex items-start gap-4 w-full max-w-full min-w-0">
            <span className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-blue-900/60 text-blue-200 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg border border-blue-700/50 mt-0.5 shadow-xs">
              2
            </span>
            <div className="w-full min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-1 leading-snug">
                Paso 2: Linealización mediante Logaritmo Natural
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-3">
                Para aplicar el método analítico de mínimos cuadrados lineales al modelo no lineal{' '}
                <span className="font-semibold text-slate-100 px-1.5 py-0.5 bg-[#1a2436] rounded border border-[#334155]"><InlineMath math="y = a \cdot x^b" /></span>, se aplica logaritmo natural en ambos miembros:
              </p>

              <FormulaCollapse
                title="Transformación Logarítmica y Cambio de Variables"
                subtitle="Equivalencia matemática entre el modelo potencial y la recta lineal"
                badge="Linealización"
                defaultOpen={true}
              >
                <div className="w-full max-w-3xl mx-auto flex flex-col gap-5 py-2">
                  <div className="bg-[#1a2436] p-5 sm:p-6 rounded-xl border border-[#334155] shadow-xs">
                    <span className="text-xs text-slate-400 font-mono block mb-2 uppercase tracking-wider">1. Aplicación de Propiedades de Logaritmos</span>
                    <div className="text-slate-100 py-1">
                      <BlockMath math="\ln(y) = \ln(a \cdot x^b) = \ln(a) + b \cdot \ln(x)" />
                    </div>
                  </div>

                  <div className="bg-[#1a2436] p-5 sm:p-6 rounded-xl border border-[#334155] shadow-xs">
                    <span className="text-xs text-slate-400 font-mono block mb-2 uppercase tracking-wider">2. Cambio Canónico de Variables para Ajuste Lineal</span>
                    <div className="text-slate-100 py-1">
                      <BlockMath math="X_i = \ln(x_i), \quad Y_i = \ln(y_i), \quad A = \ln(a), \quad B = b" />
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#334155] flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300 font-medium">
                      <span>Ecuación linealizada resultante:</span>
                      <span className="px-3 py-1 bg-blue-950/60 text-blue-300 rounded-md border border-blue-800/40 font-mono font-bold">
                        <InlineMath math="Y = A + B \cdot X" />
                      </span>
                    </div>
                  </div>
                </div>
              </FormulaCollapse>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-4 sm:p-6 md:p-8 bg-[#243147] rounded-2xl border border-[#334155] w-full max-w-full min-w-0">
          <div className="flex items-start gap-4 w-full max-w-full min-w-0">
            <span className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-blue-900/60 text-blue-200 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg border border-blue-700/50 mt-0.5 shadow-xs">
              3
            </span>
            <div className="w-full min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-1 leading-snug">
                Paso 3: Matriz de Ecuaciones Normales de Mínimos Cuadrados
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-3">
                Minimizando la suma de cuadrados de los residuos (<InlineMath math="\delta = \sum \varepsilon_i^2" />), se anulan las derivadas parciales respecto a los coeficientes:{' '}
                <InlineMath math="\frac{\partial \delta}{\partial A} = 0" /> y{' '}
                <InlineMath math="\frac{\partial \delta}{\partial B} = 0" /> (según el apunte oficial de la cátedra UTN FRP).
              </p>

              <FormulaCollapse
                title="Sistema Matricial de Ecuaciones Normales (2x2)"
                subtitle="Representación matricial y escalar con nomenclatura rigurosa"
                badge="Matriz 2x2"
                defaultOpen={true}
              >
                <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 py-2">

                  {/* Tarjeta 1: Representación Matricial con espaciado vertical entre filas */}
                  <div className="bg-[#1a2436] p-5 sm:p-7 rounded-xl border border-[#334155] shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs text-blue-300 font-bold uppercase tracking-wider bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-800/40">
                        Forma Matricial Compacta
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Espaciado de filas: \arraystretch</span>
                    </div>

                    <div className="py-3 overflow-x-auto text-slate-100">
                      <BlockMath
                        math={`\\begin{bmatrix} n & \\sum_{i=1}^{n} X_i \\\\[12pt] \\sum_{i=1}^{n} X_i & \\sum_{i=1}^{n} X_i^2 \\end{bmatrix} \\begin{bmatrix} A \\\\[12pt] b \\end{bmatrix} = \\begin{bmatrix} \\sum_{i=1}^{n} Y_i \\\\[12pt] \\sum_{i=1}^{n} (X_i \\cdot Y_i) \\end{bmatrix}`}
                      />
                    </div>

                    <p className="text-xs text-slate-400 mt-2 text-center">
                      Matriz simétrica definida positiva con determinante no nulo garantizado para datos no degenerados.
                    </p>
                  </div>

                  {/* Tarjeta 2: Sistema de Ecuaciones Escalares Desplegado */}
                  <div className="bg-[#1a2436] p-5 sm:p-7 rounded-xl border border-[#334155] shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs text-slate-300 font-bold uppercase tracking-wider bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                        Sistema Escalar Equivalente de 2 Ecuaciones
                      </span>
                    </div>

                    <div className="py-3 overflow-x-auto text-slate-100">
                      <BlockMath
                        math={`\\begin{cases} n \\cdot A + b \\sum_{i=1}^{n} X_i = \\sum_{i=1}^{n} Y_i \\\\[14pt] A \\sum_{i=1}^{n} X_i + b \\sum_{i=1}^{n} X_i^2 = \\sum_{i=1}^{n} (X_i \\cdot Y_i) \\end{cases}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#334155] text-xs text-slate-300">
                      <div className="p-2.5 bg-[#1e293b] rounded-lg border border-[#334155]">
                        <strong className="text-slate-100 block mb-1">Ecuación 1:</strong>
                        Derivada parcial respecto a <InlineMath math="A" /> igualada a 0.
                      </div>
                      <div className="p-2.5 bg-[#1e293b] rounded-lg border border-[#334155]">
                        <strong className="text-slate-100 block mb-1">Ecuación 2:</strong>
                        Derivada parcial respecto a <InlineMath math="b" /> igualada a 0.
                      </div>
                    </div>
                  </div>

                </div>
              </FormulaCollapse>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-4 sm:p-6 md:p-8 bg-[#243147] rounded-2xl border border-[#334155] w-full max-w-full min-w-0">
          <div className="flex items-start gap-4 w-full max-w-full min-w-0">
            <span className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-blue-900/60 text-blue-200 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg border border-blue-700/50 mt-0.5 shadow-xs">
              4
            </span>
            <div className="w-full min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-1 leading-snug">
                Paso 4: Solución Analítica de los Coeficientes (b y A)
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-3">
                Resolviendo el sistema lineal por la Regla de Cramer o eliminación gaussiana directa, se deducen las expresiones explícitas para la pendiente <InlineMath math="b" /> y la constante <InlineMath math="A" />:
              </p>

              <FormulaCollapse
                title="Fórmulas Directas de los Coeficientes"
                subtitle="Cálculo analítico explícito para la pendiente b y la ordenada al origen A"
                badge="Solución Analítica"
                defaultOpen={true}
              >
                <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 py-2">

                    {/* Tarjeta 1: Pendiente b */}
                  <div className="bg-[#1a2436] p-5 sm:p-7 rounded-xl border border-[#334155] shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-300 px-3 py-1 rounded-md border border-emerald-800/40">
                        1. Pendiente Alométrica (Exponente b)
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Regla de Cramer</span>
                    </div>

                    <div className="py-4 text-slate-100 overflow-x-auto text-center">
                      <BlockMath math="\displaystyle b = \dfrac{n \sum_{i=1}^{n} (X_i \cdot Y_i) - \left(\sum_{i=1}^{n} X_i\right)\left(\sum_{i=1}^{n} Y_i\right)}{n \sum_{i=1}^{n} X_i^2 - \left(\sum_{i=1}^{n} X_i\right)^2}" />
                    </div>

                    <div className="mt-3 p-3 bg-[#1e293b] rounded-lg text-xs text-slate-300 border border-[#334155]">
                      <strong className="text-slate-100">Propiedad alométrica clave:</strong> El parámetro <InlineMath math="b" /> en la recta linealizada es exactamente el exponente potencial de escala de la Ley de Kleiber.
                    </div>
                  </div>

                  {/* Tarjeta 2: Ordenada al origen A */}
                  <div className="bg-[#1a2436] p-5 sm:p-7 rounded-xl border border-[#334155] shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider bg-blue-950/60 text-blue-300 px-3 py-1 rounded-md border border-blue-800/40">
                        2. Ordenada al Origen (Constante A)
                      </span>
                      <span className="text-xs text-slate-400 font-mono">A = Ȳ - b·X̄</span>
                    </div>

                    <div className="py-4 text-slate-100 overflow-x-auto text-center">
                      <BlockMath math="\displaystyle A = \dfrac{\sum_{i=1}^{n} Y_i - b \sum_{i=1}^{n} X_i}{n} = \bar{Y} - b \cdot \bar{X}" />
                    </div>

                    <div className="mt-3 p-3 bg-[#1e293b] rounded-lg text-xs text-slate-300 border border-[#334155]">
                      <strong className="text-slate-100">Significado:</strong> <InlineMath math="A" /> es el intercepto lineal en escala logarítmica. La constante física original se obtiene luego como <InlineMath math="a = e^A" />.
                    </div>
                  </div>

                </div>
              </FormulaCollapse>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="p-4 sm:p-6 md:p-8 bg-[#243147] rounded-2xl border border-[#334155] w-full max-w-full min-w-0">
          <div className="flex items-start gap-4 w-full max-w-full min-w-0">
            <span className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-blue-900/60 text-blue-200 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg border border-blue-700/50 mt-0.5 shadow-xs">
              5
            </span>
            <div className="w-full min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-1 leading-snug">
                Paso 5: Anti-logaritmo y Modelo Potencial Final
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-3">
                Para retornar al espacio biológico original (vatios frente a kilogramos), se aplica la función exponencial inversa sobre la constante <InlineMath math="A" />:
              </p>

              <FormulaCollapse
                title="Recuperación del Parámetro Original y Ecuación Potencial"
                subtitle="Transformación inversa para obtener 'a' y armar la curva alométrica"
                badge="Anti-logaritmo"
              >
                <div className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row gap-5 py-2">
                  <div className="bg-[#1a2436] p-5 sm:p-6 rounded-xl border border-[#334155] shadow-xs flex-1 text-center">
                    <span className="text-xs text-slate-400 font-mono block mb-2 uppercase tracking-wider">Recuperación de 'a'</span>
                    <div className="text-slate-100 py-2">
                      <BlockMath math="\displaystyle a = e^A = \exp(A)" />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Coeficiente basal de escala</p>
                  </div>

                  <div className="bg-[#1a2436] p-5 sm:p-6 rounded-xl border border-[#334155] shadow-xs flex-1 text-center">
                    <span className="text-xs text-slate-400 font-mono block mb-2 uppercase tracking-wider">Modelo Potencial Final</span>
                    <div className="text-slate-100 py-2">
                      <BlockMath math="\displaystyle y(x) = a \cdot x^b" />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Curva ajustada por mínimos cuadrados</p>
                  </div>
                </div>
              </FormulaCollapse>
            </div>
          </div>
        </div>

        {/* Step 6 */}
        <div className="p-4 sm:p-6 md:p-8 bg-[#243147] rounded-2xl border border-[#334155] w-full max-w-full min-w-0">
          <div className="flex items-start gap-4 w-full max-w-full min-w-0">
            <span className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-blue-900/60 text-blue-200 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg border border-blue-700/50 mt-0.5 shadow-xs">
              6
            </span>
            <div className="w-full min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-1 leading-snug">
                Paso 6: Evaluación de la Bondad del Ajuste (r² y Residuos)
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-3">
                Siguiendo la pauta teórica de la cátedra de Análisis Numérico (UTN FRP), la bondad del ajuste se evalúa descomponiendo la variación total (<InlineMath math="ST" />) frente a la variación residual (<InlineMath math="SR" />):
              </p>

              <FormulaCollapse
                title="Fórmulas de Bondad de Ajuste (r²) y Varianza Residual"
                subtitle="Descomposición estricta en Suma Total de Cuadrados y Residuo Cuadrático"
                badge="Estadística r²"
                defaultOpen={true}
              >
                <div className="w-full max-w-3xl mx-auto flex flex-col gap-5 py-2">

                  {/* Coeficiente r2 */}
                  <div className="bg-[#1a2436] p-5 sm:p-7 rounded-xl border border-[#334155] shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-300 px-3 py-1 rounded-md border border-emerald-800/40">
                        Coeficiente de Determinación (r²)
                      </span>
                      <span className="text-xs text-slate-400 font-mono">0 ≤ r² ≤ 1</span>
                    </div>

                    <div className="py-3 text-slate-100 overflow-x-auto text-center">
                      <BlockMath math="\displaystyle r^2 = \dfrac{ST - SR}{ST} = 1 - \dfrac{SR}{ST}" />
                    </div>

                    <p className="text-xs text-slate-300 mt-1">
                      Representa la proporción de la variación en la tasa metabólica explicada por la masa corporal en el modelo potencial.
                    </p>
                  </div>

                  {/* ST y SR */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-[#1a2436] p-5 sm:p-6 rounded-xl border border-[#334155] shadow-xs">
                      <span className="text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-700 block w-fit mb-3">
                        Suma Total de Cuadrados (ST)
                      </span>
                      <div className="text-slate-100 py-2 overflow-x-auto text-center">
                        <BlockMath math="\displaystyle ST = \sum_{i=1}^{n} (Y_i - \bar{Y})^2" />
                      </div>
                      <div className="text-xs text-slate-400 mt-2 font-mono text-center">
                        con <InlineMath math="\displaystyle \bar{Y} = \dfrac{1}{n}\sum_{i=1}^{n} Y_i" />
                      </div>
                    </div>

                    <div className="bg-[#1a2436] p-5 sm:p-6 rounded-xl border border-[#334155] shadow-xs">
                      <span className="text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-700 block w-fit mb-3">
                        Suma de Residuos Cuadráticos (SR)
                      </span>
                      <div className="text-slate-100 py-2 overflow-x-auto text-center">
                        <BlockMath math="\displaystyle SR = \sum_{i=1}^{n} \left( Y_i - (A + b \cdot X_i) \right)^2" />
                      </div>
                      <div className="text-xs text-slate-400 mt-2 font-mono text-center">
                        con <InlineMath math="\varepsilon_i = Y_i - \hat{Y}_i" />
                      </div>
                    </div>
                  </div>

                </div>
              </FormulaCollapse>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
