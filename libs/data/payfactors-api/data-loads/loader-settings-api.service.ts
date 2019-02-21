import {Injectable} from '@angular/core';
import {PayfactorsApiService} from '../payfactors-api.service';
import {LoaderSetting} from '../../../../apps/admin/app/_org-data-loader/models/loader-settings.model';

@Injectable()
export class LoaderSettingsApiService {
  private endpoint = 'LoaderSettings';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getCompanyLoaderSettings(companyId: number) {
    return this.payfactorsApiService.get<LoaderSetting[]>(`${this.endpoint}.GetCompanyLoaderSettings?companyId=${companyId}`);
  }

  saveOrUpdate(data: any) {
    return this.payfactorsApiService.post(`${this.endpoint}.SaveOrUpdate`, {settings: data.settings, companyId: data.companyId});
  }
}
