import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { PayfactorsApiService } from '../payfactors-api.service';
import {AddToProjectRequest} from '../../../../apps/jobs/app/_jobs-page/models/add-to-project';

@Injectable()
export class JobsApiService {
  private endpoint = 'Jobs';

  constructor(private payfactorsApiService: PayfactorsApiService
  ) {}

  addToProject(request: AddToProjectRequest) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/AddToProject`, request);
  }
}
