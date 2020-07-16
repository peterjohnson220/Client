import { JobDescriptionAppliesTo } from 'libs/features/job-description-management/models';

export interface GetAppliesToAttributesExistRequest {
  JobDescriptionAppliesTo: JobDescriptionAppliesTo;
  Editing: boolean;
}
