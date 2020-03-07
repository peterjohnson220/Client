import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';
import { AddToProjectRequest } from 'libs/models/payfactors-api';

@Injectable()
export class JobsApiService {
  private endpoint = 'Jobs';

  constructor(private payfactorsApiService: PayfactorsApiService
  ) { }

  addToProject(request: AddToProjectRequest) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/AddToProject`, request);
  }

}
