import React, { useState } from 'react';
import { useBuildStore } from '../../store/buildStore';
import { Sparkles, Terminal, ChevronRight, Loader2 } from 'lucide-react';

export const CommandBar: React.FC = () => {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { autoBuild, ui } = useBuildStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    autoBuild(input);
    setInput('');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-50 bg-zinc-900 hover:bg-zinc-800 text-white p-3 rounded-full shadow-lg border border-white/10 transition-all hover:scale-105 group"
      >
        <Sparkles size={20} className="text-neon-purple group-hover:animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="absolute inset-0" 
        onClick={() => !ui.isAutoBuilding && setIsOpen(false)} 
      />
      
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-zinc-900/50 p-3 border-b border-zinc-800 flex items-center gap-2">
           <Terminal size={16} className="text-zinc-500" />
           <span className="text-xs font-mono text-zinc-400 uppercase">Reverse Architect Agent</span>
        </div>

        <form onSubmit={handleSubmit} className="p-2">
          <div className="relative flex items-center">
            <input
              autoFocus
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={ui.isAutoBuilding}
              placeholder="Describe your workload (e.g., 'I need to run Llama 3 70B locally' or 'Budget rig for 8B models')"
              className="w-full bg-transparent text-lg text-white p-4 pl-4 pr-12 outline-none font-mono placeholder:text-zinc-600 disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={ui.isAutoBuilding || !input.trim()}
              className="absolute right-2 p-2 bg-white text-black rounded hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors"
            >
              {ui.isAutoBuilding ? <Loader2 className="animate-spin" size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </form>

        <div className="px-6 py-4 bg-zinc-900/30 text-xs text-zinc-500 font-mono">
           <p className="mb-2 text-zinc-400">Examples:</p>
           <ul className="space-y-1 list-disc pl-4">
             <li>"Build a monster for Mixtral 8x7B inference"</li>
             <li>"Cheapest setup for coding assistants (7B params)"</li>
           </ul>
        </div>
      </div>
    </div>
  );
};