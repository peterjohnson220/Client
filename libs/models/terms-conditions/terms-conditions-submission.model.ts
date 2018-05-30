export interface TermsConditionsSubmissionModel {
  TCId: string;
  Accepted: boolean;
}

export function generateMockTermsConditionsSubmissionModel(): TermsConditionsSubmissionModel {
  return {
    TCId: '5afc516369d8b06178007ee1',
    Accepted: true
  };
}


