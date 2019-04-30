import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { BulkExportSchedule } from '../../../models/jdm';
import {
  CreateJobDescriptionDraftRequest,
  CreateJobDescriptionRequest,
  QueryListStateRequest
} from '../../../models/payfactors-api/job-description/request';
import {
  CompanyJobViewListItemsResponse,
  JobInformationFieldForBulkExportResponse
} from '../../../models/payfactors-api/job-description/response';
import {
  JobDescriptionHistoryListItemResponse
} from '../../../models/payfactors-api/job-description-management/response';
import {
  JobDescriptionAppliesToItemResponse
} from '../../../models/payfactors-api/job-description/response/job-description-appliesto-item-response.model';
import {
  GetAppliesToAttributesExistRequest
} from '../../../models/payfactors-api/job-description/request/get-applies-to-attributes-exist-request.model';
import {
  AppliesToAttributesExistResponse
} from '../../../models/payfactors-api/job-description/response/applies-to-attributes-exist-response.model';

@Injectable()
export class JobDescriptionApiService {
  private endpoint = 'JobDescription';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  addSchedule(schedule: BulkExportSchedule): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Default.CreateBulkExportSchedule`, { schedule });
  }

  appliesToAttributesExist(jobDescriptionId: number, request: GetAppliesToAttributesExistRequest):
    Observable<AppliesToAttributesExistResponse> {
    return this.payfactorsApiService.get<AppliesToAttributesExistResponse>(
      `${this.endpoint}(${jobDescriptionId})/Default.AppliesToAttributesExist`, { params: request });
  }

  createJobDescription(request: CreateJobDescriptionRequest): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}/Default.Create`, request);
  }

  createJobDescriptionDraft(jobDescriptionId: number, request: CreateJobDescriptionDraftRequest): Observable<string> {
    return this.payfactorsApiService.post<string>(`${this.endpoint}(${jobDescriptionId})/Default.CreateDraft`, request);
  }

  getAppliesTo(): Observable<JobDescriptionAppliesToItemResponse[]> {
    return this.payfactorsApiService.get<JobDescriptionAppliesToItemResponse[]>(`${this.endpoint}/Default.GetAppliesToItems`);
  }

  getAppliesToValue(columnName: string): Observable<string[]> {
    return this.payfactorsApiService.get<string[]>(`${this.endpoint}/Default.GetAppliesToValues`,
      {params: { columnName: columnName }});
  }

  getCompanyJobViewListItems(request: QueryListStateRequest):
    Observable<CompanyJobViewListItemsResponse> {
    return this.payfactorsApiService.get<CompanyJobViewListItemsResponse>(`${this.endpoint}/Default.GetCompanyJobViewListItems`,
      { params: request });
  }

  getHistoryList(jobDescriptionId: number): Observable<JobDescriptionHistoryListItemResponse[]> {
    return this.payfactorsApiService.get<JobDescriptionHistoryListItemResponse[]>(
      `${this.endpoint}(${jobDescriptionId})/Default.GetHistoryList`);
  }

  getJobInformationFieldsForBulkExport(viewName?: string): Observable<JobInformationFieldForBulkExportResponse[]> {
    return this.payfactorsApiService.get<JobInformationFieldForBulkExportResponse[]>(
      `${this.endpoint}/Default.GetJobInformationFieldsForBulkExport`, {params: { viewName: viewName || '' }});
  }

  getSchedules(): Observable<BulkExportSchedule[]> {
    return this.payfactorsApiService.get<BulkExportSchedule[]>(`${this.endpoint}/Default.GetBulkExportSchedule`);
  }

  isBulkExportAvailable(request: QueryListStateRequest): Observable<boolean> {
    return this.payfactorsApiService.get<boolean>(`${this.endpoint}/Default.IsBulkExportAvailable`, {params: request});
  }

  removeSchedule(fileName: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Default.DeleteBulkExportSchedule`, { fileName });
  }
}
