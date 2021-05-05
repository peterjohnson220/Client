import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { SaveLoaderConfigRequest } from 'libs/models/data-loads';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class SurveyLoaderApiService {
  private endpoint = 'SurveyLoader';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getWorksheetNames(request: File): Observable<string[]> {
    return this.payfactorsApiService.postFormData(`${this.endpoint}/GetWorksheetNames`, { file: request });
  }

  saveSurveyLoaderConfig(request: SaveLoaderConfigRequest): Observable<number> {
    return this.payfactorsApiService.post(`${this.endpoint}/SaveSurveyLoaderConfiguration`, request);
  }
}
