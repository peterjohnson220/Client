import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class PricingLoaderApiService {
  private endpoint = 'PricingLoader';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getWorksheetNames(request: File): Observable<string[]> {
    return this.payfactorsApiService.postFormData(`${this.endpoint}/GetWorksheetNames`, { file: request });
  }
}