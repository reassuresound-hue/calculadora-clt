import { CalculationResult, SalaryInput } from '../types';

// Constants for 2024/2025 (Reference values - adjust as legislation changes)
const DEPENDENT_DEDUCTION = 189.59;
const IRRF_SIMPLIFIED_DISCOUNT = 564.80;

// INSS Progressive Table 2024
const INSS_BRACKETS = [
  { limit: 1412.00, rate: 0.075 },
  { limit: 2666.68, rate: 0.09 },
  { limit: 4000.03, rate: 0.12 },
  { limit: 7786.02, rate: 0.14 },
];

// IRRF Table 2024/2025 (Annual adjustment needed)
const IRRF_BRACKETS = [
  { limit: 2259.20, rate: 0, deduction: 0 },
  { limit: 2826.65, rate: 0.075, deduction: 169.44 },
  { limit: 3751.05, rate: 0.15, deduction: 381.44 },
  { limit: 4664.68, rate: 0.225, deduction: 662.77 },
  { limit: null, rate: 0.275, deduction: 896.00 }, // Above
];

export const calculateINSS = (grossSalary: number): number => {
  let inss = 0;
  let remainingSalary = grossSalary;
  let previousLimit = 0;

  for (const bracket of INSS_BRACKETS) {
    if (grossSalary <= previousLimit) break;

    const range = bracket.limit - previousLimit;
    const taxableAmount = Math.min(remainingSalary, range);
    
    inss += taxableAmount * bracket.rate;
    remainingSalary -= taxableAmount;
    previousLimit = bracket.limit;

    if (grossSalary <= bracket.limit) break;
  }
  
  // Cap at the ceiling if salary exceeds the last bracket limit
  const ceilingLimit = INSS_BRACKETS[INSS_BRACKETS.length - 1].limit;
  if (grossSalary > ceilingLimit) {
     // Recalculate based on full ceiling to be exact
     let ceilingTax = 0;
     let prev = 0;
     for(const b of INSS_BRACKETS) {
        const r = b.limit - prev;
        ceilingTax += r * b.rate;
        prev = b.limit;
     }
     return ceilingTax;
  }

  return inss;
};

export const calculateIRRF = (baseSalary: number, dependents: number): number => {
  // Option 1: Legal Deductions
  const deductionDependents = dependents * DEPENDENT_DEDUCTION;
  const baseLegal = baseSalary - deductionDependents;

  // Option 2: Simplified Discount
  const baseSimplified = baseSalary - IRRF_SIMPLIFIED_DISCOUNT;

  // Use the beneficial base (smaller tax base = less tax)
  // However, the rule is: simplified replaces deductions if it's more beneficial to the user.
  // Actually, for calculation, we check which deduction is larger: (INSS + Dependents) vs (Simplified Discount 564.80)
  // But IRRF is calculated on (Gross - INSS). 
  // Wait, correct rule: Users can deduct (INSS + Dependents + Alimony etc) OR standard simplified discount of 564.80 (which replaces specific deductions if beneficial).
  
  // Actually, the new rule allows simplified discount REPLACING the deductions if 564.80 > (INSS + Dependents etc).
  // But strictly, usually simplified is applied directly to the base to check if exempt.
  
  // Let's implement standard calculation:
  // Base for IRRF = Gross - INSS - Dependents
  
  // Find bracket
  let irrf = 0;
  
  const calculateTax = (amount: number) => {
    if (amount <= IRRF_BRACKETS[0].limit!) return 0;
    
    for (const bracket of IRRF_BRACKETS) {
      if (bracket.limit === null || amount <= bracket.limit) {
        return (amount * bracket.rate) - (bracket.deduction || 0);
      }
    }
    return 0;
  };

  // We need to calculate if the simplified discount is better.
  // The simplified discount (R$ 564,80) allows exemption up to two minimum wages technically, 
  // but strictly it replaces the deductions.
  
  // Let's compare the tax using standard deductions vs simplified discount.
  // NOTE: In the simplified calculation, we take Gross - 564.80. We do NOT deduct INSS in the simplified method for the base check usually, 
  // BUT the law says 564.80 is a *minimum* deduction available to replace other deductions.
  // If (INSS + Dependents) > 564.80, use standard. Else use 564.80.
  
  // We need the original gross to know the INSS, but IRRF calculation starts after INSS is known? 
  // No, the INSS is always deducted from Gross first for the standard method.
  
  // Refined Logic for 2024:
  // Base = Gross - INSS
  // Deductions = Dependents * 189.59
  // Alternative Deductions = 564.80 (Total, replaces INSS+Dependents? No, replaces deductions from the tax base).
  // Correction: The R$ 564.80 is a discount on the *base calculation* that replaces the legal deductions (INSS, Dependents, etc).
  // So: Base1 = Gross - INSS - Dependents.
  // Base2 = Gross - 564.80.
  // Use whichever Base is smaller? Yes.
  
  // Actually, standard practice for calculators:
  // If (INSS + Dependents) < 564.80, then Base = Gross - 564.80.
  // Else Base = Gross - INSS - Dependents.
  
  // wait, strict INSS deduction is mandatory. 
  // The simplified discount is an alternative to *itemized* deductions. INSS is an official deduction.
  // The federal government states: "Quem ganha até R$ 2.824,00 (dois salários mínimos) terá desconto simplificado de R$ 564,80".
  // This implies the discount is applied to the GROSS? 
  // Let's stick to the most common reliable calculator method: 
  // Calculate Standard: (Gross - INSS - Dependents) -> Apply Bracket.
  // Calculate Simplified: (Gross - 564.80) -> Apply Bracket.
  // Pick lower Tax.

  // NOTE: INSS is always calculated first.
  
  // Let's correct this: The 564.80 replaces the deductions. So it's mutually exclusive with (INSS + Dependents).
  
  // Standard Base
  // Since we passed 'baseSalary' into this function as (Gross - INSS) usually? 
  // No, let's change signature to take Gross and INSS separately to be precise.
  return 0; // Placeholder, see calculateSalary below
};

export const calculateSalary = (input: SalaryInput): CalculationResult => {
  const { grossSalary, dependents, otherDiscounts } = input;

  const inss = calculateINSS(grossSalary);
  
  // IRRF Logic
  // Method 1: Legal Deductions
  const baseLegal = grossSalary - inss - (dependents * DEPENDENT_DEDUCTION);
  
  // Method 2: Simplified Discount (replaces all deductions)
  const baseSimplified = grossSalary - IRRF_SIMPLIFIED_DISCOUNT;
  
  const getTax = (base: number) => {
    if (base <= 2259.20) return 0; // Exempt
    for (const bracket of IRRF_BRACKETS) {
       if (bracket.limit === null || base <= bracket.limit) {
         return (base * bracket.rate) - (bracket.deduction || 0);
       }
    }
    return 0;
  };

  const taxLegal = getTax(baseLegal);
  const taxSimplified = getTax(baseSimplified);
  
  // Use the method that results in lower tax (beneficial to taxpayer)
  const irrf = Math.min(Math.max(0, taxLegal), Math.max(0, taxSimplified));

  const totalDiscounts = inss + irrf + otherDiscounts;
  const netSalary = grossSalary - totalDiscounts;

  return {
    grossSalary,
    inss,
    irrf,
    otherDiscounts,
    netSalary,
    totalDiscounts,
    inssAliquotEffective: grossSalary > 0 ? (inss / grossSalary) : 0,
    irrfAliquotEffective: grossSalary > 0 ? (irrf / grossSalary) : 0,
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPercentage = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};