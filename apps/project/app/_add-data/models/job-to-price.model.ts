import { BaseJobInfo } from './job-result.model';
import { JobMatchCut } from 'libs/models/survey-search';


export interface JobToPrice extends BaseJobInfo {
  PaymarketId?: number;
  Paymarket?: string;
  DataCuts?: JobMatchCut[];
}
