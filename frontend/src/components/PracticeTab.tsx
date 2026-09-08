import React from 'react';
import { Calculator } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import { FormulaCollapse } from './FormulaCollapse';

export const PracticeTab: React.FC = () => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-lg p-6 md:p-12 rounded-3xl shadow-2xl border border-white/10 w-full max-w-6xl xl:max-w-7xl mx-auto">
      <div className="flex items-center justify-center gap-4 mb-10 text-center">
        <div className="p-4 bg-cyan-500/20 rounded-2xl border border-cyan-500/30">
          <Calculator className="text-cyan-400 w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Práctica: Fundamento Matemático Completo</h2>
          <p className="text-slate-400 text-sm mt-1">Transformaciones y Método de Mínimos Cuadrados (UTN FRP)</p>
        </div>
      </div>
      
      <div className="text-slate-300 space-y-8 font-light">
        <p className="text-lg text-center max-w-3xl mx-auto bg-white/5 p-6 rounded-2xl border border-white/5">
          Para ajustar nuestros datos al modelo potencial <span className="text-emerald-400 font-bold mx-2"><InlineMath math="y = a \cdot x^b" /></span> mediante el método de Mínimos Cuadrados, primero debemos transformar la curva en una línea recta mediante <strong>linealización</strong>.
        </p>
        
        <div className="space-y-6">
          {/* Seccion 1 */}
          <div className="bg-black/40 p-6 rounded-2xl border border-white/10 shadow-inner backdrop-blur-md">
            <h3 className="text-2xl font-bold text-cyan-300 mb-3">1. Linealización (Propiedades Logarítmicas)</h3>
            <p className="text-slate-400 text-base mb-4">
              Aplicamos logaritmo natural (<InlineMath math="\ln" />) a ambos miembros de la función empírica potencial <InlineMath math="y = a \cdot x^b" /> para convertirla en una recta lineal de la forma <InlineMath math="Y = A + B \cdot X" />:
            </p>
            
            <FormulaCollapse
              title="Demostración de Linealización"
              subtitle="Despeje paso a paso mediante propiedades de logaritmos"
              badge="Transformación"
              defaultOpen={true}
            >
              <div className="flex flex-col gap-4 text-cyan-300 w-full items-center">
                <BlockMath math="\ln(y) = \ln(a \cdot x^b)" />
                <BlockMath math="\ln(y) = \ln(a) + \ln(x^b)" />
                <BlockMath math="\ln(y) = \ln(a) + b \cdot \ln(x)" />
                <div className="w-full h-px bg-white/10 my-2"></div>
                <p className="text-xs text-slate-400 font-sans text-center">Cambio de variables:</p>
                <BlockMath math="Y = \ln(y), \quad X = \ln(x), \quad A = \ln(a), \quad B = b" />
              </div>
            </FormulaCollapse>
          </div>

          {/* Seccion 2 */}
          <div className="bg-black/40 p-6 rounded-2xl border border-white/10 shadow-inner backdrop-blur-md">
            <h3 className="text-2xl font-bold text-emerald-400 mb-3">2. Ecuaciones Normales en Forma Matricial</h3>
            <p className="text-slate-400 text-base mb-4">
              Aplicando el criterio de minimizar el sumatorio del error al cuadrado (<InlineMath math="\delta = \sum \varepsilon_i^2" />), derivamos respecto a los parámetros <InlineMath math="A" /> y <InlineMath math="B" /> e igualamos a cero, dando lugar al sistema lineal matricial:
            </p>

            <FormulaCollapse
              title="Formulación Matricial de Mínimos Cuadrados"
              subtitle="Sistema de ecuaciones normales 2x2 para las incógnitas A y B"
              badge="Sistema Matricial"
              defaultOpen={true}
            >
              <div className="flex flex-col gap-4 items-center text-emerald-300 w-full">
                <BlockMath math={`\\begin{bmatrix} n & \\sum_{i=1}^{n} X_i \\\\ \\sum_{i=1}^{n} X_i & \\sum_{i=1}^{n} X_i^2 \\end{bmatrix} \\begin{bmatrix} A \\\\ B \\end{bmatrix} = \\begin{bmatrix} \\sum_{i=1}^{n} Y_i \\\\ \\sum_{i=1}^{n} (X_i \\cdot Y_i) \\end{bmatrix}`} />
                <div className="w-full h-px bg-white/10 my-2"></div>
                <p className="text-xs text-slate-400 font-sans text-center">Equivalente a las dos ecuaciones escalares:</p>
                <BlockMath math="n \cdot A + B \sum_{i=1}^{n} X_i = \sum_{i=1}^{n} Y_i" />
                <BlockMath math="A \sum_{i=1}^{n} X_i + B \sum_{i=1}^{n} X_i^2 = \sum_{i=1}^{n} (X_i \cdot Y_i)" />
              </div>
            </FormulaCollapse>
          </div>

          {/* Seccion 3 */}
          <div className="bg-black/40 p-6 rounded-2xl border border-white/10 shadow-inner backdrop-blur-md">
            <h3 className="text-2xl font-bold text-indigo-400 mb-3">3. Anti-logaritmo y Evaluación de la Bondad del Ajuste</h3>
            <p className="text-slate-400 text-base mb-4">
              Una vez resuelto el sistema matricial para <InlineMath math="A" /> y <InlineMath math="B" />, recuperamos el valor del coeficiente original <InlineMath math="a" /> y medimos la efectividad del ajuste con <InlineMath math="r^2" />:
            </p>

            <FormulaCollapse
              title="Recuperación de Parámetros y Varianza Total (r²)"
              subtitle="Fórmulas exactas para a y r² según la teoría de Mínimos Cuadrados"
              badge="Resultados"
              defaultOpen={true}
            >
              <div className="flex flex-col gap-4 items-center text-indigo-300 w-full">
                <BlockMath math="a = e^A, \quad b = B" />
                <BlockMath math="y(x) = a \cdot x^b" />
                <div className="w-full h-px bg-white/10 my-2"></div>
                <BlockMath math="r^2 = \frac{ST - SR}{ST} = 1 - \frac{SR}{ST}" />
                <BlockMath math="ST = \sum_{i=1}^{n} (Y_i - \bar{Y})^2, \quad SR = \sum_{i=1}^{n} (Y_i - (A + B \cdot X_i))^2" />
              </div>
            </FormulaCollapse>
          </div>
        </div>
      </div>
    </div>
  );
};
