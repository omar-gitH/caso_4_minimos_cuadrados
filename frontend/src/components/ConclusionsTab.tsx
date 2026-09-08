import React from 'react';
import { Award, Compass, Sparkles, TrendingUp, ThermometerSnowflake, ThermometerSun } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface FitData {
  cluster: string;
  data_points: { x: number; y: number; especie: string }[];
  fit: {
    a: number;
    b: number;
    equation: string;
    r2: number;
    curve: { x: number; y: number }[];
  };
}

interface ConclusionsTabProps {
  data: Record<string, FitData>;
}

export const ConclusionsTab: React.FC<ConclusionsTabProps> = ({ data }) => {
  // Combinar puntos de curvas para un único gráfico comparativo
  // Tomamos 50 valores de masa en escala log entre 0.002 y 12000 kg
  const combinedCurveData: any[] = [];
  const mamFit = data['MAM']?.fit;
  const aveFit = data['AVE']?.fit;
  const repFit = data['REP']?.fit;
  const pecFit = data['PEC']?.fit;

  if (mamFit && aveFit && repFit && pecFit) {
    const minMass = 0.002;
    const maxMass = 12000;
    const steps = 60;
    const logMin = Math.log10(minMass);
    const logMax = Math.log10(maxMass);

    for (let i = 0; i <= steps; i++) {
      const mass = Math.pow(10, logMin + (i / steps) * (logMax - logMin));
      combinedCurveData.push({
        x: mass,
        mam: mamFit.a * Math.pow(mass, mamFit.b),
        ave: aveFit.a * Math.pow(mass, aveFit.b),
        rep: repFit.a * Math.pow(mass, repFit.b),
        pec: pecFit.a * Math.pow(mass, pecFit.b),
      });
    }
  }

  const clustersSummary = [
    {
      id: 'AVE',
      name: 'Aves',
      type: 'Endotermos (Homeotermos)',
      color: '#38bdf8',
      badgeColor: 'bg-sky-950/40 text-sky-300 border-sky-800/40',
      a: data['AVE']?.fit.a || 4.8220,
      b: data['AVE']?.fit.b || 0.7519,
      r2: data['AVE']?.fit.r2 || 0.9107,
      equation: data['AVE']?.fit.equation || 'y = 4.8220 \\cdot x^{0.7519}',
      insight: 'Tienen la tasa basal más alta debido a la gran demanda energética del vuelo y temperaturas corporales de ~40°C.'
    },
    {
      id: 'MAM',
      name: 'Mamíferos',
      type: 'Endotermos (Homeotermos)',
      color: '#f59e0b',
      badgeColor: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
      a: data['MAM']?.fit.a || 3.4690,
      b: data['MAM']?.fit.b || 0.7423,
      r2: data['MAM']?.fit.r2 || 0.9908,
      equation: data['MAM']?.fit.equation || 'y = 3.4690 \\cdot x^{0.7423}',
      insight: 'Ajuste casi perfecto (r²=0.9908). Representan el modelo clásico de la Ley de Kleiber con b ≈ 0.74.'
    },
    {
      id: 'REP',
      name: 'Reptiles',
      type: 'Ectotermos (Poiquilotermos)',
      color: '#34d399',
      badgeColor: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40',
      a: data['REP']?.fit.a || 0.6753,
      b: data['REP']?.fit.b || 0.8035,
      r2: data['REP']?.fit.r2 || 0.9140,
      equation: data['REP']?.fit.equation || 'y = 0.6753 \\cdot x^{0.8035}',
      insight: 'Consumen ~5 veces menos energía que un mamífero del mismo tamaño ya que dependen del calor ambiental.'
    },
    {
      id: 'PEC',
      name: 'Peces',
      type: 'Ectotermos (Poiquilotermos)',
      color: '#818cf8',
      badgeColor: 'bg-indigo-950/40 text-indigo-300 border-indigo-800/40',
      a: data['PEC']?.fit.a || 0.4922,
      b: data['PEC']?.fit.b || 0.7806,
      r2: data['PEC']?.fit.r2 || 0.9832,
      equation: data['PEC']?.fit.equation || 'y = 0.4922 \\cdot x^{0.7806}',
      insight: 'Tienen el nivel basal más bajo. La flotabilidad acuática reduce el trabajo antigravitatorio.'
    },
  ];

  return (
    <div className="bg-[#1e293b] p-4 sm:p-8 md:p-12 rounded-3xl shadow-lg border border-[#334155] w-full max-w-6xl xl:max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#334155] pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 sm:p-4 bg-emerald-950/40 text-emerald-300 rounded-2xl border border-emerald-800/40 shadow-xs">
            <Award className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-3 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
                Consigna #5
              </span>
              <span className="text-xs text-slate-400 font-mono">Conclusiones del Caso 4</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight mt-1">
              Comparación Inter-Clúster y Conclusión General
            </h2>
          </div>
        </div>
      </div>

      {/* Gráfico Comparativo Conjunto */}
      <div className="bg-[#1a2638] p-6 md:p-8 rounded-3xl border border-[#334155] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              Contraste Global: Las 4 Curvas Alométricas Superpuestas
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Visualización simultánea en escala logarítmica. Nótese el paralelismo de pendientes y la separación vertical por termorregulación.
            </p>
          </div>
        </div>

        <div className="h-[440px] w-full bg-[#1a2436] rounded-2xl p-4 border border-[#334155] shadow-xs">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={combinedCurveData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="x" 
                type="number" 
                scale="log" 
                domain={[0.002, 12000]}
                label={{ value: 'Masa corporal (kg) [Escala Log]', position: 'insideBottom', offset: -12, fill: '#cbd5e1' }}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
                stroke="#64748b"
              />
              <YAxis 
                type="number" 
                scale="log" 
                domain={['auto', 'auto']}
                label={{ value: 'Tasa Metabólica Basal (W) [Escala Log]', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, fill: '#cbd5e1', offset: -10 }}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                stroke="#64748b"
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#243147] p-4 rounded-xl border border-[#334155] shadow-xl text-xs space-y-1.5">
                        <p className="font-bold text-slate-100 text-sm mb-1 font-mono">Masa: {d.x.toFixed(2)} kg</p>
                        <p className="text-sky-300 font-medium">Aves: <span className="font-mono font-bold">{d.ave.toFixed(2)} W</span></p>
                        <p className="text-amber-300 font-medium">Mamíferos: <span className="font-mono font-bold">{d.mam.toFixed(2)} W</span></p>
                        <p className="text-emerald-300 font-medium">Reptiles: <span className="font-mono font-bold">{d.rep.toFixed(2)} W</span></p>
                        <p className="text-indigo-300 font-medium">Peces: <span className="font-mono font-bold">{d.pec.toFixed(2)} W</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="ave" stroke="#38bdf8" strokeWidth={3.5} dot={false} name="Aves (y = 4.82·x^0.75)" />
              <Line type="monotone" dataKey="mam" stroke="#f59e0b" strokeWidth={3.5} dot={false} name="Mamíferos (y = 3.47·x^0.74)" />
              <Line type="monotone" dataKey="rep" stroke="#34d399" strokeWidth={3.5} dot={false} name="Reptiles (y = 0.68·x^0.80)" />
              <Line type="monotone" dataKey="pec" stroke="#818cf8" strokeWidth={3.5} dot={false} name="Peces (y = 0.49·x^0.78)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla Sinóptica de Comparación */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-400" />
            Tabla Sinóptica de Parámetros por Clúster
          </h3>
          <div className="flex sm:hidden items-center gap-1.5 text-xs text-blue-300 font-mono bg-blue-950/40 px-3 py-1 rounded-full border border-blue-800/40 w-fit">
            <span>⇄ Desliza horizontalmente la tabla</span>
          </div>
        </div>

        <div className="overflow-x-auto slider-touch rounded-2xl border border-[#334155] bg-[#1a2436] shadow-xs">
          <table className="min-w-[720px] w-full text-left border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-[#243147] border-b border-[#334155] text-slate-300 uppercase text-xs tracking-wider font-semibold">
                <th className="p-4">Clúster</th>
                <th className="p-4">Fisiología</th>
                <th className="p-4">Ecuación Resultante</th>
                <th className="p-4 text-center">Nivel Base (a)</th>
                <th className="p-4 text-center">Exponente (b)</th>
                <th className="p-4 text-center">Ajuste (r²)</th>
                <th className="p-4">Interpretación Biológica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155] text-slate-300 font-normal">
              {clustersSummary.map((c) => (
                <tr key={c.id} className="hover:bg-[#243147]/50 transition-colors">
                  <td className="p-4 font-bold text-slate-100 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></span>
                    {c.name}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${c.badgeColor}`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-100 font-semibold text-xs md:text-sm whitespace-nowrap">
                    <InlineMath math={c.equation} />
                  </td>
                  <td className="p-4 text-center font-mono font-bold text-slate-100 text-base">
                    {c.a.toFixed(4)}
                  </td>
                  <td className="p-4 text-center font-mono font-bold text-sky-400 text-base">
                    {c.b.toFixed(4)}
                  </td>
                  <td className="p-4 text-center font-mono font-bold text-emerald-400">
                    {c.r2.toFixed(4)}
                  </td>
                  <td className="p-4 text-xs md:text-sm text-slate-300 leading-relaxed">
                    {c.insight}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interpretación de Parámetros en el Contexto del Problema */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Significado del Coeficiente 'a' */}
        <div className="p-6 bg-[#243147] rounded-2xl border border-[#334155] space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-950/40 text-amber-300 rounded-xl border border-amber-800/40">
              <ThermometerSun className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-100">¿Qué significa el Coeficiente 'a'?</h4>
              <span className="text-xs text-amber-300 font-mono font-semibold">Nivel de Energía Basal (Intercepto)</span>
            </div>
          </div>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal">
            El valor de <InlineMath math="a" /> representa la tasa metabólica teórica para un animal hipotético de <InlineMath math="1\text{ kg}" />.
          </p>
          <ul className="space-y-2.5 text-xs md:text-sm text-slate-300">
            <li className="p-3.5 bg-[#1a2436] rounded-xl border border-[#334155] shadow-xs">
              <strong className="text-amber-300">Endotermos (Aves y Mamíferos):</strong> Presentan <InlineMath math="a \approx 3.47 - 4.82" />. Mantienen su cuerpo a una temperatura elevada y constante (~37°C a 40°C), lo que requiere una quema masiva y continua de calorías en reposo.
            </li>
            <li className="p-3.5 bg-[#1a2436] rounded-xl border border-[#334155] shadow-xs">
              <strong className="text-emerald-300">Ectotermos (Reptiles y Peces):</strong> Presentan <InlineMath math="a \approx 0.49 - 0.68" />. Su temperatura depende del entorno externo, requiriendo entre un <strong className="text-slate-100">80% y 90% menos de energía basal</strong> que un mamífero del mismo tamaño.
            </li>
          </ul>
        </div>

        {/* Significado del Exponente 'b' */}
        <div className="p-6 bg-[#243147] rounded-2xl border border-[#334155] space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-950/40 text-blue-300 rounded-xl border border-blue-800/40">
              <ThermometerSnowflake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-100">¿Qué significa el Exponente 'b'?</h4>
              <span className="text-xs text-blue-300 font-mono font-semibold">Invariante Alométrica (Pendiente)</span>
            </div>
          </div>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal">
            El exponente <InlineMath math="b" /> determina la curvatura geométrica de la ley de potencias. En todos los clústeres observamos un valor notablemente constante: <InlineMath math="b \in [0.74, 0.80]" />, muy cercano al valor teórico de la <strong className="text-blue-300">Ley de Kleiber (3/4 = 0.75)</strong>.
          </p>
          <div className="p-4 bg-[#1a2436] rounded-xl border border-[#334155] shadow-xs text-xs md:text-sm space-y-2">
            <p className="text-slate-100 font-semibold">
              Al cumplirse que <InlineMath math="b < 1" />:
            </p>
            <p className="text-slate-300 leading-relaxed">
              La tasa metabólica crece <strong>sublinealmente</strong> respecto a la masa. Esto implica que <strong>la tasa metabólica específica por gramo de tejido decrece drásticamente</strong> a medida que el animal es más grande.
            </p>
          </div>
        </div>

      </div>

      {/* Conclusión General del Caso 4 */}
      <div className="p-6 sm:p-8 md:p-10 bg-[#1a2638] rounded-3xl border border-[#334155] shadow-xs space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-blue-400" />
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Conclusión General del Caso 4
          </h3>
        </div>
        
        <div className="space-y-4 text-slate-300 text-base md:text-lg font-normal leading-relaxed">
          <p>
            El análisis mediante el <strong>Método de Mínimos Cuadrados</strong> demostró de forma concluyente que la relación entre la masa corporal y la tasa metabólica basal en los cuatro clústeres analizados es de carácter <strong>estrictamente potencial</strong> (<InlineMath math="y = a \cdot x^b" />), alcanzando coeficientes de determinación sobresalientes (<InlineMath math="r^2 > 0.91" /> en todos los grupos y hasta <InlineMath math="0.9908" /> en mamíferos).
          </p>
          <p>
            Respondiendo a la pregunta central de la investigación: <strong>los animales no consumen energía en forma directamente proporcional a su masa (<InlineMath math="b \neq 1" />)</strong> debido a dos limitaciones biofísicas universales:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-base text-slate-300">
            <li>
              <strong>Restricción de superficie y calor:</strong> Un organismo tridimensional genera calor proporcional a su masa (<InlineMath math="L^3" />), pero disipa calor al ambiente a través de su piel (<InlineMath math="L^2" />). Una tasa lineal provocaría sobrecalentamiento mortal en animales grandes.
            </li>
            <li>
              <strong>Redes de distribución fractal:</strong> La ramificación del sistema vascular y respiratorio optimiza la entrega de nutrientes a todas las células con un exponente universal de <InlineMath math="3/4 = 0.75" />.
            </li>
          </ol>
          <div className="p-4 bg-[#243147] rounded-xl border border-blue-800/40 shadow-xs text-blue-200 font-medium">
            En conclusión, la metodología de linealización logarítmica y resolución del sistema matricial normal de Gauss permitió capturar con máxima fidelidad la termodinámica del reino animal, demostrando la superioridad del modelo potencial frente a los modelos lineales o exponenciales.
          </div>
        </div>
      </div>

    </div>
  );
};
