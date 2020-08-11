import { Injectable } from '@angular/core';

import { OrgDataEntityType } from 'libs/constants';
import { UserContext } from 'libs/models/security';

import { HrisApiService } from '../hris-api.service';

const UTILITIES_SUB_DOMAIN_CONFIG_NAME = 'UtilitiesSubDomain';

@Injectable({
  providedIn: 'root',
})
export class OnDemandSyncHrisApiService {
  private endpoint = 'OnDemandSync';

  constructor(private hrisApiService: HrisApiService) {
  }

  queueOnDemandSync(userContext: UserContext, entities: OrgDataEntityType[]) {
    const host = this.getHost(userContext);
    return this.hrisApiService.post(`${host}${this.endpoint}/${userContext.CompanyId}`, entities);
  }

  private getHost(userContext: UserContext): string {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }

    return `https://${utilitiesSubDomainConfig.Value}.payfactors.com/hris-api/`;
  }
}
