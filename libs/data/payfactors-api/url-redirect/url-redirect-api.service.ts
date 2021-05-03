import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { UrlRedirectRequest } from '../../../models/url-redirect';
import { PageRedirectUrl } from '../../../models/url-redirect/page-redirect-url';

@Injectable({
  providedIn: 'root'
})
export class UrlRedirectApiService {
  private readonly endpoint = 'UrlRedirect';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getFeatureFlagUrls(requests: UrlRedirectRequest[]): Observable<PageRedirectUrl[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/BulkFeatureFlagUrls`, requests);
  }
}
