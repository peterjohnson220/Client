import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { JobDescriptionViewModel, ValidateStepResultItem } from '../../../models/jdm';
import { ControlLabelResponse } from '../../../models/payfactors-api/job-description-management/response';
import {
  JobDescriptionValidationRequest
} from 'apps/pf-admin/app/_utilities/models/requests/job-description-validation-request.model';
import { LoadJobDescriptionRequest } from 'apps/pf-admin/app/_utilities/models/requests/job-description-load-request.model';
import { LibrarySearchRequest, JobDescriptionLibraryResult, JobDescriptionLibraryBucket } from '../../../../apps/job-description-management/app/shared/models';
import { UpdateViewsRequest } from '../../../models/payfactors-api/job-description-management/request';
import { JobDescriptionViewApi } from '../../../models/payfactors-api/job-description-management/shared';

@Injectable()
export class JobDescriptionManagementApiService {
  private endpoint = 'JobDescriptionManagement';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getDistinctControlLabels(viewName?: string): Observable<ControlLabelResponse[]> {
    const options = viewName ? {params: {viewName: viewName}} : {};

    return this.payfactorsApiService.get<ControlLabelResponse[]>(`${this.endpoint}.GetDistinctControlLabels`, options);
  }

  getJobsByControlOptionValue(type: string, fieldName: string, fieldOptionValue: string): Observable<string[]> {
    return this.payfactorsApiService.get(`${this.endpoint}.GetJobsByControlOptionValue`, {
      type: type,
      fieldName: fieldName,
      fieldOptionValue: fieldOptionValue
    });
  }

  getViewNames(templateId: number = null): Observable<string[]> {
    const options = templateId ? {params: {templateId: templateId}} : {};

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
    return this.payfactorsApiService.get(`${this.endpoint}.GetAvailableControls`, {}, (response) => JSON.parse(response.value));
  }

  getLibrarySearchResultsByBucket(searchRequest: LibrarySearchRequest): Observable<JobDescriptionLibraryBucket[]> {
    return this.payfactorsApiService.get(`${this.endpoint}.GetLibrarySearchResultsByBucket`, {
      params: {
        selectedBucket: searchRequest.BucketKey,
        jobTitle: searchRequest.JobTitle,
        keyword: searchRequest.Keyword,
        pageSize: searchRequest.PageSize,
        jobDescriptionId: searchRequest.JobDescriptionId
      }
    });
  }

  getLibrarySearchResults(searchRequest: LibrarySearchRequest): Observable<JobDescriptionLibraryResult[]> {
    return this.payfactorsApiService.get(`${this.endpoint}.GetLibrarySearchResults`, {
      params: {
        bucket: searchRequest.BucketKey,
        jobTitle: searchRequest.JobTitle,
        keyword: searchRequest.Keyword,
        pageSize: searchRequest.PageSize,
        pageNumber: searchRequest.PageNumber,
        jobDescriptionId: searchRequest.JobDescriptionId
      }
    });
  }

  userEmailHasJobPermission(emailAddr: string, jobId: number) {
    return this.payfactorsApiService.get(`${this.endpoint}.UserEmailHasJobPermission`, {UserEmail: emailAddr, JobId: jobId});
  }

  inactivateControl(controlType: string) {
    return this.payfactorsApiService.post(`${this.endpoint}.InactivateControl`, {ControlType: controlType});
  }

  getPublicJdmColumns(companyId: number) {
    return this.payfactorsApiService.get(`${this.endpoint}.GetPublicJdmColumns?companyId=${companyId}`);
  }

  deleteView(name: string) {
    return this.payfactorsApiService.post(`${this.endpoint}.DeleteView`, { Name: name });
  }

  getTemplateViews(viewName: string): Observable<JobDescriptionViewApi[]> {
    return this.payfactorsApiService.get<JobDescriptionViewApi[]>(`${this.endpoint}.GetTemplateViews`, { params: { viewName } },
      (response) => JSON.parse(response.value));
  }

  updateViews(request: UpdateViewsRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.UpdateViews`, request);
  }
}
