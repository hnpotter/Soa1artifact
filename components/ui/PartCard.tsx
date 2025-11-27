import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HardwareComponent } from '../../types';

interface PartCardProps {
  item: HardwareComponent;
  isSelected: boolean;
  onSelect: () => void;
  onHover: (hovering: boolean) => void;
}

export const PartCard: React.FC<PartCardProps> = ({ item, isSelected, onSelect, onHover }) => {
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={twMerge(
        "group relative p-4 mb-3 rounded-lg border transition-all duration-300 cursor-pointer overflow-hidden",
        isSelected 
          ? "bg-zinc-900 border-neon-cyan/50 shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]" 
          : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
      )}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-neon-cyan shadow-[0_0_10px_#06b6d4]" />
      )}

      <div className="flex justify-between items-start mb-2">
        <h4 className={clsx(
          "text-sm font-semibold transition-colors",
          isSelected ? "text-white" : "text-zinc-300 group-hover:text-white"
        )}>
          {item.name}
        </h4>
        <span className="text-xs font-mono text-neon-cyan">
          ${item.price.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
        {item.type === 'gpu' && (
           <>
             <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/5">{(item as any).vramGB}GB VRAM</span>
             <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/5">{(item as any).memoryBandwidth} GB/s</span>
           </>
        )}
        {item.type === 'cpu' && (
           <>
             <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/5">{(item as any).cores} Cores</span>
             <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/5">{(item as any).socket}</span>
           </>
        )}
        {item.type === 'ram' && (
           <>
              <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/5">{(item as any).capacityGB}GB</span>
              <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/5">{(item as any).ddrVersion}</span>
           </>
        )}
        {item.type === 'motherboard' && (
           <>
              <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/5">{(item as any).socket}</span>
              <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/5">{(item as any).formFactor}</span>
           </>
        )}
        {item.type === 'psu' && (
           <>
              <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/5">{(item as any).wattage}W</span>
              <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/5">{(item as any).efficiency}</span>
           </>
        )}
      </div>
    </div>
  );
};