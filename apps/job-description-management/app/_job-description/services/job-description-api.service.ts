import { Injectable } from '@angular/core';
import { State } from '@progress/kendo-data-query';

import {PayfactorsApiService} from 'libs/data/payfactors-api/payfactors-api.service';
import { JobDescription } from 'libs/models/jdm';

import {JobDescriptionAppliesTo} from '../../shared/models/job-description-applies-to.model';
import {FlsaQuestionnaireDetails} from '../models/flsa-questionnaire-details.model';

@Injectable()
export class JobDescriptionApiService {
  private apiUrl = 'JobDescription';

  constructor(private apiService: PayfactorsApiService) { }

  createProjectFromMatches(jobDescriptionId: number, surveyJobIds: number[], payfactorsJobIds: number[]) {
    return this.apiService.post(`${this.apiUrl}(${jobDescriptionId})/Default.CreateProjectFromMatches`, { surveyJobIds, payfactorsJobIds});
  }

  discardDraft(jobDescriptionId: number) {
    return this.apiService.post(`${this.apiUrl}(${jobDescriptionId})/Default.DiscardDraft`, {});
  }

  getCompanyJobViewListItems(query: string, gridState: State) {
    return this.apiService.get(`${this.apiUrl}/Default.GetCompanyJobViewListItems`, { query, listState: gridState });
  }

  isBulkExportAvailable(query: string, gridState: State) {
    return this.apiService.get(`${this.apiUrl}/Default.IsBulkExportAvailable`, { query, listState: gridState });

  }

  getAppliesTo() {
    return this.apiService.get(`${this.apiUrl}/Default.GetAppliesToItems`, {});
  }

  getAppliesToValue(columnName: string) {
    return this.apiService.get(`${this.apiUrl}/Default.GetAppliesToValues`, { columnName });
  }

  appliesToAttributesExist(jobDescriptionId: number, jobDescriptionTitle: string,  appliesToField: string,
                           appliesToValue: string, editing: boolean) {
    return this.apiService.get(`${this.apiUrl}(${jobDescriptionId})/Default.AppliesToAttributesExist`,
      { jobDescriptionTitle, appliesToField, appliesToValue, editing});
  }

  getJobsAsSourceForJobDescriptionCopyFrom(jobDescriptionId: number, templateId: number, jobFamily: string) {
    return this.apiService.get(`${this.apiUrl}(${jobDescriptionId})/Default.GetJobsAsSourceForJobDescriptionCopyFrom`, {
      templateId: templateId,
      jobFamily: jobFamily
    });
  }

  getJobDescriptionExtendedInfo(jobDescriptionId: number, revisionNumber: number) {
    return this.apiService.get(`${this.apiUrl}(${jobDescriptionId})/Default.GetExtendedInfo`, { revisionNumber });
  }

  getJobMatches(jobDescriptionId: number) {
    return this.apiService.get(`${this.apiUrl}(${jobDescriptionId})/Default.GetJobMatches`);
  }

  getDetail(jobDescriptionId: number, viewName: string = null) {
    return this.apiService.get(`${this.apiUrl}(${jobDescriptionId})/Default.GetDetail`, { viewName });
  }

  getVersionCompare(jobDescriptionId: number, revisionNumber: number, previousRevisionNumber: number) {
    return this.apiService.get(`${this.apiUrl}(${jobDescriptionId})/Default.GetVersionCompare`,
      {params: { revisionNumber: revisionNumber, previousRevisionNumber: previousRevisionNumber }});
  }

  getFlsaQuestionnaire(jobDescriptionId: number, jobDescriptionVersion: number, isHistorical: boolean) {
    return this.apiService.get(`${this.apiUrl}(${jobDescriptionId})/Default.GetFlsaQuestionnaire`, {
      jobDescriptionVersion: jobDescriptionVersion,
      isHistorical: isHistorical
    });
  }

  getHistoricalDetail(jobDescriptionId: number, revisionNumber: number, viewName: string = null) {
    return this.apiService.get(`${this.apiUrl}(${jobDescriptionId})/Default.GetDetail`, { revisionNumber, viewName });
  }

  getHistoryList(jobDescriptionId: number) {
    return this.apiService.get(`${this.apiUrl}(${jobDescriptionId})/Default.GetHistoryList`);
  }

  getPublicTokenUrl(companyId: number) {
    return this.apiService.get(`${this.apiUrl}/Default.GetPublicListPageUrl`, { companyId: companyId });
  }

  create(companyJobId: number, jobDescriptionAppliesTo: JobDescriptionAppliesTo) {
    const obj = {
      companyJobId: companyJobId,
      appliesToField: jobDescriptionAppliesTo.AppliesToField ,
      appliesToValue: jobDescriptionAppliesTo.AppliesToValue ,
      jobDescriptionTitle: jobDescriptionAppliesTo.JobDescriptionTitle
    };
    return this.apiService.post(`${this.apiUrl}/Default.Create`, obj);
  }

  createDraft(jobDescriptionId: number, lastPublishedVersionNumber: number, jobDescriptionStatus: string) {
    const obj = {
      lastPublishedVersionNumber: lastPublishedVersionNumber,
      jobDescriptionStatus: jobDescriptionStatus
    };

    return this.apiService.post(`${this.apiUrl}(${jobDescriptionId})/Default.CreateDraft`, obj);
  }

  save(jobDescription: JobDescription, isFirstSave: boolean) {
    const obj = {
      jobDescriptionAsJsonString: JSON.stringify(jobDescription),
      isFirstSave: isFirstSave
    };
    return this.apiService.post(`${this.apiUrl}(${jobDescription.JobDescriptionId})/Default.Save`, obj);
  }

  saveFlsaQuestionnaire(flsaQuestionnaireDetails: FlsaQuestionnaireDetails) {
    const obj = {
      flsaQuestionnaireJsonString: JSON.stringify(flsaQuestionnaireDetails)
    };
    return this.apiService.post(`${this.apiUrl}/Default.SaveFlsaQuestionnaire`, obj);
  }

  publish(jobDescriptionId: number) {
    return this.apiService.post(`${this.apiUrl}(${jobDescriptionId})/Default.Publish`, {});
  }

  copyFrom(jobDescriptionId: number, jobDescriptionIdToCopyFrom: number, jobDescriptionStatus: string) {

    return this.apiService.post(`${this.apiUrl}(${jobDescriptionId})/Default.CopyFrom`,
      { jobDescriptionIdToCopyFrom: jobDescriptionIdToCopyFrom, jobDescriptionStatus: jobDescriptionStatus });
  }

  getEmployeeAcknowledgementInfo() {
    return this.apiService.get(`${this.apiUrl}/Default.GetEmployeeAcknowledgementInfo`);
  }

  acknowledge(signature: string) {
    return this.apiService.post(`${this.apiUrl}/Default.EmployeeAcknowledge`, {signature: signature});
  }

  getWorkflowCompareList(jobDescriptionId: number) {
    return this.apiService.get(`${this.apiUrl}(${jobDescriptionId})/Default.GetWorkflowCompareList`);
  }

  getWorkflowCompare(jobDescriptionId: number, sourceStepNumber: number, comparisonStepNumber: number) {
    return this.apiService.get(`${this.apiUrl}(${jobDescriptionId})/Default.GetWorkflowCompare`, {
      sourceStepNumber,
      comparisonStepNumber
    });
  }

  deleteByTemplateId(companyId: number, templateId: number) {
    return this.apiService.post(`${this.apiUrl}/Default.DeleteByTemplateId`, { companyId, templateId });
  }

  getJobCompareList(jobDescriptionId: number) {
    return this.apiService.get(`${this.apiUrl}(${jobDescriptionId})/Default.GetJobCompareList`);
  }

  getJobCompare(sourceJobDescriptionId: number, compareJobDescriptionId: number) {
    return this.apiService.get(`${this.apiUrl}(${sourceJobDescriptionId})/Default.GetJobDescriptionCompare`, { compareJobDescriptionId });
  }

  getJobInformationFieldsForBulkExport(viewName?: string) {
    return this.apiService.get(`${this.apiUrl}/Default.GetJobInformationFieldsForBulkExport`, {viewName});
  }
}
