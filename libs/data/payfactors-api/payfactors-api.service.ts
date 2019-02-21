import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  downloadFile(url: string, body: any = {}): Observable<boolean> {
    const options: any = {
      responseType: 'blob',
      observe: 'response'
    };
    return this.http.post<any>(`${environment.payfactorsApiUrl}${url}`, body, options).pipe(
      map((response: any) => {
        const blob = response.body;
        const fileName = this.getHeaderTokenValue(response.headers, 'filename', 'Content-Disposition');

        return this.fileApiService.saveBlobAsFile(blob, fileName);
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
}
