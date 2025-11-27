
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuildStore } from '../../store/buildStore';
import { ComponentType } from '../../types';

// --- VISUAL CONSTANTS ---
const COLORS = {
  disabled: { fill: '#111111', stroke: '#333333', opacity: 0.3, dash: '0' },
  available: { fill: 'transparent', stroke: '#22c55e', opacity: 1.0, dash: '4 4' },
  filled: { fill: 'rgba(6, 182, 212, 0.15)', stroke: '#06b6d4', opacity: 1.0, dash: '0' }
};

type SlotState = 'disabled' | 'available' | 'filled';

// --- SUB-COMPONENTS ---

const SchematicSlot = ({ 
  x, y, width, height, label, subLabel, state, onClick 
}: { 
  x: number, y: number, width: number, height: number, 
  label?: string, subLabel?: string, state: SlotState, onClick?: () => void 
}) => {
  const style = COLORS[state];

  return (
    <motion.g 
      initial={false}
      animate={{ opacity: style.opacity }}
      transition={{ duration: 0.3 }}
      onClick={state !== 'disabled' ? onClick : undefined}
      className={state !== 'disabled' ? 'cursor-pointer' : ''}
    >
      {/* Glow for Filled State */}
      <AnimatePresence>
        {state === 'filled' && (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            x={x - 2} y={y - 2} width={width + 4} height={height + 4}
            fill="none"
            stroke="#06b6d4"
            strokeWidth={1}
            filter="url(#glow)"
            rx={4}
          />
        )}
      </AnimatePresence>

      {/* Main Rect */}
      <motion.rect
        x={x} y={y} width={width} height={height}
        rx={4}
        initial={false}
        animate={{
          fill: style.fill,
          stroke: style.stroke,
          strokeDasharray: style.dash
        }}
        strokeWidth={state === 'filled' ? 2 : 1.5}
      />

      {/* Label */}
      {label && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          dy=".3em"
          textAnchor="middle"
          className="font-mono text-[10px] uppercase tracking-widest pointer-events-none"
          fill={state === 'filled' ? '#06b6d4' : state === 'available' ? '#22c55e' : '#555'}
        >
          {label}
        </text>
      )}

      {/* SubLabel (e.g., Specs) */}
      {subLabel && state === 'filled' && (
        <text
          x={x + width / 2}
          y={y + height + 14}
          textAnchor="middle"
          className="font-mono text-[9px] fill-neon-cyan opacity-70 pointer-events-none"
        >
          {subLabel}
        </text>
      )}
    </motion.g>
  );
};

export const RigSchematic: React.FC = () => {
  const { parts, setHoveredPart, setActiveCategory } = useBuildStore();

  // --- LOGIC HELPERS ---

  // 1. Motherboard State
  const mbState: SlotState = parts.motherboard ? 'filled' : 'available';

  // 2. CPU State
  const cpuState: SlotState = !parts.motherboard 
    ? 'disabled' 
    : parts.cpu ? 'filled' : 'available';

  // 3. RAM Logic
  const maxRamSlots = parts.motherboard?.formFactor === 'ITX' ? 2 : 4;
  const getRamState = (index: number): SlotState => {
    if (!parts.motherboard) return 'disabled';
    if (index >= maxRamSlots) return 'disabled';
    if (!parts.ram) return 'available';
    return index < parts.ram.modules ? 'filled' : 'available';
  };

  // 4. GPU Logic (PCIe)
  const getGpuState = (index: number): SlotState => {
    if (!parts.motherboard) return 'disabled';
    if (!parts.motherboard.pcieLayout[index]) return 'disabled';
    
    // Check if a GPU occupies this slot index
    const gpu = parts.gpus[index];
    return gpu ? 'filled' : 'available';
  };

  // 5. Storage Logic (M.2)
  const getStorageState = (index: number): SlotState => {
    if (!parts.motherboard) return 'disabled';
    if (index >= parts.motherboard.m2SlotsCount) return 'disabled';
    
    // Currently only support 1 storage device in store, so index 0 fills if present
    if (index === 0 && parts.storage) return 'filled';
    return 'available';
  };
  
  // 6. PSU State
  const psuState: SlotState = parts.psu ? 'filled' : 'available'; // PSU always available to select

  const handleSelect = (category: ComponentType) => {
      setActiveCategory(category);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <svg 
        viewBox="0 0 800 750" 
        className="w-full h-full max-w-4xl max-h-[90vh] drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- MOTHERBOARD OUTLINE --- */}
        <motion.path 
          d="M 100 50 L 700 50 L 700 680 L 100 680 Z"
          fill="rgba(10,10,12, 0.5)"
          stroke={parts.motherboard ? "#06b6d4" : "#333"}
          strokeWidth={2}
          initial={false}
          animate={{ stroke: parts.motherboard ? "#06b6d4" : "#333" }}
          onClick={() => handleSelect('motherboard')}
          className="cursor-pointer transition-colors"
          onMouseEnter={() => setHoveredPart('motherboard')}
          onMouseLeave={() => setHoveredPart(null)}
        />
        
        {/* Board Label */}
        <text x="120" y="80" className="font-mono text-xs tracking-widest fill-zinc-500">
             {parts.motherboard ? parts.motherboard.name : "NO MOTHERBOARD SELECTED"}
        </text>

        {/* --- CPU SOCKET --- */}
        <SchematicSlot 
            x={325} y={180} width={150} height={150}
            state={cpuState}
            label={parts.cpu ? "" : "CPU SOCKET"}
            subLabel={parts.cpu?.name}
            onClick={() => handleSelect('cpu')}
        />

        {/* --- RAM SLOTS (Right of CPU) --- */}
        <g transform="translate(530, 150)">
            {[0, 1, 2, 3].map(i => (
                <SchematicSlot
                    key={`ram-${i}`}
                    x={i * 25} y={0} width={15} height={280}
                    state={getRamState(i)}
                    onClick={() => handleSelect('ram')}
                />
            ))}
            {parts.ram && (
                <text x="50" y="310" textAnchor="middle" className="font-mono text-[9px] fill-neon-cyan opacity-80">
                    {parts.ram.capacityGB}GB {parts.ram.ddrVersion}
                </text>
            )}
        </g>

        {/* --- M.2 STORAGE SLOTS (Below CPU) --- */}
        <g transform="translate(325, 360)">
             {[0, 1, 2].map(i => (
                 <SchematicSlot
                    key={`m2-${i}`}
                    x={0} y={i * 30} width={150} height={20}
                    state={getStorageState(i)}
                    label={getStorageState(i) === 'available' ? `M.2_SLOT_${i+1}` : (i === 0 && parts.storage ? parts.storage.name : '')}
                    onClick={() => handleSelect('storage')}
                 />
             ))}
        </g>

        {/* --- PCIE / GPU SLOTS (Bottom Half) --- */}
        <g transform="translate(150, 480)">
             {/* If no mobo, show placeholders. If mobo, show actual layout */}
             {(!parts.motherboard ? [0, 1, 2] : parts.motherboard.pcieLayout).map((slot, i) => {
                 const isRealSlot = !!parts.motherboard;
                 return (
                    <SchematicSlot 
                        key={`pcie-${i}`}
                        x={0} y={i * 60} width={500} height={45}
                        state={getGpuState(i)}
                        label={
                            getGpuState(i) === 'filled' 
                            ? parts.gpus[i].name 
                            : (isRealSlot ? `PCIE_${i+1} [${(slot as any).speed}]` : 'PCIE SLOT')
                        }
                        onClick={() => handleSelect('gpu')}
                    />
                 );
             })}
        </g>

        {/* --- PSU (External/Bottom) --- */}
        <g transform="translate(150, 690)">
            <SchematicSlot 
                x={0} y={0} width={500} height={50}
                state={psuState}
                label={parts.psu ? parts.psu.name : "POWER SUPPLY UNIT"}
                onClick={() => handleSelect('psu')}
            />
        </g>

      </svg>
    </div>
  );
};
