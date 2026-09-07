import React from 'react';
import { Calculator } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';

export const PracticeTab: React.FC = () => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 w-full">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="text-blue-600 w-8 h-8" />
        <h2 className="text-2xl font-bold text-slate-800">Práctica: Fundamento Matemático</h2>
      </div>
      
      <div className="text-slate-600 space-y-8 leading-relaxed">
        <p className="text-lg">
          Para ajustar nuestros datos al modelo potencial <span className="text-xl"><InlineMath math="y = a \cdot x^b" /></span> mediante el método de Mínimos Cuadrados, primero debemos transformar la curva en una línea recta. A esto se le llama <strong>linealización</strong>.
        </p>
        
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Linealización (Aplicando Logaritmos)
          </h3>
          <p>Aplicamos logaritmo natural (ln) a ambos lados de la ecuación original:</p>
          <div className="bg-slate-50 p-4 rounded-lg text-slate-800 border border-slate-200 shadow-sm text-xl">
            <BlockMath math="\ln(y) = \ln(a) + b \cdot \ln(x)" />
          </div>
          <p>Realizamos el cambio de variables para visualizar la ecuación de la recta (<InlineMath math="Y = A + B \cdot X" />):</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <div className="bg-slate-100 p-3 rounded text-center text-lg"><InlineMath math="Y = \ln(y)" /></div>
            <div className="bg-slate-100 p-3 rounded text-center text-lg"><InlineMath math="X = \ln(x)" /></div>
            <div className="bg-slate-100 p-3 rounded text-center text-lg"><InlineMath math="A = \ln(a)" /></div>
            <div className="bg-slate-100 p-3 rounded text-center text-lg"><InlineMath math="B = b" /></div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Sistema de Ecuaciones Normales
          </h3>
          <p>Con las variables linealizadas, el método de mínimos cuadrados nos exige calcular las siguientes sumatorias para <em>n</em> puntos de datos y resolver el sistema de 2x2:</p>
          
          <div className="bg-slate-50 p-6 rounded-lg text-slate-800 border border-slate-200 shadow-sm flex flex-col gap-4 text-xl">
            <BlockMath math="n A + B \sum X = \sum Y" />
            <BlockMath math="A \sum X + B \sum X^2 = \sum X Y" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
            Recuperación y Validación
          </h3>
          <p>Al resolver el sistema por cualquier método algebraico, obtenemos <strong>A</strong> y <strong>B</strong>. Para volver al modelo original, calculamos:</p>
          <div className="bg-slate-50 p-4 rounded-lg text-slate-800 border border-slate-200 text-xl shadow-sm">
            <BlockMath math="a = e^A" />
          </div>
          <p>Finalmente, evaluamos qué tan bueno es nuestro modelo usando el coeficiente de determinación (<strong>r²</strong>):</p>
          <div className="bg-slate-50 p-4 rounded-lg text-slate-800 border border-slate-200 text-xl shadow-sm">
            <BlockMath math="r^2 = \frac{S_t - S_r}{S_t}" />
          </div>
          <p className="text-sm bg-amber-50 text-amber-800 p-4 rounded-lg border border-amber-200">
            <strong>Nota:</strong> <InlineMath math="S_t" /> es la suma de cuadrados total respecto a la media de <InlineMath math="Y" /> original, y <InlineMath math="S_r" /> es la suma de los residuos al cuadrado (el error respecto a las predicciones de nuestra curva potencial).
          </p>
        </div>
      </div>
    </div>
  );
};
