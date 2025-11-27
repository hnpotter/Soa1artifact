
export type ComponentType = 'cpu' | 'gpu' | 'ram' | 'motherboard' | 'psu' | 'storage';

export interface PCIeSlot {
  id: string;
  speed: 'x16' | 'x8' | 'x4' | 'x1';
  gen: 3 | 4 | 5;
}

export interface HardwareComponent {
  id: string;
  name: string;
  type: ComponentType;
  price: number;
  brand: string;
  image?: string;
  tdp: number;
}

export interface CPU extends HardwareComponent {
  type: 'cpu';
  cores: number;
  threads: number;
  socket: string;
  maxPcieLanes: number;
  baseClock: number;
}

export interface GPU extends HardwareComponent {
  type: 'gpu';
  vramGB: number;
  memoryBandwidth: number; // GB/s
  widthSlots: number;
  pcieInterface: number; // e.g., 16 for x16
}

export interface RAM extends HardwareComponent {
  type: 'ram';
  capacityGB: number;
  speed: number;
  modules: number;
  ddrVersion: 'DDR4' | 'DDR5';
}

export interface Motherboard extends HardwareComponent {
  type: 'motherboard';
  socket: string;
  formFactor: 'ATX' | 'E-ATX' | 'ITX';
  maxRam: number;
  memoryType: 'DDR4' | 'DDR5';
  pcieLayout: PCIeSlot[];
  m2SlotsCount: number;
}

export interface PSU extends HardwareComponent {
  type: 'psu';
  wattage: number;
  efficiency: 'Gold' | 'Platinum' | 'Titanium';
}

export interface BuildState {
  parts: {
    cpu: CPU | null;
    gpus: GPU[]; // Array for Multi-GPU support
    ram: RAM | null;
    motherboard: Motherboard | null;
    psu: PSU | null;
    storage: HardwareComponent | null;
  };
  metrics: {
    totalCost: number;
    totalTDP: number;
    estimatedTPS: number;
    bottleneck: string | null;
    valid: boolean;
  };
  ui: {
    hoveredPart: ComponentType | null;
    activeCategory: ComponentType;
    isAutoBuilding: boolean;
  };
}
