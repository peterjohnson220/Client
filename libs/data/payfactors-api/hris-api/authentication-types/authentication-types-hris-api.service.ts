import { Injectable } from '@angular/core';

import { UserContext } from 'libs/models/security';
import { HrisApiService } from '../hris-api.service';
import { AuthenticationTypeResponse } from 'libs/models/hris-api/authentication-type';

const UTILITIES_SUB_DOMAIN_CONFIG_NAME = 'UtilitiesSubDomain';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationTypesHrisApiService {
  private endpoint = 'authenticationtypes';

  constructor(private hrisApiService: HrisApiService) {

  }

  getAuthenticationTypeById(userContext: UserContext, authenticationTypeId: number) {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }

    const host = `https://${utilitiesSubDomainConfig.Value}.payfactors.com/hris-api/`;

    return this.hrisApiService.get<AuthenticationTypeResponse>(`${host}${this.endpoint}/${authenticationTypeId}`);
  }
}
