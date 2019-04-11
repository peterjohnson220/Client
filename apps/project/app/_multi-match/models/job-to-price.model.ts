import { JobMatchCut, DataCut } from 'libs/models/payfactors-api';

import { BaseJobInfo } from '../../survey-search/models/job-result.model';
import { DataCutDetails } from '../../survey-search/models';


export interface JobToPrice extends BaseJobInfo {
  PaymarketId?: number;
  Paymarket?: string;
  JobMatchCuts?: JobMatchCut[];
  DataCutsToAdd?: DataCutDetails[];
  DeletedJobMatchCutIds?: number[];
}

export function generateMockJobToPrice(): JobToPrice {
  return {
    Id: 100,
    Title: 'Blend of Gas Operations Top Executive-Corporate, G',
    Code: '13001',
    Family: 'Accounting',
    Level: 'I',
    Description: 'Job Description: Accountant',
    LoadingDataCuts: false,
    LoadingDataCutsError: false,
    DeletedJobMatchCutIds: [],
    DataCutsToAdd: [],
    TotalDataCuts: 1,
    PaymarketId: 1,
    JobMatchCuts: []
  };
}
