import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { JobDescriptionViewModel, ValidateStepResultItem } from '../../../models/jdm';
import { ControlLabelResponse } from '../../../models/payfactors-api/job-description-management/response';
import {
  JobDescriptionValidationRequest
} from 'apps/pf-admin/app/_utilities/models/requests/job-description-validation-request.model';
import { LoadJobDescriptionRequest } from 'apps/pf-admin/app/_utilities/models/requests/job-description-load-request.model';

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

  validate(jobDescriptionValidationRequest: JobDescriptionValidationRequest): Observable<ValidateStepResultItem> {
    return this.payfactorsApiService.postFormData(`${this.endpoint}.ValidateImport`, jobDescriptionValidationRequest);
  }

  load(loadJobDescriptionRequest: LoadJobDescriptionRequest): Observable<ValidateStepResultItem> {
    return this.payfactorsApiService.post(`${this.endpoint}.Import`, loadJobDescriptionRequest);
  }

  getAvailableControls(): Observable<any> {
    return this.payfactorsApiService.get(`${this.endpoint}.GetAvailableControls`);
  }
}
