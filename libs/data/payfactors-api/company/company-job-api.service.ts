import { Injectable } from '@angular/core';

import { CompanyJob, Match, CompanyJobToMapTo, LatestCompanyJob, JobInfoResponse, CompanyJobAttachment, ODataQuery, generateQueryObject } from 'libs/models';
import { CompanyJobUdfColumn } from 'libs/models/jdm/company-job-udf-column';

import { PayfactorsApiService } from '../payfactors-api.service';
import { Observable } from 'rxjs';
import { ChangeJobStatusRequest } from 'libs/models/payfactors-api';

@Injectable()
export class CompanyJobApiService {
  private endpoint = 'CompanyJob';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) { }

  getTopCompanyJobsToMapTo(exchangeId: number, jobTitleAndCodeQuery: string,
    jobDescriptionQuery: string): Observable<CompanyJobToMapTo[]> {
    return this.payfactorsApiService.get<CompanyJobToMapTo[]>(`${this.endpoint}/GetTopCompanyJobsToMapTo`,
      { params: { exchangeId, jobTitleAndCodeQuery, jobDescriptionQuery } }
    );
  }

  getMatches(companyJobId: number): Observable<Match[]> {
    return this.payfactorsApiService.get<Match[]>(`${this.endpoint}(${companyJobId})/Default.GetSurveyParticipationJobs`);
  }

  getCompanyJobTitleAndCode(companyJobId: number): Observable<CompanyJob> {
    return this.payfactorsApiService.get<CompanyJob>(`${this.endpoint}?$filter=CompanyJobId%20eq%20${companyJobId}`);
  }

  getJobFamilies(): Observable<string[]> {
    return this.payfactorsApiService.get<string[]>(`${this.endpoint}/Default.GetJobFamilies`);
  }

  getCompanyJobs(companyJobIds: number[]): Observable<LatestCompanyJob[]> {
    return (this.payfactorsApiService.post<LatestCompanyJob[]>(`${this.endpoint}/Default.GetCompanyJobsByIds`,
      { companyJobIds: companyJobIds })
    );
  }

  getCompanyJob(companyJobId: number): Observable<JobInfoResponse> {
    return (this.payfactorsApiService.get<JobInfoResponse>(`${this.endpoint}(${companyJobId})/Default.GetEditJobModalInfo`));
  }

  getCompanyFLSAStatuses(): Observable<string[]> {
    return this.payfactorsApiService.get<string[]>(`${this.endpoint}/Default.GetCompanyFLSAStatuses`);
  }

  getJobUserDefinedFields(): Observable<CompanyJobUdfColumn[]> {
    return this.payfactorsApiService.get<CompanyJobUdfColumn[]>(`${this.endpoint}.GetJobUserDefinedFields`);
  }

  getJobSummary(companyJobId: number) {
    return this.payfactorsApiService.get(`${this.endpoint}(${companyJobId})/Default.GetJobSummary`);
  }

  changeJobStatus(request: ChangeJobStatusRequest) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Default.SetStatusForJobs`, request);
  }

  saveCompanyJob(request: CompanyJob): Observable<CompanyJob> {
    return request.CompanyJobId ? this.patchCompanyJob(request) : this.createCompanyJob(request);
  }

  uploadAttachments(attachments: File[]): Observable<CompanyJobAttachment[]> {
    return (this.payfactorsApiService.postFormData(`CloudFiles.UploadJobAttachment`, attachments));
  }

  createCompanyJob(request: CompanyJob): Observable<CompanyJob> {
    return this.payfactorsApiService.post<CompanyJob>(`${this.endpoint}/`, request);
  }

  patchCompanyJob(request: CompanyJob): Observable<CompanyJob> {
    return this.payfactorsApiService.patch<CompanyJob>(`${this.endpoint}(${request.CompanyJobId})/`, request);
  }

  deleteCompanyJob(jobId: number): Observable<CompanyJob> {
    return this.payfactorsApiService.delete(`${this.endpoint}(${jobId})/`);
  }

  getJobsByFamilyNotAssignedToTemplate(jobFamily: string, templateId: Number) {
    return this.payfactorsApiService.get(`${this.endpoint}/Default.GetJobsByFamilyNotAssignedToTemplate`,
      {params: {jobFamily: jobFamily, templateId: templateId}});
  }

  getJobsByFamilyWithTemplate(jobFamily: string, templateId: Number) {
      return this.payfactorsApiService.get(`${this.endpoint}/Default.GetJobsByFamilyWithTemplate`,
        {params: {jobFamily: jobFamily, templateId: templateId}});
  }

  getAll(query: ODataQuery): Observable<CompanyJob[]> {
    const fieldOptions = generateQueryObject(query);
    return this.payfactorsApiService.get<CompanyJob[]>(`${this.endpoint}`, { params: fieldOptions });
  }

  getCompanyJobDescriptionInformation(companyJobIds: number[]) {
    return this.payfactorsApiService.post<any[]>(`${this.endpoint}/Default.GetCompanyJobDescriptionsInReview`,
      {companyJobIds: companyJobIds});
  }
}

