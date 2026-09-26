import React from 'react';
import { BookOpen, Target, CheckCircle2, Flame, Layers, Scale, Sparkles } from 'lucide-react';
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
            <h4 className="text-base sm:text-lg font-bold text-amber-300">1. Geometría y Disipación de Calor (M^{2 / 3})</h4>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Si un animal duplicara su tamaño manteniendo el metabolismo directamente proporcional a su masa (<InlineMath math="b = 1" />), su masa y volumen de células crecerían en proporción al cubo (<InlineMath math="L^3" />), pero su superficie para disipar calor solo crecería al cuadrado (<InlineMath math="L^2" />).
              Consecuencia: Un animal grande como un elefante se sobrecalentaría instantáneamente hasta hervir sus tejidos.
            </p>
          </div>

          <div className="p-6 bg-[#243147] rounded-2xl border border-[#334155] space-y-3 shadow-xs">
            <h4 className="text-base sm:text-lg font-bold text-blue-300">2. Redes Fractales de Transporte y Ley de Kleiber (M^{3 / 4})</h4>
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

        {/* Compendio Teórico de Familias de Ajuste */}
        <div className="space-y-6 pt-4 border-t border-[#334155]">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-3">
              <Scale className="w-6 h-6 text-indigo-400" />
              Métodos de Ajuste por Mínimos Cuadrados
            </h3>
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
              Marco Teórico y Puntos de Referencia
            </span>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            En el análisis numérico de regresión por mínimos cuadrados, se emplean distintas familias de funciones para aproximar pares de datos empíricos <InlineMath math="(x_i, y_i)" />. Cada método plantea una minimización de residuos cuadráticos, utilizando resolución directa o transformaciones lineales:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Lineal */}
            <div className="p-5 bg-[#243147] rounded-2xl border border-[#334155] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-400">a. Lineal</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">Recta 2×2</span>
              </div>
              <div className="text-slate-100 text-lg font-bold font-mono py-1">
                <InlineMath math="y = a_0 + a_1 x" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aproximación directa sin transformación. El sistema normal 2×2 minimiza <InlineMath math="\sum_{i=1}^n (y_i - a_0 - a_1 x_i)^2" />. Desventaja biológica: genera ordenada negativa <InlineMath math="y(0) < 0" />.
              </p>
            </div>

            {/* 2. Polinómica */}
            <div className="p-5 bg-[#243147] rounded-2xl border border-[#334155] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-purple-400">b. Polinómica</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50">Gauss 3×3</span>
              </div>
              <div className="text-purple-300 text-lg font-bold font-mono py-1">
                <InlineMath math="y = a_0 + a_1 x + a_2 x^2" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mejora el (r^2), pero el término cuadrático no tiene una base biológica clara.
              </p>
            </div>

            {/* 3. Potencial */}
            <div className="p-5 bg-[#1a2b42] rounded-2xl border border-blue-500/50 space-y-3 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-blue-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  c. Potencial
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700/60">
                  Modelo elegido
                </span>
              </div>
              <div className="text-blue-300 text-lg font-bold font-mono py-1">
                <InlineMath math="y = a \cdot x^b" />
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Linealización log-log: <InlineMath math="\ln(y) = \ln(a) + b \ln(x)" />. Modela exactamente la Ley de Kleiber con <InlineMath math="b \approx 0.75" /> y <InlineMath math="r^2 > 0.97" /> en todos los clústeres.
              </p>
            </div>

            {/* 4. Exponencial */}
            <div className="p-5 bg-[#243147] rounded-2xl border border-[#334155] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-rose-400">d. Exponencial</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/50">Semilog 2×2</span>
              </div>
              <div className="text-rose-300 text-lg font-bold font-mono py-1">
                <InlineMath math="y = a \cdot e^{b \cdot x}" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Linealización semilog: <InlineMath math="\ln(y) = \ln(a) + bx" />. Crecimiento explosivo fuera del rango de datos; predice que el metabolismo crece a un ritmo inviable.
              </p>
            </div>

            {/* 5. Cociente */}
            <div className="p-5 bg-[#243147] rounded-2xl border border-[#334155] space-y-3 md:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-amber-400">e. Ecuación del Cociente (Razón de Saturación)</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/50">Inversión Recíproca</span>
              </div>
              <div className="text-amber-300 text-lg font-bold font-mono py-1">
                <InlineMath math="y = \frac{x}{a + b \cdot x} \quad \iff \quad \frac{1}{y} = a\left(\frac{1}{x}\right) + b" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                 En relaciones donde el metabolismo sigue creciendo, genera asíntotas verticales artificiales e <InlineMath math="r^2 < 0" />.
              </p>
            </div>
          </div>

          {/* Cuadro de Bondad de Ajuste r² */}
          <div className="p-5 sm:p-6 bg-[#1a2436] rounded-2xl border border-slate-700/60 space-y-3">
            <h4 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Cálculo de la Bondad del Ajuste (Coeficiente de Determinación r²)
            </h4>
            <div className="py-2 text-center text-slate-100 font-mono text-base sm:text-lg">
              <BlockMath math="r^2 = \frac{S_t - S_r}{S_t} = 1 - \frac{S_r}{S_t}, \quad \text{con } S_t = \sum_{i=1}^n (y_i - \bar{y})^2, \quad S_r = \sum_{i=1}^n (y_i - y_{\text{pred}, i})^2" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Para consultar el desarrollo analítico paso a paso de cada uno de estos métodos, sus tablas de sumatorias completas, el sistema matricial numérico y la tabla detallada de cálculo de <InlineMath math="r^2" /> sobre el ejemplo de la cátedra (<InlineMath math="x=[1..5]" />), navega a la pestaña <strong className="text-blue-300 font-semibold">"3. Procedimiento" → "1. Parte Teórica"</strong>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
