import { create } from 'zustand';
import { BuildState, ComponentType, HardwareComponent, GPU } from '../types';
import { CPUS, GPUS, MOTHERBOARDS, RAM_KITS, PSUS } from '../data/parts';

// --- TYPES ---

interface BuildActions {
  setComponent: (component: HardwareComponent) => void;
  removeComponent: (type: ComponentType, index?: number) => void;
  setHoveredPart: (type: ComponentType | null) => void;
  setActiveCategory: (type: ComponentType) => void;
  resetBuild: () => void;
  autoBuild: (prompt: string) => Promise<void>;
}

// --- INITIAL STATE ---

const initialState: BuildState = {
  parts: {
    cpu: null,
    gpus: [],
    ram: null,
    motherboard: null,
    psu: null,
    storage: null,
  },
  metrics: {
    totalCost: 0,
    totalTDP: 0,
    estimatedTPS: 0,
    bottleneck: null,
    valid: true,
  },
  ui: {
    hoveredPart: null,
    activeCategory: 'motherboard',
    isAutoBuilding: false,
  },
};

// --- UTILITY: SYSTEM ARCHITECT VALIDATOR ---
const validateBuild = (parts: BuildState['parts']): BuildState['metrics'] => {
  let cost = 0;
  let tdp = 0;
  let tps = 0;
  let bottleneck: string | null = null;
  let valid = true;

  // 1. SUMMATION
  Object.values(parts).forEach((part) => {
    if (Array.isArray(part)) {
      part.forEach(p => { cost += p.price; tdp += p.tdp; });
    } else if (part) {
      cost += part.price;
      tdp += part.tdp;
    }
  });

  // 2. PERFORMANCE ESTIMATION
  if (parts.gpus.length > 0) {
    const totalBandwidth = parts.gpus.reduce((acc, g) => acc + g.memoryBandwidth, 0);
    const efficiency = parts.gpus.length > 1 ? 0.85 : 1.0; // Multi-GPU scaling penalty
    tps = Math.floor((totalBandwidth / 8.5) * efficiency);
  }

  // 3. DEEP LOGIC CONSTRAINTS

  // A. Platform Lock (Socket)
  if (parts.cpu && parts.motherboard) {
    if (parts.cpu.socket !== parts.motherboard.socket) {
      bottleneck = `CRITICAL: Socket Mismatch! CPU (${parts.cpu.socket}) cannot fit in Motherboard (${parts.motherboard.socket})`;
      valid = false;
    }
  }

  // B. PCIe Lane Saturation (The "Architect" Check)
  if (parts.cpu) {
    // Calculate lanes used by GPUs + NVMe (Standard NVMe = 4 lanes)
    const lanesUsed = parts.gpus.reduce((acc, g) => acc + (g.pcieInterface || 16), 0) + (parts.storage ? 4 : 0);
    const cpuLanes = parts.cpu.maxPcieLanes || 20; // Default to Consumer spec if missing

    if (lanesUsed > cpuLanes) {
      // Don't invalidate, just warn (as it will still boot, but slower)
      if (!bottleneck) bottleneck = `BANDWIDTH LIMIT: Using ${lanesUsed}/${cpuLanes} CPU Lanes. Some devices running at x8/x4.`;
    }
  }

  // C. Physical Slot Limit
  if (parts.motherboard && parts.gpus.length > 0) {
    // Count available x16/x8 physical slots
    const physicalSlots = parts.motherboard.pcieLayout?.length || 3; // Default to 3 if missing data
    if (parts.gpus.length > physicalSlots) {
       bottleneck = `PHYSICAL ERROR: Not enough PCIe slots on motherboard (${physicalSlots} avail).`;
       valid = false;
    }
  }

  // D. Power Supply Headroom
  if (parts.psu) {
    const recommended = tdp * 1.2; // 20% Overhead rule
    if (parts.psu.wattage < recommended) {
       if (!bottleneck) bottleneck = `POWER CRITICAL: Load ${tdp}W is unsafe for ${parts.psu.wattage}W PSU. Upgrade required.`;
       // We mark valid=true because it "fits", but it's dangerous.
    }
  }

  return { totalCost: cost, totalTDP: tdp, estimatedTPS: tps, bottleneck, valid };
};

const findPart = (catalog: any[], query: string) => {
    if (!query) return null;
    const lowerQuery = query.toLowerCase();
    const idMatch = catalog.find(p => p.id === query);
    if (idMatch) return idMatch;
    return catalog.find(p => p.name.toLowerCase().includes(lowerQuery) || lowerQuery.includes(p.name.toLowerCase()));
};


// --- STORE IMPLEMENTATION ---
export const useBuildStore = create<BuildState & BuildActions>((set, get) => ({
  ...initialState,

  setComponent: (component) => {
    set((state) => {
      let newParts = { ...state.parts };

      // SPECIAL LOGIC: MOTHERBOARD SWAP
      if (component.type === 'motherboard') {
        const mobo = component as any; // Cast to access socket
        if (newParts.cpu && newParts.cpu.socket !== mobo.socket) {
           console.log("Ejecting incompatible CPU...");
           newParts.cpu = null; // Auto-eject
        }
      }

      // SPECIAL LOGIC: CPU SWAP
      if (component.type === 'cpu') {
        const cpu = component as any;
        if (newParts.motherboard && newParts.motherboard.socket !== cpu.socket) {
            // Option B: Allow selection but break build (Visual feedback)
        }
      }

      // SPECIAL LOGIC: GPU ARRAY HANDLING
      if (component.type === 'gpu') {
        const currentGPUs = [...state.parts.gpus];
        const existingIndex = currentGPUs.findIndex(g => g.id === component.id);

        if (existingIndex >= 0) {
           // Toggle Off if clicked again
           currentGPUs.splice(existingIndex, 1);
        } else {
           // Add New (Up to 4)
           if (currentGPUs.length < 4) {
             currentGPUs.push(component as GPU);
           } else {
             // Cycle: Replace the first one if full
             currentGPUs.shift(); 
             currentGPUs.push(component as GPU);
           }
        }
        newParts.gpus = currentGPUs;
      } else {
        // Standard replacement for other parts
        // @ts-ignore
        newParts[component.type] = component;
      }

      return {
        parts: newParts,
        metrics: validateBuild(newParts),
      };
    });
  },

  removeComponent: (type, index = 0) => {
    set((state) => {
      let newParts = { ...state.parts };
      if (type === 'gpu') {
         newParts.gpus = state.parts.gpus.filter((_, i) => i !== index);
      } else {
         // @ts-ignore
         newParts[type] = null;
      }
      return {
        parts: newParts,
        metrics: validateBuild(newParts),
      };
    });
  },

  setHoveredPart: (type) => set((state) => ({ ui: { ...state.ui, hoveredPart: type } })),
  setActiveCategory: (type) => set((state) => ({ ui: { ...state.ui, activeCategory: type } })),
  resetBuild: () => set({ ...initialState }),
  
  autoBuild: async (prompt) => {
    set((state) => ({ ui: { ...state.ui, isAutoBuilding: true } }));
    
    try {
        // Secure Server-Side Call
        const response = await fetch('/api/architect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Architect Neural Link Failed');
        }

        const result = await response.json();
        
        // --- RESOLVE COMPONENT IDS TO OBJECTS ---
        const cpu = findPart(CPUS, result.cpu_id);
        const mobo = findPart(MOTHERBOARDS, result.motherboard_id);
        const ram = findPart(RAM_KITS, result.ram_id);
        const psu = findPart(PSUS, result.psu_id);
        const gpus = (result.gpu_ids || []).map((id: string) => findPart(GPUS, id)).filter(Boolean) as GPU[];

        // --- UPDATE STATE ---
        set((state) => {
            const newParts = {
                cpu: (cpu as any) || state.parts.cpu,
                motherboard: (mobo as any) || state.parts.motherboard,
                ram: (ram as any) || state.parts.ram,
                psu: (psu as any) || state.parts.psu,
                gpus: gpus.length > 0 ? gpus : state.parts.gpus,
                storage: state.parts.storage
            };
            
            // Log reasoning if provided by AI
            if (result.reasoning) {
                console.log("Architect Reasoning:", result.reasoning);
            }

            return {
                parts: newParts,
                metrics: validateBuild(newParts),
                ui: { ...state.ui, isAutoBuilding: false }
            };
        });

    } catch (e) {
        console.error("AutoBuild Error", e);
        set((state) => ({ ui: { ...state.ui, isAutoBuilding: false } }));
        // Optionally dispatch a toast error here
    }
  }
}));