export interface CompensableFactorModel {
  Name: string;
  Data: CompensableFactorData;
  Selected: boolean;
}

export interface CompensableFactorData {
  ProfileCount: number;
  PercentReporting: number;
  MedianBasePay: number;
  PayDifferential: number;
  PayDifferentialPercentage: number;
}

export function generateMockCompensableFactorModel(): CompensableFactorModel {
  return {
    Name: 'C#',
    Data: {
      ProfileCount: 500,
      PercentReporting: 1.2,
      MedianBasePay: 2.5,
      PayDifferential: 2.5,
      PayDifferentialPercentage: 2.5
    },
    Selected: false
  };
}
