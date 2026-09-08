import React, { useState, useMemo, useRef } from 'react';
import { Database, Search, Filter, ArrowUpDown, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { ANIMALS_DATA } from '../data/animalsData';

export const SpeciesDataTable: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'id' | 'masa' | 'metabolismo'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (scrollContainerRef.current) {
      if (direction === 'up') {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (direction === 'down') {
        scrollContainerRef.current.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' });
      } else if (direction === 'left') {
        scrollContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
      } else if (direction === 'right') {
        scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
      }
    }
  };

  const filteredData = useMemo(() => {
    return ANIMALS_DATA.filter((item) => {
      const matchesCluster = selectedCluster === 'ALL' || item.codigo === selectedCluster;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        item.especie.toLowerCase().includes(query) ||
        item.grupo.toLowerCase().includes(query) ||
        item.codigo.toLowerCase().includes(query) ||
        item.id.toString() === query;
      return matchesCluster && matchesSearch;
    }).sort((a, b) => {
      const modifier = sortOrder === 'asc' ? 1 : -1;
      return (a[sortField] - b[sortField]) * modifier;
    });
  }, [selectedCluster, searchQuery, sortField, sortOrder]);

  const toggleSort = (field: 'id' | 'masa' | 'metabolismo') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const clusterFilters = [
    { id: 'ALL', label: 'Todos', count: 88, color: 'text-slate-200 border-white/20 bg-white/10' },
    { id: 'MAM', label: 'Mamíferos', count: 22, color: 'text-amber-300 border-amber-500/30 bg-amber-500/15' },
    { id: 'AVE', label: 'Aves', count: 22, color: 'text-blue-300 border-blue-500/30 bg-blue-500/15' },
    { id: 'REP', label: 'Reptiles', count: 22, color: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/15' },
    { id: 'PEC', label: 'Peces', count: 22, color: 'text-indigo-300 border-indigo-500/30 bg-indigo-500/15' },
  ];

  return (
    <div className="bg-black/40 rounded-2xl border border-white/10 p-4 sm:p-6 space-y-4 shadow-xl">
      {/* Encabezado de la tabla */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              Tabla Completa de Datos Oficiales (88 Especies)
            </h4>
            <p className="text-xs text-slate-400">
              Datos empíricos de masa corporal (<span className="text-slate-300 font-mono">X</span>) y tasa metabólica basal (<span className="text-emerald-400 font-mono">Y</span>) del enunciado
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
            {filteredData.length} / {ANIMALS_DATA.length} Especies
          </span>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Píldoras de Clúster */}
        <div className="flex items-center gap-1.5 overflow-x-auto slider-touch no-scrollbar py-1">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Grupo:
          </span>
          {clusterFilters.map((cf) => {
            const isSelected = selectedCluster === cf.id;
            return (
              <button
                key={cf.id}
                onClick={() => setSelectedCluster(cf.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? `${cf.color} ring-1 ring-white/30 shadow-md`
                    : 'text-slate-400 border-white/5 bg-white/[0.02] hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                {cf.label} ({cf.count})
              </button>
            );
          })}
        </div>

        {/* Buscador */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por especie, código o ID..."
            className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {/* Barra de navegación 2D asistida (Arriba, Abajo, Izquierda, Derecha) */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 px-1 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            ↕ ↔ Desplazamiento 2D Activo
          </span>
          <span className="text-slate-400 hidden xs:inline">
            Scroll en 4 direcciones (arriba, abajo, izquierda, derecha)
          </span>
        </div>

        {/* Botones de navegación asistida */}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-slate-500 text-[10px] hidden sm:inline mr-1">Controles:</span>
          <button
            onClick={() => handleScroll('left')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all cursor-pointer"
            title="Desplazar hacia la izquierda"
            aria-label="Desplazar a la izquierda"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all cursor-pointer"
            title="Desplazar hacia la derecha"
            aria-label="Desplazar a la derecha"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleScroll('up')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all cursor-pointer flex items-center gap-1 px-2"
            title="Ir al inicio de la tabla (arriba)"
          >
            <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px]">Inicio</span>
          </button>
          <button
            onClick={() => handleScroll('down')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all cursor-pointer flex items-center gap-1 px-2"
            title="Ir al final de la tabla (abajo)"
          >
            <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px]">Final</span>
          </button>
        </div>
      </div>

      {/* Contenedor Scrolleable 2D con Límite de Altura (Responsive Scroll Container) */}
      <div className="relative rounded-xl border border-white/10 overflow-hidden bg-black/50 shadow-inner">
        <div 
          ref={scrollContainerRef}
          className="max-h-[380px] sm:max-h-[440px] md:max-h-[480px] table-scroll-2d select-text"
        >
          <table className="min-w-[740px] w-full text-left border-collapse text-xs sm:text-sm">
            {/* Cabecera Pegajosa (Sticky Header) */}
            <thead className="sticky top-0 z-20 bg-slate-950/98 backdrop-blur-md border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[11px] shadow-sm">
              <tr>
                <th
                  onClick={() => toggleSort('id')}
                  className="py-3 px-3.5 cursor-pointer hover:text-white transition-colors w-16"
                  title="Ordenar por ID"
                >
                  <div className="flex items-center gap-1">
                    ID
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-3 w-24">Código</th>
                <th className="py-3 px-3 w-28">Clúster</th>
                <th className="py-3 px-4 min-w-[200px]">Especie Representativa</th>
                <th
                  onClick={() => toggleSort('masa')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors w-32"
                  title="Ordenar por Masa Corporal"
                >
                  <div className="flex items-center justify-end gap-1">
                    Masa (kg)
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('metabolismo')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors w-36"
                  title="Ordenar por Tasa Metabólica"
                >
                  <div className="flex items-center justify-end gap-1">
                    Metabolismo (W)
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
              </tr>
            </thead>

            {/* Cuerpo de la tabla */}
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const badgeStyles = {
                    MAM: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                    AVE: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
                    REP: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                    PEC: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                  }[item.codigo];

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-white/[0.04] transition-colors group"
                    >
                      <td className="py-2.5 px-3.5 font-mono text-slate-400 group-hover:text-slate-200">
                        {item.id}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-block font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${badgeStyles}`}>
                          {item.codigo}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-medium">
                        {item.grupo}
                      </td>
                      <td className="py-2.5 px-4 text-white font-medium">
                        {item.especie}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-300">
                        {item.masa >= 1000
                          ? item.masa.toLocaleString('es-AR')
                          : item.masa}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-semibold text-emerald-400">
                        {item.metabolismo.toFixed(4)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No se encontraron especies que coincidan con "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
