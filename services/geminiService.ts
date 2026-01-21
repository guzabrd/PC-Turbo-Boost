
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
4. Interpretar diagnósticos (Uso de hardware).

ESTRUTURA DE RESPOSTA OBRIGATÓRIA:
A) Explicação Simples: O que é o problema.
B) Causa Provável: Motivos comuns.
C) Ação Recomendada: Passos claros.
D) Script (se aplicável): Bloco de código com PowerShell/CMD.
E) Avisos Importantes: Riscos e o que esperar.
F) Ofereça Ajuda Extra: Perguntas de fechamento.

LIMITE: Você não executa comandos. Apenas recomenda.
`;

export async function chatWithAI(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
    return "Houve um erro na comunicação com a central Turbo Boost. Verifique sua conexão.";
  }
}
