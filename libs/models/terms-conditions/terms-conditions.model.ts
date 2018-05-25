export interface TermsConditionsModel {
  TCId: string;
  Type: string;
  Description: string;
  Title: string;
  Content: string;
  Active: boolean;
  Created: any;
  Responses?: any;
}

export function generateMockTermsConditionsModel(): TermsConditionsModel {
  return {
    TCId: '5afc516369d8b06178007ee1',
    Type: 'peer',
    Description: 'test description',
    Title: 'test title',
    Content: 'test content',
    Active: true,
    Created: '01/01/2017',
    Responses: ''
  };
}
