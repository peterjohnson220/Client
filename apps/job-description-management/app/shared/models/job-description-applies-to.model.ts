export class JobDescriptionAppliesTo {
  AppliesToField: string;
  AppliesToValue: string;
  JobDescriptionTitle: string;
  PublicView: boolean;
}


export function generateMockJobDescriptionAppliesTo(): JobDescriptionAppliesTo {
  return {
    AppliesToField: 'Test Applies To Field',
    AppliesToValue: 'Test Applies To Value',
    JobDescriptionTitle: 'Test Job Description Title',
    PublicView: true
  };
}
