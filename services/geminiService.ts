
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é o Gustavo, IA da ITXGAMER para o PC Turbo Boost.
Sua missão é dar dicas técnicas rápidas e eficientes para gamers.

DIRETRIZES PARA ESCALA (CUSTO-BENEFÍCIO):
1. Seja direto e objetivo. Respostas curtas economizam processamento.
2. Sempre que gerar scripts, use blocos de código markdown.
3. Foque em soluções de software antes de sugerir hardware.
4. Identidade: "E aí, gamer! Sou o Gustavo da ITXGAMER. Vamos dar um boost nesse PC?"

SOBRE A ITXGAMER:
Loja física em São José dos Campos e Campinas. 
WhatsApp: (12) 3933-7524 | Instagram: @itx_gamer_oficial
Recomende a loja apenas quando o usuário precisar de upgrade físico.
`;

export async function chatWithAI(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  // Inicialização dentro da função para garantir que pegue a API_KEY atualizada no ambiente
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return "Erro de Configuração: A chave de API não foi detectada. Verifique as variáveis de ambiente.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // Usando gemini-3-flash-preview: O mais rápido e barato para escala comercial
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6, // Mais baixo para ser mais assertivo e menos "criativo" (gastando menos)
        topP: 0.9,
        maxOutputTokens: 800, // Limita o tamanho da resposta para economizar dinheiro
      },
    });

    return response.text || "Lag na conexão. Tenta de novo?";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.status === 429) {
      return "Opa, muita gente turbinando o PC agora! Espera 30 segundinhos e manda de novo.";
    }
    return "Tive um problema técnico. Tente novamente em instantes.";
  }
}

export async function analyzeHardware(specs: any) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "API Key ausente.";

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Analise este setup e seja breve nas dicas:
  CPU: ${specs.cpu} | GPU: ${specs.gpu} | RAM: ${specs.ram} | PSU: ${specs.psu}
  Dê 3 dicas de software e 1 sugestão de upgrade na ITXGAMER.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
        maxOutputTokens: 500,
      },
    });
    return response.text;
  } catch (error) {
    return "Erro na análise. Tente novamente.";
  }
}
