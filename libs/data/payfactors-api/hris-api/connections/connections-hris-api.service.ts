import { Injectable } from '@angular/core';

import { UserContext } from 'libs/models/security';
import {ValidateCredentialsResponse, CredentialsPackage,
  ConnectionPostRequest, ConnectionSummaryResponse} from 'libs/models';

import { HrisApiService } from '../hris-api.service';

const UTILITIES_SUB_DOMAIN_CONFIG_NAME = 'UtilitiesSubDomain';

@Injectable()
export class ConnectionsHrisApiService {
  private endpoint = 'connections';

  constructor(private hrisApiService: HrisApiService) {

  }

  validateConnection(userContext: UserContext, credentials: CredentialsPackage) {
    const host = this.getHost(userContext);
    return this.hrisApiService.post<ValidateCredentialsResponse>(`${host}${this.endpoint}/validate`, credentials);
  }

  connect(userContext: UserContext, credentials: ConnectionPostRequest) {
    const host = this.getHost(userContext);
    return this.hrisApiService.post<ValidateCredentialsResponse>(`${host}${this.endpoint}/${userContext.CompanyId}`, credentials);
  }

  get(userContext: UserContext) {
    const host = this.getHost(userContext);
    return this.hrisApiService.get<CredentialsPackage>(`${host}${this.endpoint}/${userContext.CompanyId}`);
  }

  delete(userContext: UserContext) {
    const host = this.getHost(userContext);
    return this.hrisApiService.delete(`${host}${this.endpoint}/${userContext.CompanyId}`);
  }

  getSummary(userContext: UserContext) {
    const host = this.getHost(userContext);
    return this.hrisApiService.get<ConnectionSummaryResponse>(`${host}${this.endpoint}/${userContext.CompanyId}/summary`);
  }

  private getHost(userContext: UserContext): string {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }

    return `https://${utilitiesSubDomainConfig.Value}.payfactors.com/hris-api/`;
  }
}
