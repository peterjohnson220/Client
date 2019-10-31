import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { JobDescriptionViewModel, ValidateStepResultItem } from '../../../models/jdm';
import { ControlLabelResponse } from '../../../models/payfactors-api/job-description-management/response';
import {
  JobDescriptionValidationRequest
} from 'apps/pf-admin/app/_utilities/models/requests/job-description-validation-request.model';
import { LoadJobDescriptionRequest } from 'apps/pf-admin/app/_utilities/models/requests/job-description-load-request.model';
import { LibrarySearchRequest } from '../../../../apps/job-description-management/app/shared/models/requests/library-search-request.model';
import { JobDescriptionLibraryResult } from '../../../../apps/job-description-management/app/shared/models/job-description-library-result.model';
import { LibrarySearchBucketResponse } from '../../../../apps/job-description-management/app/shared/models/responses/library-search-bucket-response.model';

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
    return this.payfactorsApiService.get(`${this.endpoint}.GetAvailableControls`);
  }

  getLibrarySearchResultsByBucket(searchRequest: LibrarySearchRequest): Observable<LibrarySearchBucketResponse> {
    return this.payfactorsApiService.get(`${this.endpoint}.GetLibrarySearchResultsByBucket`, {
      selectedBucket: searchRequest.BucketKey,
      jobTitle: searchRequest.JobTitle,
      keyword: searchRequest.Keyword,
      pageSize: searchRequest.PageSize,
      jobDescriptionId: searchRequest.JobDescriptionId
    });
  }

  getLibrarySearchResults(searchRequest: LibrarySearchRequest): Observable<JobDescriptionLibraryResult[]> {
    return this.payfactorsApiService.get(`${this.endpoint}.GetLibrarySearchResults`, {
      bucket: searchRequest.BucketKey,
      jobTitle: searchRequest.JobTitle,
      keyword: searchRequest.Keyword,
      pageSize: searchRequest.PageSize,
      pageNumber: searchRequest.PageNumber,
      jobDescriptionId: searchRequest.JobDescriptionId
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

}
