import { generateMockJobDescriptionAppliesTo, JobDescriptionAppliesTo } from './job-description-applies-to.model';

export interface AppliesToAttributesExist {
  JobDescriptionTitleExists: boolean;
  AppliesToExists: boolean;
  AppliesToValueInvalid: boolean;
  CanRemoveValues: boolean;
  JobDescriptionAppliesTo: JobDescriptionAppliesTo;
}

export function generateMockAppliesToAttributesExist(): AppliesToAttributesExist {
  return {
    JobDescriptionTitleExists: false,
    AppliesToExists: false,
    AppliesToValueInvalid: false,
    CanRemoveValues: false,
    JobDescriptionAppliesTo: generateMockJobDescriptionAppliesTo()
  };
}
