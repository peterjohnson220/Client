import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class CaptchaApiService {
  private readonly endpoint = 'Captcha';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getRecaptchaSiteKey(): Observable<string> {
    return this.payfactorsApiService.get<string>(`${this.endpoint}/GetRecaptchaSiteKey`, {}, response => response.SiteKey);
  }
}
