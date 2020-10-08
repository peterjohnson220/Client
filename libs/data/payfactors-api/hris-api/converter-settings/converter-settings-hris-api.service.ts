import { Injectable } from '@angular/core';

import { UserContext } from 'libs/models/security';
import { ConverterSettings } from 'libs/models';


import { HrisApiService } from '../hris-api.service';

const UTILITIES_SUB_DOMAIN_CONFIG_NAME = 'UtilitiesSubDomain';

@Injectable({
  providedIn: 'root',
})
export class ConverterSettingsHrisApiService {
  private endpoint = 'convertersettings';

  constructor(private hrisApiService: HrisApiService) {

  }

  get(userContext: UserContext, connectionId: number) {
    const host = this.getHost(userContext);
    return this.hrisApiService.get<ConverterSettings[]>(`${host}${this.endpoint}/${userContext.CompanyId}/${connectionId}`);
  }

  saveSettings(userContext: UserContext, connectionId: number, request: ConverterSettings[]) {
    const host = this.getHost(userContext);
    return this.hrisApiService.post(`${host}${this.endpoint}/${userContext.CompanyId}/${connectionId}`, request);
  }

  private getHost(userContext: UserContext): string {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }

    return `https://${utilitiesSubDomainConfig.Value}.payfactors.com/hris-api/`;
  }
}
