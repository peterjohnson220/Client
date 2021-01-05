import { JobDescriptionAppliesTo } from 'libs/features/jobs/job-description-management/models';

export interface GetAppliesToAttributesExistRequest {
  JobDescriptionAppliesTo: JobDescriptionAppliesTo;
  Editing: boolean;
}
