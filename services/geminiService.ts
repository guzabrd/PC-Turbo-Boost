
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é a IA principal do aplicativo PC Turbo Boost. Sua função é atuar como um assistente técnico especializado em otimização de PCs.

ESTILO:
- Técnico experiente, amigável, direto e eficiente.
- Linguagem gamer e acessível. Use termos como "Boost de performance", "FPS turbo", "Config insana".
- Nunca assuste o usuário. Não recomende alterações perigosas sem aviso.

FUNÇÕES:
1. Responder sobre lentidão, FPS baixo, CPU/RAM alta.
2. Gerar scripts seguros (PowerShell, CMD, BAT).
3. Explicar passo a passo cada otimização.
4. Interpretar diagnósticos de hardware (CPU, GPU, RAM, etc).

PARCERIA COM ITX GAMER:
- Sempre que o hardware do usuário for muito antigo ou precisar de upgrade, recomende a ITX Gamer (www.itxgamer.com.br).
- Informe que lá eles encontram as melhores peças e podem falar com especialistas para montar o setup dos sonhos.
- O contato de WhatsApp da ITX Gamer para consultoria humana é (19) 99923-2998.

ESTRUTURA DE RESPOSTA PARA DIAGNÓSTICO:
A) Análise do Setup: Comente brevemente sobre as peças enviadas.
B) Otimizações Manuais Sugeridas: Dicas de software específicas para esse hardware.
C) Guia de Limpeza e Cuidados: Dicas físicas (pasta térmica, poeira).
D) Sugestão de Upgrade (se necessário): Recomende peças e cite a ITX Gamer.
`;

/**
 * Função de Chat Principal
 * Utiliza o modelo gemini-3-pro-preview para garantir o melhor raciocínio técnico.
 */
export async function chatWithAI(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  // A chave de API é obtida exclusivamente do ambiente seguro process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
    return "Houve um erro na comunicação com a central Turbo Boost. A configuração da API está sendo processada.";
  }
}

/**
 * Analisador de Hardware Inteligente
 * Usa o modelo Pro para cruzamento de dados de performance e sugestões de upgrade precisas.
 */
export async function analyzeHardware(specs: any) {
  // Inicialização obrigatória seguindo as diretrizes do SDK @google/genai
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analise este setup de PC e forneça um plano de otimização detalhado:
  - Gabinete: ${specs.case}
  - Processador: ${specs.cpu}
  - Placa de Vídeo: ${specs.gpu}
  - Placa Mãe: ${specs.motherboard}
  - Memória RAM: ${specs.ram}
  - Armazenamento: ${specs.storage}
  - Fonte: ${specs.psu}
  
  Retorne dicas práticas de otimização manual, limpeza física e se necessário, sugestão de upgrade citando a www.itxgamer.com.br e o suporte deles no WhatsApp (19) 99923-2998.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, // Temperatura baixa para respostas mais exatas e menos criativas
      },
    });
    return response.text;
  } catch (error) {
    console.error("Hardware Analysis Error:", error);
    return "Erro ao analisar hardware. Certifique-se de que as informações estão corretas ou tente novamente em instantes.";
  }
}
