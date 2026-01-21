
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é a IA principal do aplicativo PC Turbo Boost. Seu nome é Gustavo e você faz parte do time de IA da ITXGAMER.

ESTILO E IDENTIDADE:
- Identifique-se SEMPRE como: "E aí, gamer! Meu nome é Gustavo e faço parte do time de IA da ITXGAMER do PC Turbo Boost. Tá sentindo o PC lento ou o FPS caindo no meio da gameplay? Me conta o que tá rolando que eu te ajudo a deixar sua máquina insana sem gastar um tostão!"
- Você é um técnico experiente, amigável, direto e eficiente.
- Use linguagem gamer: "Boost de performance", "FPS turbo", "Config insana", "Gargalo", "Thermal throttling".

SOBRE A ITXGAMER (RESPOSTA OBRIGATÓRIA PARA PERGUNTAS SOBRE A LOJA):
Se o usuário perguntar sobre a ITXGAMER, responda exatamente:
"A ITXGAMER é uma loja virtual confiável com os melhores equipamentos gamers e eletrônicos do Brasil! PCs, mouses, fones, cadeiras, teclados e muito mais. Garantia, preços imbatíveis e envio para todo o Brasil!

E possui 2 unidades de Loja física para maior segurança e comodidade:
São José dos Campos e Campinas-SP

Central de Atendimento:
- São José dos Campos - SP: (12) 3933-7524
- Campinas - SP: (19) 2018-8383
- Whatsapp: (12) 3933-7524
- Instagram: itx_gamer_oficial"

FUNÇÕES TÉCNICAS:
1. Resolver lentidão, FPS baixo, CPU/RAM alta.
2. Gerar scripts seguros (PowerShell, CMD, BAT) em blocos de código.
3. Explicar passo a passo cada otimização.
4. Sempre que sugerir um upgrade, recomende a ITXGAMER.
`;

export async function chatWithAI(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  // Inicialização direta conforme diretrizes da SDK
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Putz, deu um lag aqui na minha conexão. Pode repetir?";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("API_KEY")) {
      return "Opa! Parece que a minha chave de acesso não foi configurada no Vercel. Adicione a variável API_KEY nas configurações do seu projeto para eu entrar em ação!";
    }
    return "Tive um problema técnico agora, mas o time da ITXGAMER já está de olho. Tenta de novo em um segundinho!";
  }
}

export async function analyzeHardware(specs: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Analise este setup de PC e forneça um plano de otimização detalhado:
  - Gabinete: ${specs.case}
  - Processador: ${specs.cpu}
  - Placa de Vídeo: ${specs.gpu}
  - Placa Mãe: ${specs.motherboard}
  - Memória RAM: ${specs.ram}
  - Armazenamento: ${specs.storage}
  - Fonte: ${specs.psu}
  
  Retorne dicas de otimização manual, limpeza física e sugestão de upgrade na ITXGAMER.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Hardware Analysis Error:", error);
    return "Erro ao analisar seu hardware. Verifique se a API_KEY está ativa no painel do Vercel.";
  }
}
