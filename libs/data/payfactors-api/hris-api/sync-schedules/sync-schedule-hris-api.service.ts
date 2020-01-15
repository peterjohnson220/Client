import {Injectable} from '@angular/core';

import {UserContext} from 'libs/models/security';
import {SyncScheduleDtoModel, TransferScheduleSummary} from 'libs/models/hris-api/sync-schedule';

import {HrisApiService} from '../hris-api.service';

const UTILITIES_SUB_DOMAIN_CONFIG_NAME = 'UtilitiesSubDomain';

@Injectable()
export class SyncScheduleHrisApiService {
  private endpoint = 'SyncSchedules';

  constructor(private hrisApiService: HrisApiService) {
  }

  getTransferScheduleSummary(userContext: UserContext) {
    const host = this.getHost(userContext);
    return this.hrisApiService.get<TransferScheduleSummary[]>(`${host}${this.endpoint}/${userContext.CompanyId}/summary`);
  }

  enableTransferSchedule(userContext: UserContext, syncScheduleId: number) {
    const host = this.getHost(userContext);
    return this.hrisApiService.post(`${host}${this.endpoint}/${userContext.CompanyId}/${syncScheduleId}/enable`, {});
  }

  disableTransferSchedule(userContext: UserContext, syncScheduleId: number) {
    const host = this.getHost(userContext);
    return this.hrisApiService.post(`${host}${this.endpoint}/${userContext.CompanyId}/${syncScheduleId}/disable`, {});
  }

  upsertTransferSchedule(userContext: UserContext, payload: SyncScheduleDtoModel) {
    const host = this.getHost(userContext);
    return this.hrisApiService.post<TransferScheduleSummary>(`${host}${this.endpoint}/${userContext.CompanyId}`, payload);
  }

  private getHost(userContext: UserContext): string {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }

    return `https://${utilitiesSubDomainConfig.Value}.payfactors.com/hris-api/`;
  }
}
