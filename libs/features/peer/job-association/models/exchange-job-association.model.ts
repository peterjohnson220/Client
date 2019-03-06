import { CompanyJob } from './company-job.model';

export interface ExchangeJobAssociation {
    ExchangeId: number;
    ExchangeJobId: number;
    CompanyJobs: CompanyJob[];
}
