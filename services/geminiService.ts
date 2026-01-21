
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é o Gustavo, a IA oficial do PC Turbo Boost da ITXGAMER.
Sua missão: Ajudar gamers a extrair o máximo de FPS e desempenho de seus computadores.

ESTILO DE RESPOSTA (FOCO EM VENDA E ESCALA):
1. Linguagem Gamer: Use termos como "FPS", "Stuttering", "Input Lag", "Overclock", "Gargalo".
2. Respostas Diretas: O usuário quer velocidade. Dê a solução e explique o "porquê" brevemente.
3. Scripts Seguros: Sempre que sugerir uma alteração no Windows, forneça o código em bloco Markdown.
4. Call to Action: Se o problema for hardware (ex: 4GB de RAM), sugira um upgrade na ITXGAMER.

REGRAS DE NEGÓCIO:
- Se o usuário perguntar quem te criou: "Fui desenvolvido pelo time de engenharia da ITXGAMER para ser o braço direito de todo gamer brasileiro!"
- Localização ITXGAMER: São José dos Campos e Campinas. WhatsApp: (12) 3933-7524.
`;

export async function chatWithAI(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const apiKey = process.env.API_KEY;
  
  // Se a chave não estiver configurada, o Gustavo dá um toque amigável em vez de um erro genérico
  if (!apiKey || apiKey === "SUA_CHAVE_AQUI") {
    return "E aí, gamer! O sistema está em modo de manutenção (API_KEY não configurada no servidor). Se você é o dono, dá um pulo no painel da Vercel e adicione a chave. Se você é cliente, avisa o suporte que o Gustavo precisa de combustível! 🚀";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // Modelo gemini-3-flash-preview: O melhor custo-benefício para quem vai vender o app
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 1000, // Respostas completas mas controladas para economizar tokens
      },
    });

    return response.text || "Deu um lag aqui na resposta. Pode repetir a pergunta?";
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);
    
    if (error.status === 429) {
      return "Opa! Muita gente turbinando o PC ao mesmo tempo. Respira fundo, espera 10 segundos e manda de novo que eu resolvo!";
    }
    
    return "Tive um problema na comunicação com o servidor de IA. Verifica sua conexão ou tenta novamente em alguns instantes!";
  }
}

export async function analyzeHardware(specs: any) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "Sistema de análise offline. Configure a API_KEY.";

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Analise este setup gamer e dê dicas de otimização:
  Gabinete: ${specs.case} | CPU: ${specs.cpu} | GPU: ${specs.gpu} | RAM: ${specs.ram} | Armazenamento: ${specs.storage} | Fonte: ${specs.psu}
  Dê 3 dicas de software imediatas e 1 recomendação de upgrade na ITXGAMER.`;

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
    return "Erro ao processar análise técnica. Tente novamente mais tarde.";
  }
}
