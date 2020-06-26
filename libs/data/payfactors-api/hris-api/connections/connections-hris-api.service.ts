import { Injectable } from '@angular/core';

import { UserContext } from 'libs/models/security';
import {ValidateCredentialsResponse, CredentialsPackage,
  ConnectionPostRequest, ConnectionSummaryResponse, PatchProperty} from 'libs/models';

import {OrgDataEntityType} from '../../../../constants/hris-api';

import { HrisApiService } from '../hris-api.service';

const UTILITIES_SUB_DOMAIN_CONFIG_NAME = 'UtilitiesSubDomain';

@Injectable()
export class ConnectionsHrisApiService {
  private endpoint = 'connections';

  constructor(private hrisApiService: HrisApiService) {

  }

  validateConnection(userContext: UserContext, connectionId: number) {
    const host = this.getHost(userContext);
    return this.hrisApiService.get<ValidateCredentialsResponse>(`${host}${this.endpoint}/${userContext.CompanyId}/validate/${connectionId}`);
  }

  connect(userContext: UserContext, credentials: ConnectionPostRequest) {
    const host = this.getHost(userContext);
    return this.hrisApiService.post<any>(`${host}${this.endpoint}/${userContext.CompanyId}`, credentials);
  }

  get(userContext: UserContext) {
    const host = this.getHost(userContext);
    return this.hrisApiService.get<CredentialsPackage>(`${host}${this.endpoint}/${userContext.CompanyId}`);
  }

  getByConnectionId(userContext: UserContext, connectionId: number) {
    const host = this.getHost(userContext);
    return this.hrisApiService.get<CredentialsPackage>(`${host}${this.endpoint}/${userContext.CompanyId}/${connectionId}`);
  }

  delete(userContext: UserContext) {
    const host = this.getHost(userContext);
    return this.hrisApiService.delete(`${host}${this.endpoint}/${userContext.CompanyId}`);
  }

  getSummary(userContext: UserContext) {
    const host = this.getHost(userContext);
    return this.hrisApiService.get<ConnectionSummaryResponse>(`${host}${this.endpoint}/${userContext.CompanyId}/summary`);
  }

  updateSelectedEntities(userContext: UserContext, connectionId: number, entityTypes: OrgDataEntityType[]) {
    const host = this.getHost(userContext);
    return this.hrisApiService.post(`${host}${this.endpoint}/${userContext.CompanyId}/${connectionId}/entities`, entityTypes);
  }

  patchConnection(userContext: UserContext, connectionId: number, patchPropertyList: PatchProperty[], reauth: boolean = true) {
    const host = this.getHost(userContext);
    return this.hrisApiService.patch(`${host}${this.endpoint}/${userContext.CompanyId}/${connectionId}${reauth ? '?reauth=true' : ''}`, patchPropertyList);
  }

  private getHost(userContext: UserContext): string {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }

    return `https://${utilitiesSubDomainConfig.Value}.payfactors.com/hris-api/`;
  }
}
