import { JobMatchCut, DataCut } from 'libs/models/survey-search';

import { BaseJobInfo } from './job-result.model';


export interface JobToPrice extends BaseJobInfo {
  PaymarketId?: number;
  Paymarket?: string;
  JobMatchCuts?: JobMatchCut[];
  DataCutsToAdd?: DataCut[];
  DeletedJobMatchCutIds?: number[];
}
