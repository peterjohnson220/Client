import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class NotificationsApiService {
  private endpoint = 'Notification';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  getDataViewsExports(): Observable<any[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetDataViewsExportRecords`);
  }
}
