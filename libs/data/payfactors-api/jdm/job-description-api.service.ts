import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { BulkExportSchedule, JobDescription, ValidateStepResultItem } from '../../../models/jdm';
import {
  CreateJobDescriptionDraftRequest,
  CreateJobDescriptionRequest,
  QueryListStateRequest
} from '../../../models/payfactors-api/job-description/request';
import {
  CompanyJobViewListItemsResponse,
  JobInformationFieldForBulkExportResponse,
  JobMatchResultResponse
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
import {
  JobDescriptionDeleteByTemplateIdRequest
} from 'apps/pf-admin/app/_utilities/models/requests/job-description-delete-by-template-id-request.model';

@Injectable()
export class JobDescriptionApiService {
  private endpoint = 'JobDescription';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  addSchedule(schedule: BulkExportSchedule): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Default.CreateBulkExportSchedule`, {schedule});
  }

  appliesToAttributesExist(jobDescriptionId: number, request: GetAppliesToAttributesExistRequest):
    Observable<AppliesToAttributesExistResponse> {
    return this.payfactorsApiService.get<AppliesToAttributesExistResponse>(
      `${this.endpoint}(${jobDescriptionId})/Default.AppliesToAttributesExist`, {
        params: {
          AppliesToField: request.JobDescriptionAppliesTo.AppliesToField,
          AppliesToValue: request.JobDescriptionAppliesTo.AppliesToValue,
          JobDescriptionTitle: request.JobDescriptionAppliesTo.JobDescriptionTitle,
          Editing: request.Editing
        }
      });
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
      {params: {columnName: columnName}});
  }

  getCompanyJobViewListItems(request: QueryListStateRequest):
    Observable<CompanyJobViewListItemsResponse> {
    return this.payfactorsApiService.get<CompanyJobViewListItemsResponse>(`${this.endpoint}/Default.GetCompanyJobViewListItems`,
      {params: request});
  }

  getHistoryList(jobDescriptionId: number): Observable<JobDescriptionHistoryListItemResponse[]> {
    return this.payfactorsApiService.get<JobDescriptionHistoryListItemResponse[]>(
      `${this.endpoint}(${jobDescriptionId})/Default.GetHistoryList`);
  }

  getJobInformationFieldsForBulkExport(viewName?: string): Observable<JobInformationFieldForBulkExportResponse[]> {
    const options = viewName ? {params: {viewName: viewName}} : {};

    return this.payfactorsApiService.get<JobInformationFieldForBulkExportResponse[]>(
      `${this.endpoint}/Default.GetJobInformationFieldsForBulkExport`, options);
  }

  getJobDescriptionIds(companyJobId: number): Observable<number[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/Default.GetJobDescriptionIds`, {params: {companyJobId}});
  }

  getSchedules(): Observable<BulkExportSchedule[]> {
    return this.payfactorsApiService.get<BulkExportSchedule[]>(`${this.endpoint}/Default.GetBulkExportSchedule`);
  }

  isBulkExportAvailable(request: QueryListStateRequest): Observable<boolean> {
    return this.payfactorsApiService.get<boolean>(`${this.endpoint}/Default.IsBulkExportAvailable`, {params: request});
  }

  removeSchedule(fileName: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Default.DeleteBulkExportSchedule`, {fileName});
  }

  downloadPdf(jdmDescriptionId: number): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    const body = 'export-type=pdf';
    return this.payfactorsApiService.downloadFile(`${this.endpoint}(${jdmDescriptionId})/Default.Export`, body, headers, true);
  }

  getPublicTokenUrl(companyId: number): Observable<string> {
    return this.payfactorsApiService.get(`${this.endpoint}/Default.GetPublicListPageUrl`, {params: {companyId: companyId}});
  }

  deleteByTemplateId(jobDescriptionDeleteByTemplateIdRequest: JobDescriptionDeleteByTemplateIdRequest): Observable<ValidateStepResultItem> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.DeleteByTemplateId`, jobDescriptionDeleteByTemplateIdRequest);
  }

  getJobDescriptionJobCompareList(jobDescriptionId: number) {
    return this.payfactorsApiService.get<JobDescription[]>(`${this.endpoint}(${jobDescriptionId})/Default.GetJobCompareList`);
  }

  getDetail(jobDescriptionId: number, revisionNumber: number = null, viewName: string = null): Observable<JobDescription> {
    let params = {};
    if (!!revisionNumber) {
      params = Object.assign({ revisionNumber }, params);
    }
    if (!!viewName) {
      params = Object.assign({ viewName }, params);
    }
    return this.payfactorsApiService.get(`${this.endpoint}(${jobDescriptionId})/Default.GetDetail`, { params },
      (response) => JSON.parse(response.value));
  }

  save(jobDescription: JobDescription, isFirstSave: boolean): Observable<JobDescription> {
    const obj = {
      jobDescriptionAsJsonString: JSON.stringify(jobDescription),
      isFirstSave: isFirstSave
    };
    return this.payfactorsApiService.post(`${this.endpoint}(${jobDescription.JobDescriptionId})/Default.Save`, obj,
      (response => JSON.parse(response.value)));
  }

  publish(jobDescriptionId: number): Observable<JobDescription> {
    return this.payfactorsApiService.post(`${this.endpoint}(${jobDescriptionId})/Default.Publish`, {},
    (response) => JSON.parse(response.value));
  }

  getJobCompare(sourceJobDescriptionId: number, compareJobDescriptionId: number) {
    return this.payfactorsApiService.get(`${this.endpoint}(${sourceJobDescriptionId})/Default.GetJobDescriptionCompare`, {params: {compareJobDescriptionId}},
      (response) => JSON.parse(response.value));
  }

  getVersionCompare(jobDescriptionId: number, revisionNumber: number, previousRevisionNumber: number) {
    return this.payfactorsApiService.get(`${this.endpoint}(${jobDescriptionId})/Default.GetVersionCompare`, {
      params: {
        revisionNumber,
        previousRevisionNumber
      }
    }, (response) => JSON.parse(response.value));
  }

  getJobMatches(jobDescriptionId: number): Observable<JobMatchResultResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}(${jobDescriptionId})/Default.GetJobMatches`);
  }

  discardDraft(jobDescriptionId: number): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}(${jobDescriptionId})/Default.DiscardDraft`, {});
  }
}
