import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { CompositeSummaryDownloadRequest } from '../../../models/dashboard';
import { FileApiService } from '../file/file-api.service';
import { PayfactorsApiService } from '../payfactors-api.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Action } from '@ngrx/store';
import { UserContext } from 'libs/models';

@Injectable()
export class IntegrationApiService {
  private host = environment.utilitiesApiUrl;
  private service = 'Integration/api/v1';

  constructor(
    private fileApiService: FileApiService,
    private payfactorsApiService: PayfactorsApiService,
  ) {

  }

  compositeSummaryDownload(request: CompositeSummaryDownloadRequest, userContext: UserContext) {
    const downloadUrl = `${this.host}${this.service}/company/${userContext.CompanyId}/InvalidRecordsFile/${request.Id}`;

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

  fetchAuthToken() {
    // this is a stop-gap measure to get us out the door
    // should be replaced with the ApiAuthService's HttpInteceptor functionality
    // using bearer tokens
    return this.payfactorsApiService.get('Integration.GetAuthToken');
  }
}
