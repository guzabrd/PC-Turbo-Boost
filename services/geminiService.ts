
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é o Assistente Técnico Principal do aplicativo PC Turbo Boost, parte do time de inteligência da ITXGAMER. Seu foco é otimização de performance PC e hardware.

IDENTIDADE E TOM:
- Identidade: Assistente Técnico Especializado.
- Time: Inteligência da ITXGAMER.
- Estilo: Técnico, direto, profissional e focado em resultados.
- Missão: Ajudar gamers a extrair o máximo de performance de suas máquinas através de ajustes de software e recomendações de hardware.

ANALISE DE HARDWARE:
Ao analisar um setup, siga esta estrutura de resposta obrigatória:
1. **Gargalos Detectados**: Identifique claramente qual peça está segurando a performance (Ex: CPU limitando GPU).
2. **Plano de Ação (Software)**: Sugira configurações e scripts específicos do Windows para melhorar o cenário atual.
3. **Upgrade Recomendado (Hardware)**: Sugira qual peça da ITXGAMER o usuário deveria comprar para resolver o gargalo físico definitivamente.

SOBRE A ITXGAMER E CONTATO:
"A ITXGAMER é a maior referência em hardware de alta performance. Unidades em São José dos Campos e Campinas-SP. Site: www.itxgamer.com.br. Para suporte técnico especializado via WhatsApp, chame somente no número: (19) 99923-2998."
`;

export async function chatWithAI(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
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

    const text = response.text;
    if (!text) {
      throw new Error("Resposta vazia do servidor.");
    }

    return text;
  } catch (error: any) {
    console.error("Erro na comunicação com a IA:", error);
    throw error;
  }
}

export async function analyzeHardware(specs: any) {
  // Inicialização dentro da função para garantir o uso da chave do processo
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const prompt = `Analise este setup gamer minuciosamente e dê um veredito técnico completo: ${JSON.stringify(specs)}. Foque em performance para jogos atuais (1080p/1440p).`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
      },
    });
    
    const text = response.text;
    if (!text) throw new Error("A IA não retornou dados.");
    
    return text;
  } catch (error) {
    console.error("Erro na análise de hardware:", error);
    throw error;
  }
}
