import React from 'react';
import { BookOpen, Target, CheckCircle2, Flame, Layers } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import { SpeciesDataTable } from './SpeciesDataTable';

export const TheoryTab: React.FC = () => {
  return (
    <div className="bg-[#1e293b] p-4 sm:p-8 md:p-12 rounded-3xl shadow-lg border border-[#334155] w-full max-w-6xl xl:max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#334155] pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 sm:p-4 bg-blue-950/60 text-blue-300 rounded-2xl border border-blue-800/40 shadow-xs">
            <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-3 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/40">
                Trabajo Práctico Oficial
              </span>
              <span className="text-xs text-slate-400 font-mono">UTN FRP - Análisis Numérico</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight mt-1">
              Caso 4 · Masa Corporal y Metabolismo Animal
            </h2>
          </div>
        </div>
      </div>

      {/* Situación Problemática */}
      <div className="bg-[#1a2638] p-6 md:p-8 rounded-2xl border-l-4 border-blue-500 border border-[#334155] shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-blue-950/80 rounded-xl text-blue-300 border border-blue-800/50 flex-shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div className="space-y-2.5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-100">Situación Problemática Oficial</h3>
            <p className="text-slate-200 text-base md:text-lg leading-relaxed font-normal">
              "Un equipo de comunicación científica desea estudiar cómo cambia la tasa metabólica basal estimada cuando aumenta la masa corporal. Se comparan <strong className="text-amber-300 font-bold">mamíferos</strong>, <strong className="text-blue-300 font-bold">aves</strong>, <strong className="text-emerald-300 font-bold">reptiles</strong> y <strong className="text-indigo-300 font-bold">peces</strong>. El objetivo es construir y evaluar un modelo para cada clúster, interpretar sus parámetros y explicar por qué animales de distinto tamaño y grupo biológico <strong>no consumen energía en forma directamente proporcional a su masa</strong>."
            </p>
          </div>
        </div>
      </div>

      {/* Variables y Clústeres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#243147] p-6 rounded-2xl border border-[#334155] space-y-4 shadow-xs">
          <h4 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Definición de Variables
          </h4>
          <div className="space-y-3 text-sm sm:text-base">
            <div className="p-3.5 bg-[#1a2436] rounded-xl border border-[#334155] shadow-xs">
              <strong className="text-blue-300 block mb-1 font-semibold">Variable Independiente (X):</strong>
              <span className="text-slate-300">Masa corporal del espécimen, medida en kilogramos (<InlineMath math="\text{kg}" />).</span>
            </div>
            <div className="p-3.5 bg-[#1a2436] rounded-xl border border-[#334155] shadow-xs">
              <strong className="text-indigo-300 block mb-1 font-semibold">Variable Dependiente (Y):</strong>
              <span className="text-slate-300">Tasa metabólica basal estimada en reposo, medida en vatios (<InlineMath math="\text{W}" />).</span>
            </div>
          </div>
        </div>

        <div className="bg-[#243147] p-6 rounded-2xl border border-[#334155] space-y-4 shadow-xs">
          <h4 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Consignas Mínimas del Caso
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
            <li className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-200 border border-blue-700/40 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              Graficar cada clúster por separado (22 especies por grupo, 88 en total).
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-200 border border-blue-700/40 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              Elegir y justificar el modelo adecuado según la teoría y apunte.
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-200 border border-blue-700/40 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              Ajustar por mínimos cuadrados y obtener los parámetros matemáticos.
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-200 border border-blue-700/40 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
              Calcular <InlineMath math="r^2" /> y analizar rigurosamente el comportamiento de los residuos.
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-200 border border-blue-700/40 flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
              Comparar los clústeres biológicos y presentar las conclusiones finales.
            </li>
          </ul>
        </div>
      </div>

      {/* Tabla Oficial Completa de Datos (88 Especies) */}
      <SpeciesDataTable />

      {/* Fundamento Biológico y Físico */}
      <div className="space-y-6">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-3">
          <Flame className="w-6 h-6 text-amber-400" />
          Fundamentación Alométrica: ¿Por qué la relación no es lineal?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[#243147] rounded-2xl border border-[#334155] space-y-3 shadow-xs">
            <h4 className="text-base sm:text-lg font-bold text-amber-300">1. Geometría y Disipación de Calor (M^{2/3})</h4>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Si un animal duplicara su tamaño manteniendo el metabolismo directamente proporcional a su masa (<InlineMath math="b = 1" />), su masa y volumen de células crecerían en proporción al cubo (<InlineMath math="L^3" />), pero su superficie para disipar calor solo crecería al cuadrado (<InlineMath math="L^2" />). 
              Consecuencia: Un animal grande como un elefante se sobrecalentaría instantáneamente hasta hervir sus tejidos.
            </p>
          </div>

          <div className="p-6 bg-[#243147] rounded-2xl border border-[#334155] space-y-3 shadow-xs">
            <h4 className="text-base sm:text-lg font-bold text-blue-300">2. Redes Fractales de Transporte y Ley de Kleiber (M^{3/4})</h4>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              El biólogo Max Kleiber descubrió empíricamente en 1932 que la tasa metabólica escala con un exponente cercano a <InlineMath math="b \approx 0.75" /> (<InlineMath math="3/4" />). Posteriormente, los físicos West, Brown y Enquist demostraron que esta regla se deriva de las redes fractales ramificadas (sistema circulatorio y respiratorio) que distribuyen nutrientes y oxígeno limitando el consumo a gran escala.
            </p>
          </div>
        </div>

        {/* Modelo Matemático */}
        <div className="bg-[#243147] p-6 md:p-8 rounded-2xl border border-[#334155] text-center space-y-5">
          <p className="text-slate-400 text-xs sm:text-sm uppercase tracking-wider font-semibold">
            Expresión Matemática del Modelo Potencial Alométrico
          </p>
          <div className="text-slate-100 text-2xl md:text-3xl py-2 flex justify-center">
            <BlockMath math="y = a \cdot x^b" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left pt-4 border-t border-[#334155]">
            <div className="p-3.5 bg-[#1a2436] rounded-xl border border-[#334155] shadow-xs">
              <strong className="text-slate-100 block font-mono text-lg font-bold">y</strong>
              <span className="text-slate-400 text-xs">Tasa metabólica basal estimada (W)</span>
            </div>
            <div className="p-3.5 bg-[#1a2436] rounded-xl border border-[#334155] shadow-xs">
              <strong className="text-slate-100 block font-mono text-lg font-bold">x</strong>
              <span className="text-slate-400 text-xs">Masa corporal del espécimen (kg)</span>
            </div>
            <div className="p-3.5 bg-[#1a2436] rounded-xl border border-[#334155] shadow-xs">
              <strong className="text-slate-100 block font-mono text-lg font-bold">a</strong>
              <span className="text-slate-400 text-xs">Nivel metabólico base del clúster (elevado en endotermos)</span>
            </div>
            <div className="p-3.5 bg-[#1a2436] rounded-xl border border-[#334155] shadow-xs">
              <strong className="text-slate-100 block font-mono text-lg font-bold">b</strong>
              <span className="text-slate-400 text-xs">Exponente alométrico (suele ubicarse entre 0.70 y 0.80)</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
