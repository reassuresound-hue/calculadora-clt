import { GoogleGenAI } from "@google/genai";
import { CalculationResult, SalaryInput } from "../types";
import { formatCurrency } from "../utils/taxRules";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeSalary = async (input: SalaryInput, result: CalculationResult): Promise<string> => {
  if (!apiKey) {
    return "API Key não configurada. Não é possível gerar análise com IA.";
  }

  const prompt = `
    Aja como um contador especialista e consultor financeiro brasileiro.
    Analise o seguinte cálculo salarial para um funcionário CLT:
    
    DADOS:
    - Salário Bruto: ${formatCurrency(result.grossSalary)}
    - Dependentes: ${input.dependents}
    - Desconto INSS: ${formatCurrency(result.inss)} (Alíquota Efetiva: ${(result.inssAliquotEffective * 100).toFixed(2)}%)
    - Desconto IRRF: ${formatCurrency(result.irrf)} (Alíquota Efetiva: ${(result.irrfAliquotEffective * 100).toFixed(2)}%)
    - Outros Descontos: ${formatCurrency(result.otherDiscounts)}
    - Salário Líquido Final: ${formatCurrency(result.netSalary)}
    
    TAREFA:
    1. Explique brevemente, em linguagem simples, para onde está indo o dinheiro (INSS é aposentadoria, IRRF é imposto, etc).
    2. Dê uma dica financeira rápida baseada no salário líquido (ex: regra 50/30/20 ou reserva de emergência).
    3. Se o imposto de renda for alto, mencione brevemente se há algo que possa ser feito (ex: dependentes, gastos médicos na declaração anual).
    
    Mantenha a resposta concisa, amigável e formatada com markdown simples (negrito/listas). Máximo de 200 palavras.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Ocorreu um erro ao consultar o assistente de IA.";
  }
};