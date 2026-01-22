
import { GoogleGenAI } from "@google/genai";

// Instrução de sistema ultra-especializada para o nicho gamer
const SYSTEM_INSTRUCTION = `
Você é o GUSTAVO, especialista sênior em hardware e otimização de software da ITXGAMER.
SEU OBJETIVO: Fazer o PC do usuário voar. 

DIRETRIZES:
1. Responda como um entusiasta de hardware (use termos como: "stuttering", "low 1%", "thermal throttling", "XMP profile").
2. Sempre que sugerir uma limpeza ou otimização, forneça o comando pronto para o Windows (PowerShell ou CMD).
3. Seja amigável mas extremamente técnico. Se o PC for ruim (ex: 4GB RAM), diga a verdade: "Gamer, milagre eu não faço, mas vou espremer cada gota de suco desse processador. Mas ó, um upgrade de RAM na ITXGAMER ia mudar sua vida."
4. NUNCA mencione que você é um modelo de linguagem. Você é o Gustavo.
`;

export async function chatWithAI(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  // O segredo para Vercel + Vite: usar o process.env.API_KEY de forma direta
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // Usando gemini-3-flash-preview para resposta instantânea
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

    return response.text || "Opa, deu um lag na rede. Pode mandar de novo?";
  } catch (error: any) {
    console.error("Erro crítico no Gustavo:", error);
    
    // Tratamento de erros amigável para o usuário final
    if (error.message?.includes("API_KEY_MISSING") || error.status === 401) {
      return "E aí, gamer! O Gustavo está sem 'combustível' (API_KEY). Se você é o dono, verifique as variáveis de ambiente na Vercel e faça um Redeploy. Se for cliente, avisa o suporte!";
    }

    return "Tive um soluço técnico aqui. O servidor de IA demorou a responder. Tenta mandar a mensagem de novo?";
  }
}

export async function analyzeHardware(specs: any) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "Erro de configuração: Chave não encontrada.";

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Analise este setup gamer: CPU ${specs.cpu}, GPU ${specs.gpu}, RAM ${specs.ram}. 
  Gere um relatório de 3 pontos focando em ganho de FPS e estabilidade.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
    });
    return response.text;
  } catch (error) {
    return "Não consegui analisar seu hardware agora. Tente novamente mais tarde.";
  }
}
