export class JobDescriptionAppliesTo {
  AppliesToField: string;
  AppliesToValue: string;
  JobDescriptionTitle: string;
}


export function generateMockJobDescriptionAppliesTo(): JobDescriptionAppliesTo {
  return {
    AppliesToField: 'Test Applies To Field',
    AppliesToValue: 'Test Applies To Value',
    JobDescriptionTitle: 'Test Job Description Title'
  };
}
