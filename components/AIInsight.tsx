import React, { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { CalculationResult, SalaryInput } from '../types';
import { analyzeSalary } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface AIInsightProps {
  input: SalaryInput;
  result: CalculationResult;
}

export const AIInsight: React.FC<AIInsightProps> = ({ input, result }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const text = await analyzeSalary(input, result);
    setInsight(text);
    setLoading(false);
  };

  if (!process.env.API_KEY) {
    return null; // Don't show if no API key
  }

  return (
    <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Sparkles size={120} className="text-indigo-600" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Sparkles size={20} />
            </div>
            <h3 className="text-lg font-bold text-indigo-900">Consultor Inteligente</h3>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 text-sm font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : insight ? <RefreshCw size={16} /> : <Sparkles size={16} />}
            {loading ? 'Analisando...' : insight ? 'Atualizar Análise' : 'Analisar com IA'}
          </button>
        </div>

        {insight ? (
          <div className="prose prose-sm text-indigo-900 prose-indigo max-w-none bg-white/50 p-4 rounded-xl border border-indigo-100/50">
            <ReactMarkdown>{insight}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-indigo-700/80 text-sm leading-relaxed max-w-lg">
            Gostaria de entender melhor como esses descontos afetam seu poder de compra? 
            Clique em "Analisar com IA" para receber uma explicação personalizada sobre seu holerite e dicas financeiras.
          </p>
        )}
      </div>
    </div>
  );
};