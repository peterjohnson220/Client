import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { environment } from '../../../environments/environment';
import { FileApiService } from './file/file-api.service';
import { BaseUrlLocation } from '../../models/payfactors-api/common/base-url-location.enum';
import * as fromRootState from '../../state/state';
import { UserContext } from '../../models/security';

@Injectable()
export class PayfactorsApiService implements OnDestroy {

  userContext$: Observable<UserContext>;
  userContextSubscription: Subscription;
  utilitiesSubDomain: string;

  constructor(
    private http: HttpClient,
    private fileApiService: FileApiService,
    private location: PlatformLocation,
    private rootStore: Store<fromRootState.State>
  ) {
    this.userContextSubscription = this.rootStore.select(fromRootState.getUserContext).subscribe(
      uc => { this.utilitiesSubDomain = uc ? uc.ConfigSettings.find(c => c.Name === 'UtilitiesSubDomain').Value : ''; });
  }

  get<T>(url: string, options: any = {}, mappingFn = this.extractValueFromOdata,
         baseUrlLocation: BaseUrlLocation = BaseUrlLocation.Default, useUtilities: boolean = false): Observable<T> {
    return this.http.get<T>(this.formatUrl(baseUrlLocation, url, useUtilities), options).pipe(
      map(mappingFn)
    );
  }

  post<T>(url: string, body: any = {}, mappingFn = this.extractValueFromOdata,
          baseUrlLocation: BaseUrlLocation = BaseUrlLocation.Default, useUtilities: boolean = false, options: any = {}): Observable<T> {
    return this.http.post<T>(this.formatUrl(baseUrlLocation, url, useUtilities), body, options).pipe(
      map(mappingFn)
    );
  }

  patch<T>(url: string, body: any = {}, mappingFn = this.extractValueFromOdata,
           baseUrlLocation: BaseUrlLocation = BaseUrlLocation.Default, useUtilities: boolean = false): Observable<T> {
    return this.http.patch<T>(this.formatUrl(baseUrlLocation, url, useUtilities), body).pipe(
      map(mappingFn)
    );
  }



  postWithHeader<T>(url: string, body: any = {}, headers: any,
                    baseUrlLocation: BaseUrlLocation = BaseUrlLocation.Default, useUtilities: boolean = false): Observable<T> {
    return this.http.post<T>(this.formatUrl(baseUrlLocation, url, useUtilities), body, { headers: headers }).pipe(
    );
  }

  // tslint:disable-next-line:max-line-length
  downloadFile(url: string, body: any = {}, headers: HttpHeaders = null, openInNewTab = false, baseUrlLocation: BaseUrlLocation = BaseUrlLocation.Default, useUtilities: boolean = false, withCredentials: boolean = false): Observable<boolean> {
    const options: any = {
      responseType: 'blob',
      observe: 'response',
      withCredentials: withCredentials ? true : null
    };

    if (headers) {
      options.headers = headers;
    }

    return this.http.post<any>(this.formatUrl(baseUrlLocation, url, useUtilities), body, options).pipe(
      map((response: any) => {
        const blob = response.body;
        const fileName = this.getHeaderTokenValue(response.headers, 'filename', 'Content-Disposition');

        return this.fileApiService.saveBlobAsFile(blob, fileName, openInNewTab);
      })
    );
  }

  put<T>(url: string, body: any = {}, baseUrlLocation: BaseUrlLocation = BaseUrlLocation.Default, useUtilities: boolean = false): Observable<T> {
    return this.http.put<T>(this.formatUrl(baseUrlLocation, url, useUtilities), body).pipe(
      map(this.extractValueFromOdata)
    );
  }

  delete<T>(url: string, body: any = {}, baseUrlLocation: BaseUrlLocation = BaseUrlLocation.Default, useUtilities: boolean = false): Observable<T> {
    return this.http.delete<T>(this.formatUrl(baseUrlLocation, url, useUtilities), body).pipe(
      map(this.extractValueFromOdata)
    );
  }

  postFormData(url: string, formDataParams?: any,
               baseUrlLocation: BaseUrlLocation = BaseUrlLocation.Default, useUtilities: boolean = false): Observable<any> {

    const formData = this.buildFormData(formDataParams);

    const options = {
      headers: new HttpHeaders().append('Accept', 'application/json')
    };

    /*  unable to send via authHttp
        Angular2 jwt is supposed to be pass through
        but its not working
        https://github.com/auth0/angular2-jwt/issues/54
    */

    return this.http.post(this.formatUrl(baseUrlLocation, url, useUtilities), formData, options).pipe(
      map(this.extractValueFromOdata)
    );
  }

  public extractValueFromOdata(response: any) {
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

  public formatUrl(baseLocation: BaseUrlLocation, relativeUrl: string, useUtilitiesSubdomain: boolean) {

    const origin = this.formatBaseUrl(useUtilitiesSubdomain);

    switch (baseLocation) {

      case BaseUrlLocation.FrontEnd:
        return `${origin}${environment.payfactorsFrontEndApiUrl}${relativeUrl}`;
      default:
        return `${origin}${environment.payfactorsApiUrl}${relativeUrl}`;
        break;
    }
  }

  private formatBaseUrl(useUtilitiesSubDomain: boolean) {
    let origin = (this.location as any).location.origin;

    if (useUtilitiesSubDomain) {
      const utilitiesSubDomain = this.utilitiesSubDomain;
      const PayfactorsUrlRegEx = new RegExp(':\/\/.*\.payfactors.com', 'i');

      origin = origin.replace(PayfactorsUrlRegEx, `://${utilitiesSubDomain}.payfactors.com`);
    }

    return origin;
  }

  ngOnDestroy(): void {
    this.userContextSubscription.unsubscribe();
  }



}
