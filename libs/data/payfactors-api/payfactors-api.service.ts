import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { FileApiService } from './file/file-api.service';

@Injectable()
export class PayfactorsApiService {

  constructor(
    private http: HttpClient,
    private fileApiService: FileApiService,
  ) { }

  get<T>(url: string, options: any = {}, mappingFn = this.extractValueFromOdata): Observable<T> {
    return this.http.get<T>(`${environment.payfactorsApiUrl}${url}`, options).pipe(
      map(mappingFn)
    );
  }

  post<T>(url: string, body: any = {}, mappingFn = this.extractValueFromOdata): Observable<T> {
    return this.http.post<T>(`${environment.payfactorsApiUrl}${url}`, body).pipe(
      map(mappingFn)
    );
  }

  patch<T>(url: string, body: any = {}, mappingFn = this.extractValueFromOdata): Observable<T> {
    return this.http.patch<T>(`${environment.payfactorsApiUrl}${url}`, body).pipe(
      map(mappingFn)
    );
  }



  postWithHeader<T>(url: string, body: any = {}, headers: any): Observable<T> {
    return this.http.post<T>(`${environment.payfactorsApiUrl}${url}`, body, { headers: headers }).pipe(
    );
  }

  downloadFile(url: string, body: any = {}, headers: HttpHeaders = null, openInNewTab = false): Observable<boolean> {
    const options: any = {
      responseType: 'blob',
      observe: 'response'
    };

    if (headers) {
      options.headers = headers;
    }

    return this.http.post<any>(`${environment.payfactorsApiUrl}${url}`, body, options).pipe(
      map((response: any) => {
        const blob = response.body;
        const fileName = this.getHeaderTokenValue(response.headers, 'filename', 'Content-Disposition');

        return this.fileApiService.saveBlobAsFile(blob, fileName, openInNewTab);
      })
    );
  }

  put<T>(url: string, body: any = {}): Observable<T> {
    return this.http.put<T>(`${environment.payfactorsApiUrl}${url}`, body).pipe(
      map(this.extractValueFromOdata)
    );
  }

  delete<T>(url: string, body: any = {}): Observable<T> {
    return this.http.delete<T>(`${environment.payfactorsApiUrl}${url}`, body).pipe(
      map(this.extractValueFromOdata)
    );
  }

  postFormData(url: string, formDataParams?: any): Observable<any> {

    const formData = this.buildFormData(formDataParams);

    const headers = new Headers();
    headers.append('Accept', 'application/json');

    const options = {
      headers: new HttpHeaders().append('Accept', 'application/json')
    };

    /*  unable to send via authHttp
        Angular2 jwt is supposed to be pass through
        but its not working
        https://github.com/auth0/angular2-jwt/issues/54
    */

    return this.http.post(`${environment.payfactorsApiUrl}${url}`, formData, options).pipe(
      map(this.extractValueFromOdata)
    );
  }

  private extractValueFromOdata(response: any) {
    if (response === null) {
      return null;
    }

    return typeof response.value !== 'undefined' ? response.value : false || response || {};
  }

  private getHeaderTokenValue(headers: Headers, tokenName: string, headerName: string): string {
    const header: string = headers.get(headerName);
    const headerTokens = header.split(';');
    const token = headerTokens.find(ht => ht.split('=')[0].trim() === tokenName).split('=')[1];

    if (token.charAt(0) === '"' && token.charAt(token.length - 1) === '"') {
      return token.slice(1, -1);
    }

    return token;
  }

  private buildFormData(formDataParams: any[]) {
    if (!formDataParams) { return; }

    const formData = new FormData();
    Object.keys(formDataParams).forEach(key => formData.append(key, formDataParams[key]));

    return formData;
  }
}
