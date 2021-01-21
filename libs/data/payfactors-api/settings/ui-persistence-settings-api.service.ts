import { Injectable } from '@angular/core';

import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { SaveUiPersistenceSettingRequest } from '../../../models/common';

@Injectable({
  providedIn: 'root',
})
export class UiPersistenceSettingsApiService {
  private endpoint = 'UiPersistenceSettings';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) { }

  getAllUiPersistenceSettings(): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/GetAllSettings`);
  }

  getUiPersistenceSetting(featureArea: string, settingName: string): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/GetSetting`, {
      params: {
        featureArea: featureArea,
        settingName: settingName
      }
    });
  }


  putUiPersistenceSetting(request: SaveUiPersistenceSettingRequest): Observable<any> {
    return this.payfactorsApiService.putWithHeaders<any>(`${this.endpoint}/PutSetting`,
      JSON.stringify(request), this.headers
    );
  }
}
