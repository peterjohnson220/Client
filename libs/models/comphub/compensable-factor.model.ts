
export interface CompensableFactorModel {
  Answer: string;
  Count: number;
  PercentageChange?: number;
}

export function generateMockCompensableFactorModel(): CompensableFactorModel {
  return {
    Answer: 'C#',
    Count: 500,
    PercentageChange: 1.00
  };
}
