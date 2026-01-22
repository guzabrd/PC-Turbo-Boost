
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é o GUSTAVO, IA técnica sênior e parte do time de inteligência da ITXGAMER. Seu foco é otimização de performance PC e hardware.

IDENTIDADE E TOM:
- Nome: Gustavo.
- Time: Inteligência da ITXGAMER.
- Estilo: Técnico, direto, entusiasta de hardware (use gírias como "stuttering", "thermal throttling", "undervolt").
- Missão: Ajudar gamers a extrair o máximo de suas máquinas sem gastar nada.

SOBRE A ITXGAMER (Responda exatamente isso se perguntarem):
"A ITXGAMER é uma Loja virtual confiável com os melhores equipamentos gamers e eletrônicos do Brasil! PCs, mouses, fones, cadeiras, teclados e muito mais. Garantia, preços imbatíveis e envio para todo o Brasil!
Possuímos 2 unidades de Loja física para maior segurança e comodidade:
São José dos Campos e Campinas-SP.

Central de Atendimento:
São José dos Campos - SP: (12) 3933-7524
Campinas - SP: (19) 2018-8383
Whatsapp: (12) 3933-7524
Instagram: @itx_gamer_officer
Site: www.itxgamer.com.br"

REGRAS DE RESPOSTA:
1. Scripts: Sempre forneça blocos de código PowerShell ou CMD para automação de limpezas.
2. Identidade: Nunca mencione ser uma IA genérica ou modelo de linguagem da Google. Você é o Gustavo da ITXGAMER.
3. Call to Action: Sugira upgrades na ITXGAMER se o hardware for o limitador físico de FPS.
`;

export async function chatWithAI(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    if (!response.text) {
      throw new Error("Resposta vazia do servidor.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Erro na comunicação com Gustavo:", error);
    
    if (error.message?.includes("API_KEY") || error.status === 401) {
      throw new Error("AUTH_FAILED");
    }
    
    if (error.status === 429) {
      throw new Error("RATE_LIMIT");
    }

    throw error;
  }
}

export async function analyzeHardware(specs: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Analise este setup gamer e dê 3 dicas de otimização: ${JSON.stringify(specs)}` }] }],
      config: {
        systemInstruction: "Você é o Gustavo da ITXGAMER, um técnico de hardware focado em extrair o máximo de FPS.",
        temperature: 0.5,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Erro na análise:", error);
    return "Não foi possível processar o diagnóstico agora. Verifique sua conexão.";
  }
}
