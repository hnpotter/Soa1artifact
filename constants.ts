
import { CPU, GPU, Motherboard, PSU, RAM } from './types';

export const CPUS: CPU[] = [
  {
    id: 'cpu-threadripper-7960x',
    name: 'AMD Threadripper 7960X',
    type: 'cpu',
    brand: 'AMD',
    price: 1499,
    tdp: 350,
    cores: 24,
    threads: 48,
    socket: 'sTR5',
    maxPcieLanes: 88,
    baseClock: 4.2
  },
  {
    id: 'cpu-9950x',
    name: 'AMD Ryzen 9 9950X',
    type: 'cpu',
    brand: 'AMD',
    price: 649,
    tdp: 170,
    cores: 16,
    threads: 32,
    socket: 'AM5',
    maxPcieLanes: 24,
    baseClock: 4.3
  },
  {
    id: 'cpu-14900k',
    name: 'Intel Core i9-14900K',
    type: 'cpu',
    brand: 'Intel',
    price: 589,
    tdp: 253,
    cores: 24,
    threads: 32,
    socket: 'LGA1700',
    maxPcieLanes: 20,
    baseClock: 3.2
  }
];

export const GPUS: GPU[] = [
  {
    id: 'gpu-4090',
    name: 'NVIDIA RTX 4090',
    type: 'gpu',
    brand: 'NVIDIA',
    price: 1799,
    tdp: 450,
    vramGB: 24,
    memoryBandwidth: 1008,
    widthSlots: 3.5,
    pcieInterface: 16
  },
  {
    id: 'gpu-a6000',
    name: 'NVIDIA RTX 6000 Ada',
    type: 'gpu',
    brand: 'NVIDIA',
    price: 6800,
    tdp: 300,
    vramGB: 48,
    memoryBandwidth: 960,
    widthSlots: 2,
    pcieInterface: 16
  },
  {
    id: 'gpu-4060ti-16gb',
    name: 'NVIDIA RTX 4060 Ti 16GB',
    type: 'gpu',
    brand: 'NVIDIA',
    price: 449,
    tdp: 165,
    vramGB: 16,
    memoryBandwidth: 288,
    widthSlots: 2,
    pcieInterface: 8
  }
];

export const MOTHERBOARDS: Motherboard[] = [
  {
    id: 'mb-str5-pro',
    name: 'ASUS Pro WS TRX50-SAGE',
    type: 'motherboard',
    brand: 'ASUS',
    price: 899,
    tdp: 50,
    socket: 'sTR5',
    formFactor: 'E-ATX',
    maxRam: 1024,
    memoryType: 'DDR5',
    pcieLayout: [
        { id: '1', speed: 'x16', gen: 5 },
        { id: '2', speed: 'x16', gen: 5 },
        { id: '3', speed: 'x16', gen: 5 },
        { id: '4', speed: 'x16', gen: 5 },
        { id: '5', speed: 'x16', gen: 5 }
    ],
    m2SlotsCount: 4
  },
  {
    id: 'mb-am5-hero',
    name: 'ASUS ROG Crosshair X670E',
    type: 'motherboard',
    brand: 'ASUS',
    price: 699,
    tdp: 40,
    socket: 'AM5',
    formFactor: 'ATX',
    maxRam: 192,
    memoryType: 'DDR5',
    pcieLayout: [
        { id: '1', speed: 'x16', gen: 5 },
        { id: '2', speed: 'x16', gen: 5 },
        { id: '3', speed: 'x4', gen: 4 }
    ],
    m2SlotsCount: 4
  },
  {
    id: 'mb-z790-dark',
    name: 'EVGA Z790 DARK K|NGP|N',
    type: 'motherboard',
    brand: 'EVGA',
    price: 799,
    tdp: 45,
    socket: 'LGA1700',
    formFactor: 'E-ATX',
    maxRam: 128,
    memoryType: 'DDR5',
    pcieLayout: [
        { id: '1', speed: 'x16', gen: 5 },
        { id: '2', speed: 'x8', gen: 5 },
        { id: '3', speed: 'x4', gen: 4 }
    ],
    m2SlotsCount: 3
  }
];

export const RAM_KITS: RAM[] = [
  {
    id: 'ram-192gb',
    name: 'Corsair Vengeance 192GB (4x48GB)',
    type: 'ram',
    brand: 'Corsair',
    price: 750,
    tdp: 15,
    capacityGB: 192,
    speed: 5200,
    modules: 4,
    ddrVersion: 'DDR5'
  },
  {
    id: 'ram-96gb',
    name: 'G.Skill Trident Z5 96GB (2x48GB)',
    type: 'ram',
    brand: 'G.Skill',
    price: 340,
    tdp: 10,
    capacityGB: 96,
    speed: 6400,
    modules: 2,
    ddrVersion: 'DDR5'
  },
  {
    id: 'ram-64gb',
    name: 'Kingston Fury 64GB (2x32GB)',
    type: 'ram',
    brand: 'Kingston',
    price: 210,
    tdp: 8,
    capacityGB: 64,
    speed: 6000,
    modules: 2,
    ddrVersion: 'DDR5'
  }
];

export const PSUS: PSU[] = [
  {
    id: 'psu-1600w',
    name: 'Corsair AX1600i Digital',
    type: 'psu',
    brand: 'Corsair',
    price: 609,
    tdp: 0,
    wattage: 1600,
    efficiency: 'Titanium'
  },
  {
    id: 'psu-1000w',
    name: 'Seasonic Vertex GX-1000',
    type: 'psu',
    brand: 'Seasonic',
    price: 229,
    tdp: 0,
    wattage: 1000,
    efficiency: 'Gold'
  }
];
