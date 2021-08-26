import { CompensableFactorModel } from '../../../comphub';

export interface CompensableFactorsResponseModel {
  CompensableFactors: { Factor: string, CompensableFactorData: CompensableFactorModel[] };
}

