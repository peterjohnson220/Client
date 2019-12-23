import {switchMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {IntegrationApiService} from '../integration-api.service';
import {UserContext} from 'libs/models';
import {FileUploadDataRequestModel} from 'libs/features/org-data-loader/models';


@Injectable()
export class DataImportApiService {
  private service = 'Integration/api/v1';
  constructor( private integrationApiService: IntegrationApiService ) {

  }

  sendFiles(companyId: number, filesUploadData: FileUploadDataRequestModel, userContext) {
    const url = `/${this.service}/company/${companyId}/DataImport/File/CSV`;
    return  this.integrationApiService.fetchAuthToken().pipe(
      switchMap(token => {
        return this.integrationApiService.putFormData(url, token, userContext, filesUploadData);
      }),
    );
  }
}

