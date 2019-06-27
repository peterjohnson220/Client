import { Injectable } from '@angular/core';
import { PayfactorsApiService } from '../payfactors-api.service';
import { LoaderSettingsDTO } from 'libs/models/data-loads/request/loader-settings.dto';
import { LoaderSetting } from 'libs/models/data-loads/loader-setting.model';

@Injectable()
export class LoaderSettingsApiService {
  private endpoint = 'LoaderSettings';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getCompanyLoaderSettings(companyId: number) {
    return this.payfactorsApiService.get<LoaderSetting[]>(`${this.endpoint}.GetCompanyLoaderSettings?companyId=${companyId}`);
  }

  saveOrUpdate(data: LoaderSettingsDTO) {
    return this.payfactorsApiService.post(`${this.endpoint}.SaveOrUpdate`, data);
  }
}
