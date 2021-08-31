import { CompensableFactorModel } from '../../../comphub';

export interface CompensableFactorsResponse {
  CompensableFactors: {
    Factor: string,
    CompensableFactorData: CompensableFactorModel[]
  };
}

export function generateMockCompensableFactorsResponse(): any {
  return { 'Certs': [
        { Name: 'Engineer in Training (EIT)',
          Data: { ProfileCount: 38,
            MedianBasePay: 73846.734,
            PayDifferential: -3419.5256,
            PayDifferentialPercentage: -4.4256387,
            PercentReporting: null },
          Selected: true } ],
     'Skills': [
          { Name: 'Test Planning',
            Data: { ProfileCount: 238,
              MedianBasePay: 74625.49,
              PayDifferential: -2640.769,
              PayDifferentialPercentage: -3.4177518,
              PercentReporting: null },
            Selected: true },
          { Name: 'System Testing',
            Data: { ProfileCount: 204,
              MedianBasePay: 73494.94,
              PayDifferential: -3771.323,
              PayDifferentialPercentage: -4.8809443,
              PercentReporting: null },
            Selected: true }
        ],
    'Education': [
          { Name: 'Master\'s Degree (non-MBA)',
            Data: null,
            Selected: true } ],
    'Years_Experience': [
        { Name: '2',
          Data: null,
          Selected: true } ],
    'Supervisory_Role': [
        { Name: 'Yes',
          Data: null,
          Selected: true } ]
    };
}

