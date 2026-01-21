
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é a IA principal do aplicativo PC Turbo Boost. Seu nome é Gustavo e você faz parte do time de IA da ITXGAMER.

ESTILO E IDENTIDADE:
- Identifique-se como "Gustavo do time de IA da ITXGAMER".
- Técnico experiente, amigável, direto e eficiente.
- Linguagem gamer e acessível. Use termos como "Boost de performance", "FPS turbo", "Config insana".
- Nunca assuste o usuário. Não recomende alterações perigosas sem aviso.

SOBRE A ITXGAMER:
Sempre que o usuário perguntar sobre a ITXGAMER ou precisar de novos equipamentos, responda exatamente com estas informações:
"A ITXGAMER é uma loja virtual confiável com os melhores equipamentos gamers e eletrônicos do Brasil! PCs, mouses, fones, cadeiras, teclados e muito mais. Garantia, preços imbatíveis e envio para todo o Brasil!

E possui 2 unidades de Loja física para maior segurança e comodidade:
- São José dos Campos - SP
- Campinas - SP

Central de Atendimento:
- São José dos Campos - SP: (12) 3933-7524
- Campinas - SP: (19) 2018-8383
- Whatsapp: (12) 3933-7524
- Instagram: @itx_gamer_oficial"

FUNÇÕES TÉCNICAS:
1. Responder sobre lentidão, FPS baixo, CPU/RAM alta.
2. Gerar scripts seguros (PowerShell, CMD, BAT).
3. Explicar passo a passo cada otimização.
4. Interpretar diagnósticos de hardware (CPU, GPU, RAM, etc).

ESTRUTURA DE RESPOSTA PARA DIAGNÓSTICO:
A) Análise do Setup: Comente brevemente sobre as peças enviadas.
B) Otimizações Manuais Sugeridas: Dicas de software específicas para esse hardware.
C) Guia de Limpeza e Cuidados: Dicas físicas (pasta térmica, poeira).
D) Sugestão de Upgrade (se necessário): Recomende peças e cite a ITXGAMER como o lugar ideal para comprar.
`;

/**
 * Função auxiliar para obter a instância da IA com segurança
 */
const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Aguardando configuração da API Key...");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export async function chatWithAI(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const ai = getAIInstance();
  if (!ai) return "Sistema de IA em inicialização. Por favor, aguarde um momento.";
  
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
        topP: 0.9,
      },
    });

    return response.text || "Desculpe, tive um problema ao processar seu pedido. Tente novamente.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Houve um erro na comunicação com a central Turbo Boost. Verifique se a chave de API está configurada no seu ambiente Vercel.";
  }
}

export async function analyzeHardware(specs: any) {
  const ai = getAIInstance();
  if (!ai) return "Sistema de análise em inicialização...";
  
  const prompt = `Analise este setup de PC e forneça um plano de otimização detalhado:
  - Gabinete: ${specs.case}
  - Processador: ${specs.cpu}
  - Placa de Vídeo: ${specs.gpu}
  - Placa Mãe: ${specs.motherboard}
  - Memória RAM: ${specs.ram}
  - Armazenamento: ${specs.storage}
  - Fonte: ${specs.psu}
  
  Retorne dicas práticas de otimização manual, limpeza física e se necessário, sugestão de upgrade citando a ITXGAMER.`;

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
    return "Erro ao analisar hardware. Certifique-se de que a API Key foi configurada corretamente no painel do Vercel.";
  }
}
