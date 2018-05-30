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

  post<T>(url: string, body: any = {}): Observable<T> {
    return this.http.post<T>(`${environment.payfactorsApiUrl}${url}`, body).map(this.extractValueFromOdata);
  }

  put<T>(url: string, body: any = {}): Observable<T> {
    return this.http.put<T>(`${environment.payfactorsApiUrl}${url}`, body).map(this.extractValueFromOdata);
  }

  delete<T>(url: string, body: any = {}): Observable<T> {
    return this.http.delete<T>(`${environment.payfactorsApiUrl}${url}`, body).map(this.extractValueFromOdata);
  }

  private extractValueFromOdata(response: any) {
    if (response === null) {
      return null;
    }

    return typeof response.value !== 'undefined' ? response.value : false || response || {};
  }

}
