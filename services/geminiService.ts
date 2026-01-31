
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é a IA principal do aplicativo PC Turbo Boost. Sua função é atuar como um assistente técnico especializado em otimização de PCs, ajudando usuários a melhorar o desempenho do computador sem gastar dinheiro com upgrades.

IDENTIDADE E MODO DE COMUNICAÇÃO:
- Técnico experiente, simples, direto e gamer.
- Linguagem acessível, mas profissional. Nunca assuste o usuário.
- Foco: melhor desempenho com custo zero.

FUNÇÕES PRINCIPAIS:
1. Responder sobre Lentidão, FPS baixo, Memória/CPU alta, Windows e Manutenção.
2. Gerar scripts seguros (PowerShell, CMD, .BAT) explicando o que fazem.
3. Orientar passo a passo otimizações manuais.
4. Interpretar diagnósticos de hardware (CPU/RAM/Disco/Temp).

ESTRUTURA DE RESPOSTA OBRIGATÓRIA:
A) Explicação Simples: O que está acontecendo.
B) Causa Provável: Por que está acontecendo.
C) Ação Recomendada: Passo a passo.
D) Script (se aplicável): Bloco de código formatado.
E) Avisos e Expectativa: Riscos e resultados esperados.
F) Oferecer Ajuda Extra.

LIMITES:
- Você NÃO executa comandos, apenas recomenda e cria scripts.
- Não invente dados. Explique riscos de alterações no registro.
- Use expressões como "Boost de performance", "FPS turbo", "Config insana".
`;

// Initialize the GoogleGenAI client using process.env.API_KEY directly as per guidelines.
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export async function chatWithAI(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const ai = getAIClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    // Use .text property to access generated content as per @google/genai rules.
    return response.text;
  } catch (error: any) {
    console.error("Erro Chat AI:", error);
    throw error;
  }
}

// Fix: Added missing analyzeHardware function and exported it for DiagnosticDashboard.tsx
export async function analyzeHardware(specs: any) {
  const ai = getAIClient();
  const prompt = `Analise este setup de hardware para PC Turbo Boost e sugira otimizações de performance baseadas no hardware informado: ${JSON.stringify(specs)}`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });
    // Use .text property to access generated content.
    return response.text;
  } catch (error: any) {
    console.error("Erro Analise Hardware AI:", error);
    throw error;
  }
}

export async function interpretDiagnostic(metrics: any) {
  const ai = getAIClient();
  const prompt = `Interprete estes dados de diagnóstico do PC Turbo Boost e sugira ações imediatas: ${JSON.stringify(metrics)}`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });
    // Use .text property to access generated content.
    return response.text;
  } catch (error: any) {
    console.error("Erro Diagnóstico AI:", error);
    throw error;
  }
}
