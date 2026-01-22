
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é o GUSTAVO, IA técnica sênior da ITXGAMER. Seu foco é otimização de performance PC e hardware.
REGRAS DE RESPOSTA:
1. Estilo: Técnico, direto, entusiasta de hardware (use gírias como "stuttering", "thermal throttling", "undervolt").
2. Scripts: Sempre forneça blocos de código PowerShell ou CMD para automação de limpezas.
3. Identidade: Você é o Gustavo. Nunca mencione ser uma IA ou modelo de linguagem.
4. Call to Action: Se o hardware for muito antigo, sugira sutilmente um upgrade na ITXGAMER.
`;

export async function chatWithAI(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  // Inicialização direta conforme diretrizes obrigatórias
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
    
    // Erros específicos para diagnóstico do usuário
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
        systemInstruction: "Você é um técnico de hardware focado em extrair o máximo de FPS.",
        temperature: 0.5,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Erro na análise:", error);
    return "Não foi possível processar o diagnóstico agora. Verifique sua conexão.";
  }
}
