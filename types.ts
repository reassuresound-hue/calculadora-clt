export interface SalaryInput {
  grossSalary: number;
  dependents: number;
  otherDiscounts: number;
}

export interface CalculationResult {
  grossSalary: number;
  inss: number;
  irrf: number;
  otherDiscounts: number;
  netSalary: number;
  totalDiscounts: number;
  inssAliquotEffective: number;
  irrfAliquotEffective: number;
}

export interface TaxBracket {
  limit: number | null; // null means "and above"
  rate: number;
  deduction?: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill: string;
}