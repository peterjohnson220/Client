import { Injectable } from '@angular/core';

import { ConfigurationGroup } from 'apps/data-management/app/_main/models';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()

export class ConfigurationGroupApiService {
    private endpoint = 'LoaderConfigurationGroup';

    constructor(
        private payfactorsApiService: PayfactorsApiService
    ) { }

    getConfigurationGroup(companyId: number): Observable<ConfigurationGroup> {
        return this.payfactorsApiService.get(`${this.endpoint}/GetManualOrgConfigGroup/${companyId}`);
    }
}
