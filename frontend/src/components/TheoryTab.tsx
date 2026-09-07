import React from 'react';
import { BookOpen } from 'lucide-react';
import { BlockMath } from 'react-katex';

export const TheoryTab: React.FC = () => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 w-full">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="text-emerald-600 w-8 h-8" />
        <h2 className="text-2xl font-bold text-slate-800">Teoría: El Modelo Alométrico</h2>
      </div>
      
      <div className="prose max-w-none text-slate-600 space-y-6 leading-relaxed">
        <p>
          En el campo de la biología y ecología, rara vez las relaciones entre variables físicas son lineales. 
          Un caso clásico es la relación entre la <strong>Masa Corporal (X)</strong> de un animal y su <strong>Tasa Metabólica Basal (Y)</strong> (la cantidad de energía que consume en reposo).
        </p>
        
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm">
          <h3 className="font-bold text-emerald-900 mb-2">¿Por qué un modelo potencial?</h3>
          <p className="text-emerald-800 text-sm md:text-base">
            A medida que los animales crecen en tamaño, no consumen energía de forma directamente proporcional a su masa. 
            Si así fuera, un animal masivo se sobrecalentaría debido a la enorme cantidad de células generando calor en proporción a su área superficial. 
            La naturaleza resuelve esto haciendo que el metabolismo crezca más lento que la masa, lo que se modela perfectamente con una curva de potencia.
          </p>
        </div>

        <p>
          Matemáticamente, esta relación se expresa mediante el modelo de regresión potencial:
        </p>
        
        <div className="bg-slate-50 p-6 rounded-lg text-slate-800 text-xl border border-slate-200 shadow-inner">
          <BlockMath math="y = a \cdot x^b" />
        </div>

        <ul className="list-disc pl-6 space-y-2 mt-4 bg-slate-50 p-6 rounded-lg border border-slate-100">
          <li><strong className="text-slate-800">y</strong>: Tasa metabólica basal estimada (W).</li>
          <li><strong className="text-slate-800">x</strong>: Masa corporal (kg).</li>
          <li><strong className="text-slate-800">a</strong>: Coeficiente de proporcionalidad (específico de cada grupo animal).</li>
          <li><strong className="text-slate-800">b</strong>: Exponente alométrico (suele rondar valores entre 0.66 y 0.75 según la Ley de Kleiber).</li>
        </ul>
      </div>
    </div>
  );
};
