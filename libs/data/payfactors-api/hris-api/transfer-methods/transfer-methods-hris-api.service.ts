import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { HrisApiService } from '../hris-api.service';
import { UserContext } from 'libs/models/security';
import { TransferMethodResponse } from 'libs/models/hris-api';

const UTILITIES_SUB_DOMAIN_CONFIG_NAME = 'UtilitiesSubDomain';

@Injectable({
  providedIn: 'root',
})
export class TransferMethodsHrisApiService {
  private endpoint = 'TransferMethods';

  constructor(private hrisApiService: HrisApiService) {

  }

  getAllActiveTransferMethods(userContext: UserContext) {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }

    const host = `https://${utilitiesSubDomainConfig.Value}.payfactors.com/hris-api/`;

    return this.hrisApiService.get<TransferMethodResponse[]>(`${host}${this.endpoint}`);
  }
}
