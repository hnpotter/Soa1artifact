import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";
import { CPUS, GPUS, MOTHERBOARDS, RAM_KITS, PSUS } from '../../../data/parts';

// In-memory rate limiter (resets on serverless cold start, acceptable for this scope)
const rateLimitMap = new Map<string, number>();

export async function POST(req: NextRequest) {
  // 1. RATE LIMITING
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const lastRequest = rateLimitMap.get(ip);

  // Limit: 1 request per 60 seconds
  if (lastRequest && now - lastRequest < 60000) {
    return NextResponse.json(
      { error: "Neural Link Overloaded. Rate limit: 1 request/60s." },
      { status: 429 }
    );
  }
  rateLimitMap.set(ip, now);

  try {
    const { prompt } = await req.json();

    if (!process.env.API_KEY) {
        return NextResponse.json({ error: "Server Configuration Error: API_KEY missing" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 2. CONTEXT OPTIMIZATION (Token Saving)
    // We only inject necessary specs for compatibility logic, avoiding full JSON dumps.
    const context = `
      COMPONENT CATALOG:
      
      [CPUS]
      ${CPUS.map(p => `- ID:${p.id} | Name:${p.name} | Socket:${p.socket} | Cores:${p.cores} | PCIe:${p.maxPcieLanes} lanes`).join('\n')}
      
      [GPUS] (Priority for Inference)
      ${GPUS.map(p => `- ID:${p.id} | Name:${p.name} | VRAM:${p.vramGB}GB | Bandwidth:${p.memoryBandwidth}GB/s | Slots:${p.widthSlots}`).join('\n')}
      
      [MOTHERBOARDS]
      ${MOTHERBOARDS.map(p => `- ID:${p.id} | Name:${p.name} | Socket:${p.socket} | Form:${p.formFactor} | MaxRAM:${p.maxRam}GB`).join('\n')}
      
      [RAM]
      ${RAM_KITS.map(p => `- ID:${p.id} | Name:${p.name} | Cap:${p.capacityGB}GB | Speed:${p.speed}MT/s`).join('\n')}
      
      [PSUS]
      ${PSUS.map(p => `- ID:${p.id} | Name:${p.name} | Watts:${p.wattage}W`).join('\n')}
    `;

    // 3. GENERATION
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        ROLE: Expert AI Systems Architect.
        TASK: Design a high-performance PC configuration based on the USER_QUERY.
        
        USER_QUERY: "${prompt}"
        
        STRICT RULES:
        1. COMPATIBILITY: CPU Socket MUST match Motherboard Socket (e.g., sTR5 with sTR5, AM5 with AM5).
        2. POWER: PSU Wattage must cover Total TDP + 20% headroom.
        3. LLM OPTIMIZATION: For "Inference" or "AI", prioritize VRAM (Total GB) and Memory Bandwidth.
        4. TOPOLOGY: If multiple GPUs are requested, ensure Motherboard has enough slots.
        
        ${context}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                cpu_id: { type: Type.STRING, nullable: true },
                gpu_ids: { type: Type.ARRAY, items: { type: Type.STRING } },
                motherboard_id: { type: Type.STRING, nullable: true },
                ram_id: { type: Type.STRING, nullable: true },
                psu_id: { type: Type.STRING, nullable: true },
                reasoning: { type: Type.STRING, nullable: true, description: "Brief technical explanation of the build choice." }
            }
        }
      }
    });

    return NextResponse.json(JSON.parse(response.text));

  } catch (error) {
    console.error("AI Architect Error:", error);
    return NextResponse.json(
        { error: "Architect Offline. Inference Failed." }, 
        { status: 500 }
    );
  }
}