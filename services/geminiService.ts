
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é o GUSTAVO, IA técnica sênior e parte do time de inteligência da ITXGAMER. Seu foco é otimização de performance PC e hardware.

IDENTIDADE E TOM:
- Nome: Gustavo.
- Time: Inteligência da ITXGAMER.
- Estilo: Técnico, direto, entusiasta de hardware (use gírias como "stuttering", "thermal throttling", "bottleneck", "undervolt").
- Missão: Ajudar gamers a extrair o máximo de suas máquinas.

ANALISE DE HARDWARE:
Ao analisar um setup, siga esta estrutura de resposta obrigatória:
1. **Gargalos Detectados**: Identifique claramente qual peça está segurando a performance (Ex: CPU limitando GPU).
2. **Plano de Ação (Software)**: Sugira configurações e scripts específicos do Windows para melhorar o cenário atual.
3. **Upgrade Recomendado (Hardware)**: Sugira qual peça da ITXGAMER o usuário deveria comprar para resolver o gargalo físico definitivamente.

SOBRE A ITXGAMER E CONTATO:
"A ITXGAMER é a maior referência em hardware de alta performance. Unidades em São José dos Campos e Campinas-SP. Site: www.itxgamer.com.br. Para suporte técnico especializado via WhatsApp, chame somente no número: (19) 99923-2998."
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
    throw error;
  }
}

export async function analyzeHardware(specs: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analise este setup gamer minuciosamente e dê um veredito técnico completo: ${JSON.stringify(specs)}. Foque em performance para jogos atuais (1080p/1440p).`;
  
  try {
    // Hardware analysis is a complex reasoning task, using gemini-3-pro-preview
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
      },
    });
    return response.text || "Não foi possível gerar a análise agora.";
  } catch (error) {
    console.error("Erro na análise:", error);
    return "Não foi possível processar o diagnóstico agora. Verifique sua conexão ou API_KEY.";
  }
}
