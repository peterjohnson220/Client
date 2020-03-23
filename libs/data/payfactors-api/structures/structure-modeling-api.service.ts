import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { SaveModelSettingsRequest, SaveModelSettingsResponse } from 'libs/models/payfactors-api/structures';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class StructureModelingApiService {
  private readonly endpoint = 'StructureModeling';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getStructureNameAutocompleteSuggestions(filter: string): Observable<string[]> {
    return this.payfactorsApiService.get<string[]>(`${this.endpoint}/GetStructureNameAutocompleteSuggestions`, {
      params: { filter }
    });
  }

  saveModelSettings(request: SaveModelSettingsRequest): Observable<SaveModelSettingsResponse> {
    return this.payfactorsApiService.post<SaveModelSettingsResponse>(`${this.endpoint}/SaveModelSettings`, request );
  }
}
