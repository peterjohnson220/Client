import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DBEntityType } from 'apps/data-management/app/_main/models/db-entitytype.enum';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { FileType, UserContext } from 'libs/models';

import { CompositeSummaryDownloadRequest } from '../../../models/dashboard';
import {CompositeDataLoadSearchCriteria, CompositeDataLoadViewResponse} from '../../../models/admin/loader-dashboard';
import { FileApiService } from '../file';
import { PayfactorsApiService } from '../payfactors-api.service';

const UTILITIES_SUB_DOMAIN_CONFIG_NAME = 'UtilitiesSubDomain';

@Injectable({
  providedIn: 'root',
})
export class IntegrationApiService {
  private service = 'Integration/api/v1';

  constructor(
    private fileApiService: FileApiService,
    private payfactorsApiService: PayfactorsApiService,
    private http: HttpClient,
  ) { }

  SearchCompositeDataLoads(userContext: UserContext, payload: CompositeDataLoadSearchCriteria,
                           companyId?: number): Observable<CompositeDataLoadViewResponse[]> {
    const host = this.getAPIBase(userContext);
    let apiURL = '';
    if (!companyId) {
      apiURL = `${host}/admin/DashboardAdmin`;
    } else {
      apiURL = `${host}/company/${companyId}/Dashboard`;
    }

    return this.fetchAuthToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        const options: any = {
          headers,
        };

        return this.http.post(apiURL, payload, options).pipe(
          map((response: any) => response));
      }),
    );
  }

  SearchCompanyFilePackages(userContext: UserContext, companyId?: number) {
    const host = this.getAPIBase(userContext);
    let apiURL = '';
    if (!companyId) {
      apiURL = `${host}/admin/DashboardAdmin/files`;
    } else {
      apiURL = `${host}/company/${companyId}/Dashboard/files`;
    }

    return this.fetchAuthToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        });
        const options: any = {
          headers,
        };

        return this.http.get(apiURL, options).pipe(
          map((response: any) => response));
      }),
    );
  }

  PutEntityIdentifiers(companyId: number, type: DBEntityType, userContext: UserContext, keyFields: string[]) {
    const host = this.getAPIBase(userContext);
    const apiURL = `${host}/company/${companyId}/LoaderConfig/${type.valueOf()}`;

    // use fetchAuthToken as a stop-gap until we have a better auth system
    return this.fetchAuthToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        const options: any = {
          headers,
        };

        return this.http.put(apiURL, keyFields, options).pipe(
          map((response: any) => response));
      }),
    );
  }

  GetEntityIdentifiers(companyId: number, type: DBEntityType, userContext: UserContext): Observable<string[]> {
    const host = this.getAPIBase(userContext);
    const apiURL = `${host}/company/${companyId}/LoaderConfig/${type.valueOf()}`;

    // use fetchAuthToken as a stop-gap until we have a better auth system
    return this.fetchAuthToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        const options: any = {
          headers,
        };

        return this.http.get(apiURL, options).pipe(
          map((response: any) => response));
      }),
    );
  }

  compositeSummaryDownload(request: CompositeSummaryDownloadRequest, userContext: UserContext) {
    const host = this.getAPIBase(userContext);
    let fileType = '';

    if (request.FileType === FileType.InvalidRecordsFile) {
      fileType = 'InvalidRecordsFile';
    } else if (request.FileType === FileType.ExportedSourceFile) {
      fileType = 'ExportedSourceFile';
    }

    const downloadUrl = `${host}/company/${userContext.CompanyId}/${fileType}/${request.Id}`;

    // use fetchAuthToken as a stop-gap until we have a better auth system
    return this.fetchAuthToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        const options: any = {
          headers,
        };

        return this.fileApiService.downloadFile(downloadUrl, request.Id, options);
      }),
    );
  }

  RedropExportedSourceFile(compositeDataLoadId: number, userContext: UserContext) {
    const host = this.getAPIBase(userContext);
    const apiURL = `${host}/company/${userContext.CompanyId}/ExportedSourceFile/Redrop`;

    // use fetchAuthToken as a stop-gap until we have a better auth system
    return this.fetchAuthToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        const options: any = {
          headers,
        };

        return this.http.post(apiURL, compositeDataLoadId, options).pipe(
          map((response: any) => response));
      }),
    );
  }

  fetchAuthToken() {
    // this is a stop-gap measure to get us out the door
    // should be replaced with the ApiAuthService's HttpInteceptor functionality
    // using bearer tokens
    return this.payfactorsApiService.get('Integration.GetAuthToken');
  }

  private getAPIBase(userContext: UserContext): any {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }
    return `https://${utilitiesSubDomainConfig.Value}.payfactors.com/${this.service}`;
  }

  putFormData(url: string, token: any, userContext: any, formDataParams?: any): Observable<any> {

    const host = this.getAPIBase(userContext);

    const formData = this.buildFormData(formDataParams);

    const options = {
      headers: new HttpHeaders().append('Accept', 'application/json')
        .append('Authorization', `Bearer ${token}`)
    };
    return this.http.put(`${host}${url}`, formData, options).pipe(
      map((response: any) => response)
    );
  }
  private buildFormData(formDataParams: any[]) {
    if (!formDataParams) { return; }

    const formData = new FormData();
    Object.keys(formDataParams).forEach(key => {
      if (formDataParams[key].length > 0) {
        formDataParams[key].forEach((o) => {
          formData.append(key, o);
        });
      } else {
        formData.append(key, formDataParams[key]);
      }
    });

    return formData;
  }
}
