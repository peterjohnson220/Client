import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { HrisApiService } from '../hris-api.service';
import { UserContext } from 'libs/models/security';
import { ProviderResponse } from 'libs/models/hris-api/provider';

const UTILITIES_SUB_DOMAIN_CONFIG_NAME = 'UtilitiesSubDomain';

@Injectable()
export class ProvidersHrisApiService {
  private endpoint = 'providers';

  constructor(private hrisApiService: HrisApiService) {

  }

  getProvidersByTransferMethodId(userContext: UserContext, transferMethodId: number, token: string) {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }

    const host = `https://${utilitiesSubDomainConfig.Value}.payfactors.com/hris-api/`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const options: any = {
      headers,
    };

    return this.hrisApiService.get<ProviderResponse[]>(`${host}${this.endpoint}?transferMethodId=${transferMethodId}`, options);
  }

  getProviderById(userContext: UserContext, providerId: number, token: string) {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }

    const host = `https://${utilitiesSubDomainConfig.Value}.payfactors.com/hris-api/`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const options: any = {
      headers,
    };

    return this.hrisApiService.get<ProviderResponse[]>(`${host}${this.endpoint}/${providerId}`, options);
  }
}
