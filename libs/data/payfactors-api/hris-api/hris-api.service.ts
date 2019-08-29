import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HrisApiService {

  constructor(private http: HttpClient) { }

  get<T>(url: string, options: any = {}): Observable<T> {
    return this.http.get<T>(`${url}`, options).pipe(
      map((response: any) => <T>response)
    );
  }
}
