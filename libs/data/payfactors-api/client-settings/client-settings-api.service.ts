import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { PayfactorsApiService} from '../payfactors-api.service';
import { ClientSettingRequestModel } from '../../../models/common/client-setting-request.model';

@Injectable()
export class ClientSettingsApiService {
  private endpoint = 'ClientSettings';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}


  putClientSetting(request: ClientSettingRequestModel): Observable<any> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}.PutClientSetting`,
      {
        request: request
      });
  }

}
