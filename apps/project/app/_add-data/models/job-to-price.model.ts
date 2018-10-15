import { BaseJobInfo } from './job-result.model';

export interface JobToPrice extends BaseJobInfo {
  PaymarketId?: number;
  Paymarket?: string;
}
