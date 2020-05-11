import { Injectable } from '@angular/core';
import { PayfactorsApiService } from '../payfactors-api.service';
import { OrgDataLoaderConfigurationSaveRequest } from '../../../models/data-loads/request';

@Injectable()
export class OrgDataLoaderConfigurationApiService {
  private endpoint = 'OrgDataLoaderConfiguration';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  saveConfiguration(data: any) {
    const formData = new FormData();
    formData.append('publicKey', data.publicKey ? data.publicKey.rawFile : null);
    formData.append('request', JSON.stringify(data.request));

    return this.payfactorsApiService.post(`${this.endpoint}/Save`, formData);
  }
}
