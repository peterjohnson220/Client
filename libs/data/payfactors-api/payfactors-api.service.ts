import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PayfactorsApiService {

  constructor(
    private http: HttpClient
  ) {}

  get<T>(url: string, options: any = {}, mappingFn = this.extractValueFromOdata): Observable<T> {
    return this.http.get<T>(`${environment.payfactorsApiUrl}${url}`, options)
      .map(mappingFn);
  }

  post<T>(url: string, options: any = {}): Observable<T> {
    return this.http.post<T>(`${environment.payfactorsApiUrl}${url}`, options).map(this.extractValueFromOdata);
  }

  private extractValueFromOdata(response: any) {
    return typeof response.value !== 'undefined' ? response.value : false || response || {};
  }

}
