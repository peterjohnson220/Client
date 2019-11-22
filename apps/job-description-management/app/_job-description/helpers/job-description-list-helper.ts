import { CreateJobDescriptionRequest, CreateJobDescriptionDraftRequest } from 'libs/models/payfactors-api/job-description/request';
import { CreateJobDescriptionResponse } from 'libs/models/payfactors-api/job-description/response';
import { SaveCompanyJobsJobDescriptionTemplateIdRequest } from 'libs/models/payfactors-api/job-description-template/request';

import { CompanyJobViewListItem, JobDescriptionDraftDetails } from '../models';
import { JobDescriptionAppliesTo } from '../../shared/models';

export class JobDescriptionListHelper {

  static mapCreateJobDescriptionResponseToJobDescriptionDraftDetails(response: CreateJobDescriptionResponse): JobDescriptionDraftDetails {
    return {
      JobDescriptionId: response.JobDescriptionId,
      JobDescriptionStatus: response.JobDescriptionStatus,
      JobDescriptionRevision: response.JobDescriptionRevision,
      TemplateId: response.TemplateId,
      DraftNumber: response.DraftNumber
    };
  }

  static buildCreateJobDescriptionRequest(companyJobViewListItem: CompanyJobViewListItem, appliesTo?: JobDescriptionAppliesTo): CreateJobDescriptionRequest {
    if (appliesTo == null) {
      appliesTo = {
        AppliesToField: '',
        AppliesToValue: '',
        JobDescriptionTitle: ''
      };
    }

    return {
      companyJobId: companyJobViewListItem.CompanyJobId,
      appliesToField: appliesTo.AppliesToField,
      appliesToValue: appliesTo.AppliesToValue,
      jobDescriptionTitle: appliesTo.JobDescriptionTitle,
    };
  }

  static buildCreateJobDescriptionDraftRequest(companyJobViewListItem: CompanyJobViewListItem): CreateJobDescriptionDraftRequest {
    return {
      lastPublishedVersionNumber: companyJobViewListItem.VersionNumber,
      jobDescriptionStatus: companyJobViewListItem.JobDescriptionStatus
    };
  }

  static buildSaveCompanyJobsJobDescriptionTemplateIdRequest(companyJobIdsToAssign: number[], companyJobIdsToUnassign: []):
    SaveCompanyJobsJobDescriptionTemplateIdRequest {
    return {
      companyJobIdsToAssign,
      companyJobIdsToUnassign
    };
  }
}