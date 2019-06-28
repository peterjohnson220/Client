import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CompositeSummaryDownloadRequest } from '../../../models/dashboard';
import { FileApiService } from '../file';
import { PayfactorsApiService } from '../payfactors-api.service';
import { switchMap } from 'rxjs/operators';
import { UserContext } from 'libs/models';

const UTILITIES_SUB_DOMAIN_CONFIG_NAME = 'UtilitiesSubDomain';

@Injectable()
export class IntegrationApiService {
  private service = 'Integration/api/v1';

  constructor(
    private fileApiService: FileApiService,
    private payfactorsApiService: PayfactorsApiService,
  ) {

  }

  compositeSummaryDownload(request: CompositeSummaryDownloadRequest, userContext: UserContext) {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }

    const host = `https://${utilitiesSubDomainConfig.Value}.payfactors.com`;
    const downloadUrl = `${host}/${this.service}/company/${userContext.CompanyId}/InvalidRecordsFile/${request.Id}`;

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
