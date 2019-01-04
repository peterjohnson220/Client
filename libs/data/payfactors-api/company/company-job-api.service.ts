import { Injectable } from '@angular/core';

import { CompanyJob, CompanyJobSummary, Match, CompanyJobToMapTo } from 'libs/models';

import { PayfactorsApiService } from '../payfactors-api.service';
import { Observable } from 'rxjs';


@Injectable()
export class CompanyJobApiService {
    private endpoint = 'CompanyJob';

    constructor(
        private payfactorsApiService: PayfactorsApiService
    ) { }

    getCompanyJobWithJDMDescription(companyJobId: number) {
        return this.payfactorsApiService.get<CompanyJobSummary>(`${this.endpoint}/GetJobWithJDMDescription`, {
            params: {
                CompanyJobId: companyJobId
            }
        });
    }

    getTopCompanyJobsToMapTo(exchangeId: number, jobTitleAndCodeQuery: string,
        jobDescriptionQuery: string): Observable<CompanyJobToMapTo[]> {
        return this.payfactorsApiService.get<CompanyJobToMapTo[]>(`${this.endpoint}/GetTopCompanyJobsToMapTo`,
            { params: { exchangeId, jobTitleAndCodeQuery, jobDescriptionQuery } }
        );
    }

    getMatches(companyJobId: number): Observable<Match[]> {
        return this.payfactorsApiService.get<Match[]>(`${this.endpoint}(${companyJobId})/Default.GetSurveyParticipationJobs`);
    }

    getCompanyJobTitleAndCode(companyJobId: number): Observable<CompanyJob> {
        return this.payfactorsApiService.get<CompanyJob>(`${this.endpoint}?$filter=CompanyJobId%20eq%20${companyJobId}`);
    }

    getJobFamilies(): Observable<string[]> {
      return this.payfactorsApiService.get<string[]>(`${this.endpoint}/Default.GetJobFamilies`);
    }
}
