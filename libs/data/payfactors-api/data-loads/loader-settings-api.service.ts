import { Injectable } from '@angular/core';

import { LoaderSetting } from 'libs/models/data-loads/loader-setting.model';
import { LoaderSettingsDTO } from 'libs/models/data-loads/request/loader-settings.dto';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class LoaderSettingsApiService {
  private endpoint = 'LoaderSettings';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getCompanyLoaderSettings(companyId: number, configGroupId: number = null) {
    return this.payfactorsApiService.get<LoaderSetting[]>(`${this.endpoint}.GetCompanyLoaderSettings?companyId=${companyId}` +
    `&loaderConfigurationGroupId=${configGroupId}`);
  }

  saveOrUpdate(data: LoaderSettingsDTO) {
    return this.payfactorsApiService.post(`${this.endpoint}.SaveOrUpdate`, data);
  }
}
