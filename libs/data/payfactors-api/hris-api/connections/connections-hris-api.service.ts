import { Injectable } from '@angular/core';

import { HrisApiService } from '../hris-api.service';
import { UserContext } from 'libs/models/security';
import { ValidateCredentialsResponse, CredentialsPackage, ConnectionPostRequest } from 'libs/models';

const UTILITIES_SUB_DOMAIN_CONFIG_NAME = 'UtilitiesSubDomain';

@Injectable()
export class ConnectionsHrisApiService {
  private endpoint = 'connections';

  constructor(private hrisApiService: HrisApiService) {

  }

  validateConnection(userContext: UserContext, credentials: CredentialsPackage) {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }

    const host = `https://${utilitiesSubDomainConfig.Value}.payfactors.com/hris-api/`;

    return this.hrisApiService.post<ValidateCredentialsResponse>(`${host}${this.endpoint}/validate`, credentials);
  }

  connect(userContext: UserContext, credentials: ConnectionPostRequest) {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }

    const host = `https://${utilitiesSubDomainConfig.Value}.payfactors.com/hris-api/`;

    return this.hrisApiService.post<ValidateCredentialsResponse>(`${host}${this.endpoint}/${userContext.CompanyId}`, credentials);
  }
}
