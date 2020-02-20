import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class CompositeFieldApiService {
  private readonly endpoint = 'CompositeField';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  // Field Names -> Standard Pay Elements
  GetCompositeFieldFieldNames(): Observable<string[]> {
    return this.payfactorsApiService.get<string[]>(
      `${this.endpoint}/Default.GetCompositeFieldFieldNamesAsync`);
  }

  // Display Names -> Percentiles
  GetCompositeFieldDisplayNames(): Observable<string[]> {
    return this.payfactorsApiService.get<string[]>(
      `${this.endpoint}/Default.GetCompositeFieldDisplayNamesAsync`);
  }
}
