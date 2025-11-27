
import React from 'react';
import { useBuildStore } from '../../store/buildStore';
import { CPUS, GPUS, MOTHERBOARDS, RAM_KITS, PSUS } from '../../data/parts';
import { ComponentType } from '../../types';
import { Cpu, Monitor, Zap, HardDrive, LayoutGrid, MemoryStick } from 'lucide-react';
import { PartCard } from '../ui/PartCard';

const CATEGORIES: { id: ComponentType; label: string; icon: any }[] = [
  { id: 'motherboard', label: 'Board', icon: LayoutGrid },
  { id: 'cpu', label: 'CPU', icon: Cpu },
  { id: 'gpu', label: 'GPU', icon: Monitor },
  { id: 'ram', label: 'RAM', icon: MemoryStick },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'psu', label: 'Power', icon: Zap },
];

export const Sidebar: React.FC = () => {
  const { parts, setComponent, setHoveredPart, ui, setActiveCategory } = useBuildStore();

  const getCatalog = (type: ComponentType) => {
    switch (type) {
      case 'cpu': return CPUS;
      case 'gpu': return GPUS;
      case 'motherboard': return MOTHERBOARDS;
      case 'ram': return RAM_KITS;
      case 'psu': return PSUS;
      // Mock storage data since it wasn't requested in parts.ts update but needed for UI safety
      case 'storage': return [
          { id: 'ssd-2tb', type: 'storage', name: 'Samsung 990 PRO 2TB', price: 169, brand: 'Samsung', tdp: 8 },
          { id: 'ssd-4tb', type: 'storage', name: 'WD Black SN850X 4TB', price: 299, brand: 'WD', tdp: 9 }
      ];
      default: return [];
    }
  };

  const currentCatalog = getCatalog(ui.activeCategory);
  
  const isSelected = (itemId: string, type: ComponentType) => {
      if (type === 'gpu') {
          return parts.gpus.some(g => g.id === itemId);
      }
      // @ts-ignore
      return parts[type]?.id === itemId;
  }

  return (
    <div className="h-full w-96 flex flex-col bg-zinc-950 border-l border-white/10 z-20 backdrop-blur-xl">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span className="text-neon-cyan">///</span> COMPONENT SELECT
        </h2>
      </div>
      
      {/* Category Tabs */}
      <div className="flex border-b border-white/5 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`
              flex-1 py-4 flex flex-col justify-center items-center relative transition-all min-w-[60px]
              ${ui.activeCategory === cat.id ? 'text-neon-cyan' : 'text-zinc-600 hover:text-zinc-400'}
            `}
          >
            <cat.icon size={20} strokeWidth={ui.activeCategory === cat.id ? 2.5 : 2} />
            <span className="text-[10px] font-mono mt-1 uppercase">{cat.label}</span>
            {ui.activeCategory === cat.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-cyan shadow-[0_0_10px_#06b6d4]" />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 bg-zinc-950/50">
         <div className="mb-4 flex justify-between items-center text-xs font-mono text-zinc-500 uppercase tracking-widest pl-1">
             <span>Available {CATEGORIES.find(c => c.id === ui.activeCategory)?.label} Units</span>
             {ui.activeCategory === 'gpu' && (
                 <span className="text-neon-cyan">
                     {parts.gpus.length} Installed
                 </span>
             )}
         </div>
         {currentCatalog.map((item: any) => (
             <PartCard
                key={item.id}
                item={item}
                isSelected={isSelected(item.id, item.type)}
                onSelect={() => setComponent(item)}
                onHover={(isHovering) => setHoveredPart(isHovering ? item.type : null)}
             />
         ))}
      </div>
    </div>
  );
};
