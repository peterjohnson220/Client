import { Injectable } from '@angular/core';

import {CompanyJob, Match} from 'libs/models';

import { PayfactorsApiService } from '../payfactors-api.service';
import {Observable} from 'rxjs';


@Injectable()
export class CompanyJobApiService {
    private endpoint = 'CompanyJob';

    constructor(
        private payfactorsApiService: PayfactorsApiService
    ) { }

    getCompanyJob(companyJobId: number) {
        return this.payfactorsApiService.get<CompanyJob>(`${this.endpoint}/GetJobBase`, {
            params: {
                CompanyJobId: companyJobId
            }
        });
    }

    getMatches(companyJobId: number): Observable<Match[]> {
        return this.payfactorsApiService.get<Match[]>(`${this.endpoint}(${companyJobId})/Default.GetSurveyParticipationJobs`);
    }

    getCompanyJobTitleAndCode(companyJobId: number): Observable<CompanyJob> {
        return this.payfactorsApiService.get<CompanyJob>(`${this.endpoint}?$filter=CompanyJobId%20eq%20${companyJobId}`);
    }
}
