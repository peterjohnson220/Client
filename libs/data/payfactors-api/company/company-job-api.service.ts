import { Injectable } from '@angular/core';

import { CompanyJob } from 'libs/models';

import { PayfactorsApiService } from '../payfactors-api.service';


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
}
