import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { addJwtAuthInterceptorHeader } from 'libs/core/functions';

@Injectable()
export class HrisApiService {

  constructor(private http: HttpClient) { }

  get<T>(url: string, options: any = {}): Observable<T> {
    const date = new Date().getUTCMilliseconds();
    options = addJwtAuthInterceptorHeader(options);
    options = {
      ...options,
      params: {
        cacheKey: date
      }
    };
    return this.http.get<T>(`${url}`, options).pipe(
      map((response: any) => <T>response)
    );
  }

  post<T>(url: string, body: any, options: any = {}): Observable<T> {
    options = addJwtAuthInterceptorHeader(options);
    return this.http.post<T>(`${url}`, body, options).pipe(
      map((response: any) => <T>response)
    );
  }

  patch<T>(url: string, body: any, options: any = {}): Observable<T> {
    options = addJwtAuthInterceptorHeader(options);
    return this.http.patch<T>(`${url}`, body, options).pipe(
      map((response: any) => <T>response)
    );
  }

  delete<T>(url: string, options: any = {}): Observable<T> {
    options = addJwtAuthInterceptorHeader(options);
    return this.http.delete<T>(`${url}`, options).pipe(
      map((response: any) => <T>response)
    );
  }
}
