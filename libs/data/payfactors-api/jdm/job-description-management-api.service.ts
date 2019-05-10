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
    return this.payfactorsApiService.get<ControlLabelResponse[]>(`${this.endpoint}.GetDistinctControlLabels`,
      {params: {viewName: viewName || ''}});
  }

  getViewNames(templateId: number = null): Observable<string[]> {
    return this.payfactorsApiService.get<string[]>(`${this.endpoint}.GetViewNames`, {params: {templateId: templateId}});
  }

  getViews(): Observable<JobDescriptionViewModel[]> {
    return this.payfactorsApiService.get<JobDescriptionViewModel[]>(`${this.endpoint}.GetViews`);
  }
}
