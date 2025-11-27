import React from 'react';
import { HUD } from './components/overlay/HUD';
import { Sidebar } from './components/overlay/Sidebar';
import { CommandBar } from './components/overlay/CommandBar';
import { RigSchematic } from './components/schematic/RigSchematic';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#050505] text-zinc-100 select-none">
      
      {/* Top Header/HUD */}
      <HUD />

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Center Canvas (Schematic) */}
        <main className="flex-1 relative flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-[#050505] to-[#050505]">
          <RigSchematic />
          
          {/* Decorative Corner Elements */}
          <div className="absolute top-8 left-8 w-32 h-32 border-l border-t border-white/10 rounded-tl-3xl pointer-events-none" />
          <div className="absolute bottom-8 left-8 w-32 h-32 border-l border-b border-white/10 rounded-bl-3xl pointer-events-none" />
          
          {/* Version/Meta Tag */}
          <div className="absolute bottom-8 right-8 text-zinc-800 font-mono text-9xl font-bold opacity-20 pointer-events-none">
            V1.5
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-96 flex-shrink-0 z-20">
            <Sidebar />
        </aside>

      </div>

      {/* AI Command Bar (Floating) */}
      <CommandBar />

      {/* Global Vignette */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-radial-gradient(circle at center, transparent 40%, rgba(5,5,5,0.8) 100%)" />
    </div>
  );
};

export default App;