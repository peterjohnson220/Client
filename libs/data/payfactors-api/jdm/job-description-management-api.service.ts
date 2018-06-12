import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';


@Injectable()
export class JobDescriptionManagementApiService {
  private endpoint = 'JobDescriptionManagement';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getViews(): Observable<string[]> {
    return this.payfactorsApiService.get<string[]>(`${this.endpoint}.GetViews`);
  }
}
