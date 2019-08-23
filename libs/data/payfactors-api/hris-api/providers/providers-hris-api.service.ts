import { Injectable } from '@angular/core';

import { HrisApiService } from '../hris-api.service';
import { UserContext } from 'libs/models/security';
import { ProviderResponse } from 'libs/models/hris-api/provider';

const UTILITIES_SUB_DOMAIN_CONFIG_NAME = 'UtilitiesSubDomain';

@Injectable()
export class ProvidersHrisApiService {
  private endpoint = 'providers';

  constructor(private hrisApiService: HrisApiService) {

  }

  getProvidersByTransferMethodId(userContext: UserContext, transferMethodId: number) {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }

    const host = `https://${utilitiesSubDomainConfig.Value}.payfactors.com/hris-api/`;

    return this.hrisApiService.get<ProviderResponse[]>(`${host}${this.endpoint}?transferMethodId=${transferMethodId}`);
  }

  getProviderById(userContext: UserContext, providerId: number) {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }

    const host = `https://${utilitiesSubDomainConfig.Value}.payfactors.com/hris-api/`;

    return this.hrisApiService.get<ProviderResponse[]>(`${host}${this.endpoint}/${providerId}`);
  }
}
