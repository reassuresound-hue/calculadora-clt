import React, { useState, useEffect } from 'react';
import { Wallet, Users, MinusCircle, DollarSign, Calculator, Info, TrendingDown, PiggyBank } from 'lucide-react';
import { SalaryInput, CalculationResult } from './types';
import { calculateSalary, formatCurrency, formatPercentage } from './utils/taxRules';
import { SummaryCard } from './components/SummaryCard';
import { SalaryPieChart } from './components/Charts';
import { AIInsight } from './components/AIInsight';

export const App: React.FC = () => {
  const [input, setInput] = useState<SalaryInput>({
    grossSalary: 3000,
    dependents: 0,
    otherDiscounts: 0,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    setResult(calculateSalary(input));
  }, [input]);

  const handleInputChange = (field: keyof SalaryInput, value: number) => {
    setInput(prev => ({
      ...prev,
      [field]: Math.max(0, value)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <Calculator className="text-white h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Calculadora Salarial CLT
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Calcule seu salário líquido com precisão considerando as regras atuais de INSS e IRRF (2024/2025).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <DollarSign className="text-blue-600" size={20} />
                  Seus Dados
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="grossSalary" className="block text-sm font-medium text-gray-700 mb-2">
                    Salário Bruto (R$)
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input
                      type="number"
                      name="grossSalary"
                      id="grossSalary"
                      className="block w-full rounded-lg border-gray-300 pl-10 pr-12 py-3 focus:border-blue-500 focus:ring-blue-500 sm:text-lg bg-gray-50"
                      placeholder="0,00"
                      value={input.grossSalary || ''}
                      onChange={(e) => handleInputChange('grossSalary', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="dependents" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Dependentes
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Users className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="number"
                      name="dependents"
                      id="dependents"
                      className="block w-full rounded-lg border-gray-300 pl-10 py-3 focus:border-blue-500 focus:ring-blue-500 sm:text-lg bg-gray-50"
                      placeholder="0"
                      value={input.dependents || ''}
                      onChange={(e) => handleInputChange('dependents', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Cada dependente deduz R$ 189,59 da base do IRRF.
                  </p>
                </div>

                <div>
                  <label htmlFor="otherDiscounts" className="block text-sm font-medium text-gray-700 mb-2">
                    Outros Descontos (R$)
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MinusCircle className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="number"
                      name="otherDiscounts"
                      id="otherDiscounts"
                      className="block w-full rounded-lg border-gray-300 pl-10 py-3 focus:border-blue-500 focus:ring-blue-500 sm:text-lg bg-gray-50"
                      placeholder="0,00"
                      value={input.otherDiscounts || ''}
                      onChange={(e) => handleInputChange('otherDiscounts', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Ex: Vale transporte, plano de saúde, pensão.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 space-y-6">
            {result && (
              <>
                {/* Net Salary Highlight */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 shadow-lg text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Wallet size={120} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-blue-100 font-medium text-lg mb-1">Seu Salário Líquido Estimado</p>
                    <h2 className="text-5xl font-bold tracking-tight mb-2">
                      {formatCurrency(result.netSalary)}
                    </h2>
                    <p className="text-blue-100 opacity-90">
                      Isto representa {formatPercentage(result.netSalary / result.grossSalary)} do seu salário bruto.
                    </p>
                  </div>
                </div>

                {/* Breakdown Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   <SummaryCard 
                     title="INSS" 
                     value={formatCurrency(result.inss)} 
                     subValue={`Alíquota: ${formatPercentage(result.inssAliquotEffective)}`}
                     icon={PiggyBank}
                     colorClass="border-amber-200"
                     textColorClass="text-amber-600"
                   />
                   <SummaryCard 
                     title="IRRF" 
                     value={formatCurrency(result.irrf)} 
                     subValue={`Alíquota: ${formatPercentage(result.irrfAliquotEffective)}`}
                     icon={TrendingDown}
                     colorClass="border-red-200"
                     textColorClass="text-red-600"
                   />
                   <SummaryCard 
                     title="Outros" 
                     value={formatCurrency(result.otherDiscounts)} 
                     icon={MinusCircle}
                     colorClass="border-gray-200"
                     textColorClass="text-gray-600"
                   />
                   <SummaryCard 
                     title="Total Descontos" 
                     value={formatCurrency(result.totalDiscounts)} 
                     icon={Info}
                     colorClass="border-slate-200"
                     textColorClass="text-slate-700"
                   />
                </div>

                {/* Details and Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Detailed Table */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Detalhamento</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-600">Salário Bruto</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(result.grossSalary)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-600 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          Desconto INSS
                        </span>
                        <span className="font-medium text-red-500">-{formatCurrency(result.inss)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-600 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Desconto IRRF
                        </span>
                        <span className="font-medium text-red-500">-{formatCurrency(result.irrf)}</span>
                      </div>
                      {result.otherDiscounts > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                          <span className="text-gray-600 flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                             Outros
                          </span>
                          <span className="font-medium text-red-500">-{formatCurrency(result.otherDiscounts)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-4">
                        <span className="text-lg font-bold text-gray-900">Líquido a receber</span>
                        <span className="text-lg font-bold text-green-600">{formatCurrency(result.netSalary)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 self-start">Distribuição</h3>
                    <SalaryPieChart data={result} />
                  </div>
                </div>

                {/* AI Section */}
                <AIInsight input={input} result={result} />
              </>
            )}
          </div>
        </div>
        
        {/* Footer info */}
        <div className="mt-12 text-center text-sm text-gray-400">
           <p>Os cálculos são estimativas baseadas nas tabelas de 2024/2025. Consulte sempre um contador para valores oficiais.</p>
        </div>
      </div>
    </div>
  );
};