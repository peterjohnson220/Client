import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';

import { JobDescriptionViewModel } from '../../../models/jdm/job-description-view.model';
import { ControlLabelResponse } from '../../../models/payfactors-api/job-description-management/response';


@Injectable()
export class JobDescriptionManagementApiService {
  private endpoint = 'JobDescriptionManagement';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getDistinctControlLabels(viewName?: string): Observable<ControlLabelResponse[]> {
    const options = viewName ? { params: { viewName: viewName } } : {};

    return this.payfactorsApiService.get<ControlLabelResponse[]>(`${this.endpoint}.GetDistinctControlLabels`, options);
  }

  getViewNames(templateId: number = null): Observable<string[]> {
    const options = templateId ? { params: { templateId: templateId } } : {};

    return this.payfactorsApiService.get<string[]>(`${this.endpoint}.GetViewNames`, options);
  }

  getViews(): Observable<JobDescriptionViewModel[]> {
    return this.payfactorsApiService.get<JobDescriptionViewModel[]>(`${this.endpoint}.GetViews`);
  }
}
