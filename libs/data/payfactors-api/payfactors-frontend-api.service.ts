import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PayfactorsFrontEndApiService {

    constructor(
        private http: HttpClient
    ) { }

    get<T>(url: string, options: any = {}, mappingFn = this.extractValueFromOdata): Observable<T> {
        return this.http.get<T>(`${environment.payfactorsFrontEndURL}${url}`, options).pipe(
            map(mappingFn)
        );
    }

    post<T>(url: string, body: any = {}): Observable<T> {
        return this.http.post<T>(`${environment.payfactorsFrontEndURL}${url}`, body).pipe(
            map(this.extractValueFromOdata)
        );
    }

    put<T>(url: string, body: any = {}): Observable<T> {
        return this.http.put<T>(`${environment.payfactorsFrontEndURL}${url}`, body).pipe(
            map(this.extractValueFromOdata)
        );
    }

    delete<T>(url: string, body: any = {}): Observable<T> {
        return this.http.delete<T>(`${environment.payfactorsFrontEndURL}${url}`, body).pipe(
            map(this.extractValueFromOdata)
        );
    }

    private extractValueFromOdata(response: any) {
        if (response === null) {
            return null;
        }

        return typeof response.value !== 'undefined' ? response.value : false || response || {};
    }

}
