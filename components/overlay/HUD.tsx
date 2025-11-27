
import React from 'react';
import { useBuildStore } from '../../store/buildStore';
import { Layers, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

const MetricBlock = ({ label, value, unit, color = 'text-white' }: any) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-1">{label}</span>
    <div className={clsx("text-2xl font-mono font-bold leading-none", color)}>
      {value}<span className="text-sm opacity-50 ml-0.5">{unit}</span>
    </div>
  </div>
);

export const HUD: React.FC = () => {
  const { metrics, parts } = useBuildStore();

  return (
    <div className="w-full h-24 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 z-30">
        
      {/* Brand & Status */}
      <div className="flex items-center gap-6">
        <div>
            <h1 className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
            <Layers className="text-neon-cyan" size={24} />
            NEURAL<span className="font-light text-zinc-400">ARCHITECT</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${metrics.valid ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 animate-pulse'}`} />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    {metrics.valid ? 'SYSTEM OPTIMAL' : 'CRITICAL ERROR'}
                </span>
            </div>
        </div>
        
        {/* Error Message */}
        {metrics.bottleneck && (
            <div className="h-10 px-4 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs font-mono">
                <AlertTriangle size={14} />
                {metrics.bottleneck}
            </div>
        )}
      </div>

      {/* Main Metrics */}
      <div className="flex items-center gap-12">
        {/* Inference Speed Gauge (Hero) */}
        <div className="flex items-center gap-4 border-r border-white/10 pr-12">
            <div className="text-right">
                <div className="text-[10px] font-mono text-neon-cyan uppercase tracking-wider mb-1">Estimated Velocity</div>
                <div className="text-4xl font-mono font-bold text-white leading-none shadow-neon-cyan drop-shadow-lg">
                    {metrics.estimatedTPS}
                </div>
            </div>
            <div className="h-10 w-1 bg-zinc-800 rounded-full overflow-hidden relative">
                 <div 
                    className="absolute bottom-0 w-full bg-neon-cyan transition-all duration-1000 ease-out shadow-[0_0_10px_#06b6d4]" 
                    style={{ height: `${Math.min(metrics.estimatedTPS / 2, 100)}%` }} 
                 />
            </div>
            <div className="text-xs font-mono text-zinc-500">TOK/S</div>
        </div>

        <MetricBlock 
            label="Total Draw" 
            value={metrics.totalTDP} 
            unit="W" 
            color={parts.psu && parts.psu.wattage < metrics.totalTDP * 1.1 ? 'text-neon-red' : 'text-neon-amber'}
        />
        
        <MetricBlock 
            label="Est. Cost" 
            value={metrics.totalCost.toLocaleString()} 
            unit="$" 
        />
      </div>

    </div>
  );
};
