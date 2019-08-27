import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { addJwtAuthInterceptorHeader } from 'libs/core/functions';

@Injectable()
export class HrisApiService {

  constructor(private http: HttpClient) { }

  get<T>(url: string, options: any = {}): Observable<T> {
    options = addJwtAuthInterceptorHeader(options);
    return this.http.get<T>(`${url}`, options).pipe(
      map((response: any) => <T>response)
    );
  }
}
