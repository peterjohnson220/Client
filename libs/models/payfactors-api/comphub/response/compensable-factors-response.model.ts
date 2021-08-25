import { CompensableFactorModel } from '../../../comphub';

export interface CompensableFactorsResponse {
  CompensableFactors: {
    Factor: string,
    CompensableFactorData: CompensableFactorModel[]
  };
}

