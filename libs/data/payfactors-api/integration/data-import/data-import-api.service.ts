import { Injectable } from '@angular/core';

import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { FileUploadDataRequestModel, ExcelFileUploadRequest } from 'libs/features/loaders/org-data-loader/models';

import { IntegrationApiService } from '../integration-api.service';

@Injectable({
  providedIn: 'root',
})
export class DataImportApiService {
  constructor(private integrationApiService: IntegrationApiService) {

  }

  sendFiles(companyId: number, filesUploadData: FileUploadDataRequestModel, userContext) {
    const url = `/company/${companyId}/DataImport/File/CSV`;
    return this.integrationApiService.fetchAuthToken().pipe(
      switchMap(token => {
        return this.integrationApiService.putFormData(url, token, userContext, filesUploadData);
      }),
    );
  }

  sendExcelFile(request: ExcelFileUploadRequest): Observable<any> {
    const url = `/DataImport/File/Excel/Company${request.CompanyId !== null ? `/${request.CompanyId}` : ''}` ;
    return this.integrationApiService.fetchAuthToken().pipe(
      switchMap(token => {
        return this.integrationApiService.putFormData(url, token, request.UserContext, request.FormData);
      }),
    );
  }
}
