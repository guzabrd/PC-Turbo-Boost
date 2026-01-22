
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é o GUSTAVO, IA da ITXGAMER. Especialista em FPS e hardware.
- Use termos técnicos: "Low 1% FPS", "Bottleneck", "Latency", "Clock speed".
- Sempre dê comandos de PowerShell ou CMD para otimização.
- Seja o "parça" do gamer, mas muito técnico.
- Se a chave de API falhar, diga que o servidor está em "Throttling" por falta de créditos.
`;

// Função auxiliar para obter a chave sem quebrar o navegador
const safeGetApiKey = () => {
  try {
    // Tenta acessar via process.env (Vercel) ou import.meta.env (Vite Local)
    return (typeof process !== 'undefined' && process.env.API_KEY) || 
           (import.meta as any).env?.VITE_API_KEY;
  } catch (e) {
    return undefined;
  }
};

export async function chatWithAI(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const apiKey = safeGetApiKey();
  
  if (!apiKey) {
    return "ERRO_CONFIG: A API_KEY não foi encontrada no ambiente. Gamer, se você é o dono, verifique se a variável API_KEY está na Vercel e faça um 'Redeploy'.";
  }

  try {
    // Sempre criar uma nova instância antes da chamada para garantir o uso da chave atualizada
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.75,
      },
    });

    return response.text || "Sem sinal do servidor. Tenta mandar outro comando!";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.status === 401 || error.status === 403) {
      return "FALHA DE AUTENTICAÇÃO: Sua API_KEY parece ser inválida ou expirou. Gere uma nova no Google AI Studio.";
    }
    
    if (error.status === 429) {
      return "LIMIT REACHED: Muitas requisições. O Gustavo precisa de 10 segundos de cooldown.";
    }

    return `SISTEMA INSTÁVEL: Ocorreu um erro técnico (${error.message || 'Desconhecido'}). Tente novamente.`;
  }
}

export async function analyzeHardware(specs: any) {
  const apiKey = safeGetApiKey();
  if (!apiKey) return "Erro: API_KEY ausente.";

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Analise: ${JSON.stringify(specs)}` }] }],
      config: {
        systemInstruction: "Dê 3 dicas de hardware para este setup. Seja breve.",
        temperature: 0.5,
      },
    });
    return response.text;
  } catch (error) {
    return "Falha na análise de hardware.";
  }
}
