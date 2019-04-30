import { JobDescriptionAppliesTo } from '../../../../../apps/job-description-management/app/shared/models/job-description-applies-to.model';

export interface GetAppliesToAttributesExistRequest {
  JobDescriptionAppliesTo: JobDescriptionAppliesTo;
  Editing: boolean;
}
