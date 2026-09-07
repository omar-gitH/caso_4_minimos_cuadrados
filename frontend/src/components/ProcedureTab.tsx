import React from 'react';
import { ListChecks } from 'lucide-react';
import { InlineMath } from 'react-katex';

export const ProcedureTab: React.FC = () => {
  const steps = [
    {
      title: "Paso 1: Extracción de Datos",
      desc: <p>Se reciben las listas de masa corporal (<InlineMath math="x" />) y metabolismo (<InlineMath math="y" />) para un clúster biológico específico (ej. Mamíferos).</p>
    },
    {
      title: "Paso 2: Transformación a Espacio Logarítmico",
      desc: <p>Se aplica la función logaritmo natural iterando sobre cada par (<InlineMath math="x, y" />) para obtener las nuevas variables transformadas <InlineMath math="X = \ln(x)" /> e <InlineMath math="Y = \ln(y)" />.</p>
    },
    {
      title: "Paso 3: Cálculo de Sumatorias Acumulativas",
      desc: <p>Mediante un bucle, se acumulan los valores de <InlineMath math="\Sigma X" />, <InlineMath math="\Sigma Y" />, <InlineMath math="\Sigma X^2" /> y <InlineMath math="\Sigma(X \cdot Y)" />. También se obtiene <InlineMath math="n" /> midiendo la longitud de las listas.</p>
    },
    {
      title: "Paso 4: Resolución del Sistema Lineal",
      desc: <p>Usando álgebra (regla de Cramer o despeje directo), se calcula el determinante del sistema y se hallan las incógnitas <InlineMath math="A" /> (ordenada al origen de la recta) y <InlineMath math="B" /> (pendiente).</p>
    },
    {
      title: "Paso 5: Anti-logaritmo y Formación del Modelo",
      desc: <p>Se aplica la función exponencial a <InlineMath math="A" /> (<InlineMath math="a = e^A" />). En este punto se construye la ecuación final <InlineMath math="y = a \cdot x^b" /> para poder graficar.</p>
    },
    {
      title: "Paso 6: Cuantificación del Error (r²)",
      desc: <p>Para cada valor original <InlineMath math="x" />, se calcula el <InlineMath math="y_{\text{teorico}}" /> usando la nueva ecuación. Se suman los errores cuadráticos (residuos) y se comparan contra la varianza de los datos reales para obtener el <InlineMath math="r^2" />.</p>
    }
  ];

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 w-full">
      <div className="flex items-center gap-3 mb-6">
        <ListChecks className="text-purple-600 w-8 h-8" />
        <h2 className="text-2xl font-bold text-slate-800">Algoritmo: El Paso a Paso Real</h2>
      </div>
      
      <div className="text-slate-600 space-y-6 leading-relaxed">
        <p className="text-lg pb-4 border-b border-slate-100">
          A nivel de programación, nuestro backend (escrito en Python con FastAPI) ejecuta exactamente los siguientes pasos por cada grupo de animales, <strong>sin utilizar herramientas matemáticas de caja negra</strong>:
        </p>
        
        <div className="space-y-4 pt-2">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-purple-300 hover:shadow-md transition-all">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border border-purple-200">
                {index + 1}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">{step.title}</h4>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
