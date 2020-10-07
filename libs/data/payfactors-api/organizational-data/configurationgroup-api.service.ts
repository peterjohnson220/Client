import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { ConfigurationGroup } from 'libs/models/data-loads';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class ConfigurationGroupApiService {
    private endpoint = 'LoaderConfigurationGroup';

    constructor(
        private payfactorsApiService: PayfactorsApiService
    ) { }

    getConfigurationGroups(companyId: number, loadType: string, primaryCompositeDataLoadType: string): Observable<ConfigurationGroup[]> {
      const params = new HttpParams().set('loadType', loadType).set('primaryCompositeDataLoadType', primaryCompositeDataLoadType);
      return this.payfactorsApiService.get(`${this.endpoint}/GetLoaderConfigurationGroups/${companyId}`, {params});
    }

    saveConfigurationGroup(configurationGroup: ConfigurationGroup): Observable<ConfigurationGroup> {
      return this.payfactorsApiService.post(`${this.endpoint}/SaveConfigGroup`, configurationGroup);
    }
}
