import React from 'react';
import { Calculator } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import { FormulaCollapse } from './FormulaCollapse';

export const PracticeTab: React.FC = () => {
  return (
    <div className="bg-[#1e293b] p-4 sm:p-8 md:p-12 rounded-3xl shadow-lg border border-[#334155] w-full max-w-6xl xl:max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 text-center border-b border-[#334155] pb-8">
        <div className="p-3 sm:p-4 bg-emerald-950/60 rounded-2xl border border-emerald-800/40 text-emerald-300 shadow-xs flex-shrink-0">
          <Calculator className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
              Cálculo Analítico
            </span>
            <span className="text-xs text-slate-400 font-mono">UTN FRP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
            Práctica: Fundamento Matemático Completo
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-1">
            Transformaciones y Método de Mínimos Cuadrados para Leyes de Escala
          </p>
        </div>
      </div>
      
      <div className="space-y-6 text-slate-200 font-normal">
        <div className="text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto bg-[#243147] p-5 sm:p-6 rounded-2xl border border-[#334155] leading-relaxed">
          Para ajustar los datos empíricos al modelo potencial{' '}
          <span className="font-semibold text-slate-100 px-2 py-0.5 bg-[#1a2436] rounded-md border border-[#334155]">
            <InlineMath math="y = a \cdot x^b" />
          </span>{' '}
          mediante mínimos cuadrados lineales, primero transformamos la curva en una línea recta mediante <strong>linealización logarítmica</strong>.
        </div>
        
        <div className="space-y-6">
          {/* Seccion 1 */}
          <div className="bg-[#243147] p-4 sm:p-6 md:p-8 rounded-2xl border border-[#334155] shadow-xs">
            <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-2">
              1. Linealización (Propiedades Logarítmicas)
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
              Aplicamos logaritmo natural (<InlineMath math="\ln" />) a ambos miembros de la función empírica potencial <InlineMath math="y = a \cdot x^b" /> para reducirla a una recta <InlineMath math="Y = A + B \cdot X" />:
            </p>
            
            <FormulaCollapse
              title="Demostración Paso a Paso de la Linealización"
              subtitle="Despeje algebraico riguroso mediante propiedades operativas de logaritmos"
              badge="Linealización"
              defaultOpen={true}
            >
              <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 py-2">
                <div className="bg-[#1a2436] p-4 sm:p-5 rounded-xl border border-[#334155] text-slate-100 shadow-xs">
                  <span className="text-xs text-slate-400 font-mono block mb-1 uppercase">Paso 1: Aplicación de logaritmos</span>
                  <BlockMath math="\ln(y) = \ln(a \cdot x^b)" />
                </div>
                
                <div className="bg-[#1a2436] p-4 sm:p-5 rounded-xl border border-[#334155] text-slate-100 shadow-xs">
                  <span className="text-xs text-slate-400 font-mono block mb-1 uppercase">Paso 2: Separación de producto</span>
                  <BlockMath math="\ln(y) = \ln(a) + \ln(x^b)" />
                </div>

                <div className="bg-[#1a2436] p-4 sm:p-5 rounded-xl border border-[#334155] text-slate-100 shadow-xs">
                  <span className="text-xs text-slate-400 font-mono block mb-1 uppercase">Paso 3: Bajada del exponente</span>
                  <BlockMath math="\ln(y) = \ln(a) + b \cdot \ln(x)" />
                </div>

                <div className="bg-[#1a2436] p-4 sm:p-5 rounded-xl border border-[#334155] text-slate-100 shadow-xs">
                  <span className="text-xs text-slate-400 font-mono block mb-1 uppercase">Paso 4: Sustitución de variables canónicas</span>
                  <BlockMath math="X = \ln(x), \quad Y = \ln(y), \quad A = \ln(a), \quad B = b" />
                  <p className="text-xs text-slate-400 mt-2 text-center">
                    Resultado: <span className="font-mono font-bold text-slate-100"><InlineMath math="Y = A + B \cdot X" /></span>
                  </p>
                </div>
              </div>
            </FormulaCollapse>
          </div>

          {/* Seccion 2 */}
          <div className="bg-[#243147] p-4 sm:p-6 md:p-8 rounded-2xl border border-[#334155] shadow-xs">
            <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-2">
              2. Ecuaciones Normales en Forma Matricial
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
              Minimizando la suma de residuos al cuadrado (<InlineMath math="\delta = \sum \varepsilon_i^2" />), derivamos respecto a los parámetros <InlineMath math="A" /> y <InlineMath math="B" /> e igualamos a cero, generando el sistema matricial 2x2:
            </p>

            <FormulaCollapse
              title="Formulación Matricial y Escalar de Mínimos Cuadrados"
              subtitle="Sistema de ecuaciones normales 2x2 para las incógnitas A y B"
              badge="Sistema Matricial"
              defaultOpen={true}
            >
              <div className="w-full max-w-3xl mx-auto flex flex-col gap-5 py-2">
                <div className="bg-[#1a2436] p-5 sm:p-7 rounded-xl border border-[#334155] text-slate-100 shadow-xs">
                  <span className="text-xs text-slate-400 font-mono block mb-2 uppercase tracking-wider">Matriz Normal (con espaciado de filas)</span>
                  <div className="py-2 overflow-x-auto">
                    <BlockMath math={`\\begin{bmatrix} n & \\sum_{i=1}^{n} X_i \\\\[12pt] \\sum_{i=1}^{n} X_i & \\sum_{i=1}^{n} X_i^2 \\end{bmatrix} \\begin{bmatrix} A \\\\[12pt] B \\end{bmatrix} = \\begin{bmatrix} \\sum_{i=1}^{n} Y_i \\\\[12pt] \\sum_{i=1}^{n} (X_i \\cdot Y_i) \\end{bmatrix}`} />
                  </div>
                </div>

                <div className="bg-[#1a2436] p-5 sm:p-6 rounded-xl border border-[#334155] text-slate-100 shadow-xs">
                  <span className="text-xs text-slate-400 font-mono block mb-2 uppercase tracking-wider">Equivalente a las dos ecuaciones escalares</span>
                  <div className="py-2 overflow-x-auto">
                    <BlockMath math={`\\begin{cases} n \\cdot A + B \\sum_{i=1}^{n} X_i = \\sum_{i=1}^{n} Y_i \\\\[12pt] A \\sum_{i=1}^{n} X_i + B \\sum_{i=1}^{n} X_i^2 = \\sum_{i=1}^{n} (X_i \\cdot Y_i) \\end{cases}`} />
                  </div>
                </div>
              </div>
            </FormulaCollapse>
          </div>

          {/* Seccion 3 */}
          <div className="bg-[#243147] p-4 sm:p-6 md:p-8 rounded-2xl border border-[#334155] shadow-xs">
            <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-2">
              3. Anti-logaritmo y Evaluación de la Bondad del Ajuste
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
              Una vez resuelto el sistema matricial para <InlineMath math="A" /> y <InlineMath math="B" />, recuperamos el valor del parámetro original <InlineMath math="a" /> y cuantificamos la calidad del ajuste mediante <InlineMath math="r^2" />:
            </p>

            <FormulaCollapse
              title="Recuperación de Parámetros y Varianza Explicada (r²)"
              subtitle="Fórmulas explícitas para a y r² según la teoría de Mínimos Cuadrados"
              badge="Resultados"
              defaultOpen={true}
            >
              <div className="w-full max-w-3xl mx-auto flex flex-col gap-5 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#1a2436] p-5 rounded-xl border border-[#334155] text-center shadow-xs">
                    <span className="text-xs text-slate-400 font-mono block mb-1 uppercase">Parámetros originales</span>
                    <div className="py-2 text-slate-100">
                      <BlockMath math="a = e^A, \quad b = B" />
                    </div>
                  </div>
                  <div className="bg-[#1a2436] p-5 rounded-xl border border-[#334155] text-center shadow-xs">
                    <span className="text-xs text-slate-400 font-mono block mb-1 uppercase">Curva Potencial</span>
                    <div className="py-2 text-slate-100">
                      <BlockMath math="y(x) = a \cdot x^b" />
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a2436] p-5 sm:p-6 rounded-xl border border-[#334155] text-slate-100 shadow-xs">
                  <span className="text-xs text-slate-400 font-mono block mb-2 uppercase tracking-wider">Coeficiente de Determinación (r²)</span>
                  <div className="py-2 overflow-x-auto">
                    <BlockMath math="r^2 = \frac{ST - SR}{ST} = 1 - \frac{SR}{ST}" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#334155] text-xs">
                    <div className="p-2 bg-[#1e293b] rounded-lg text-slate-300 border border-[#334155]">
                      <BlockMath math="ST = \sum_{i=1}^{n} (Y_i - \bar{Y})^2" />
                    </div>
                    <div className="p-2 bg-[#1e293b] rounded-lg text-slate-300 border border-[#334155]">
                      <BlockMath math="SR = \sum_{i=1}^{n} (Y_i - (A + B \cdot X_i))^2" />
                    </div>
                  </div>
                </div>
              </div>
            </FormulaCollapse>
          </div>
        </div>
      </div>
    </div>
  );
};
