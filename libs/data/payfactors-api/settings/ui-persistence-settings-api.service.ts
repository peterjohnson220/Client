import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { SaveUiPersistenceSettingRequest } from '../../../models/common';

@Injectable({
  providedIn: 'root',
})
export class UiPersistenceSettingsApiService {
  private endpoint = 'UiPersistenceSettings';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getAllUiPersistenceSettings(): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}.GetAllSettings`);
  }

  getUiPersistenceSetting(featureArea: string, settingName: string): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}.GetSetting`, {
      params: {
        featureArea: featureArea,
        settingName: settingName
      }
    });
  }

  putUiPersistenceSetting(request: SaveUiPersistenceSettingRequest): Observable<any> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}.PutSetting`,
      {
        request: JSON.stringify(request)
      });
  }
}
