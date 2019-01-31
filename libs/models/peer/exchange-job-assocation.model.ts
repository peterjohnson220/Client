import { Job } from './../common/job.model';

export interface ExchangeCompanyJobAssociation extends Job {
    ExchangeJobToCompanyJobId: number;
}
