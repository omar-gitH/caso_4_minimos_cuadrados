import React from 'react';
import { Database, GitBranch, Sparkles, Activity } from 'lucide-react';

interface MetricField {
  id: string;
  icon: React.ElementType;
  label: string;
  value: string;
  accentColor: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
}

const METRICS: MetricField[] = [
  {
    id: 'observaciones',
    icon: Database,
    label: 'Observaciones',
    value: '88 Especies',
    accentColor: 'text-blue-400',
    iconBg: 'bg-blue-950/70',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/20'
  },
  {
    id: 'clusteres',
    icon: GitBranch,
    label: 'Clústeres',
    value: '4 Grupos',
    accentColor: 'text-indigo-400',
    iconBg: 'bg-indigo-950/70',
    iconColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/20'
  },
  {
    id: 'kleiber',
    icon: Sparkles,
    label: 'Ley Biofísica',
    value: 'Kleiber (3/4)',
    accentColor: 'text-amber-400',
    iconBg: 'bg-amber-950/70',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/20'
  },
  {
    id: 'ajuste',
    icon: Activity,
    label: 'Ajuste (r²)',
    value: '> 0.9740',
    accentColor: 'text-emerald-400',
    iconBg: 'bg-emerald-950/70',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20'
  }
];

export const HeaderMetricCollapses: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto cursor-default select-none">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full text-left">
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.id}
              className={`p-3.5 sm:p-4 rounded-2xl bg-[#243147]/80 border ${metric.borderColor} shadow-xs flex flex-col justify-between cursor-default`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`p-2 rounded-xl border border-slate-700/60 ${metric.iconBg} ${metric.iconColor}`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                </div>
              </div>

              <div>
                <span className="block text-xs text-slate-400 font-medium leading-tight mb-0.5">
                  {metric.label}
                </span>
                <span className={`text-base sm:text-lg font-bold font-mono tracking-tight leading-tight ${metric.accentColor}`}>
                  {metric.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
