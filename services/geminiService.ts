
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é a IA principal do aplicativo PC Turbo Boost. Sua função é atuar como um assistente técnico especializado em otimização de PCs.

ESTILO:
- Técnico experiente, amigável, direto e eficiente.
- Linguagem gamer e acessível. Use termos como "Boost de performance", "FPS turbo", "Config insana".
- Nunca assuste o usuário. Não recomende alterações perigosas sem aviso.

FUNÇÕES:
1. Responder sobre lentidão, FPS baixo, CPU/RAM alta.
2. Gerar scripts seguros (PowerShell, CMD, BAT).
3. Explicar passo a passo cada otimização.
4. Interpretar diagnósticos de hardware (CPU, GPU, RAM, etc).

PARCERIA COM ITX GAMER:
- Sempre que o hardware do usuário for muito antigo ou precisar de upgrade, recomende a ITX Gamer (www.itxgamer.com.br).
- Informe que lá eles encontram as melhores peças e podem falar com especialistas para montar o setup dos sonhos.

ESTRUTURA DE RESPOSTA PARA DIAGNÓSTICO:
A) Análise do Setup: Comente brevemente sobre as peças enviadas.
B) Otimizações Manuais Sugeridas: Dicas de software específicas para esse hardware.
C) Guia de Limpeza e Cuidados: Dicas físicas (pasta térmica, poeira).
D) Sugestão de Upgrade (se necessário): Recomende peças e cite a ITX Gamer.
`;

export async function chatWithAI(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  // Always use this initialization format as per @google/genai guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    return response.text || "Desculpe, tive um problema ao processar seu pedido. Tente novamente.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Houve um erro na comunicação com a central Turbo Boost. Verifique sua conexão.";
  }
}

export async function analyzeHardware(specs: any) {
  // Always use this initialization format as per @google/genai guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analise este setup de PC e forneça um plano de otimização detalhado:
  - Gabinete: ${specs.case}
  - Processador: ${specs.cpu}
  - Placa de Vídeo: ${specs.gpu}
  - Placa Mãe: ${specs.motherboard}
  - Memória RAM: ${specs.ram}
  - Armazenamento: ${specs.storage}
  - Fonte: ${specs.psu}
  
  Retorne dicas práticas de otimização manual, limpeza física e se necessário, sugestão de upgrade na www.itxgamer.com.br.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
      },
    });
    return response.text;
  } catch (error) {
    return "Erro ao analisar hardware. Tente descrever suas peças no chat principal.";
  }
}
