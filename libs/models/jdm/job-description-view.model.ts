export interface JobDescriptionViewModel {
  Id: string;
  Name: string;
  TemplateId: number;
  HiddenElementIds: number[];
  Template: any;
  JobInformationFields: number[];
}

export function generateMockJobDescriptionViewModel(): JobDescriptionViewModel {
  return {
    Id: '0',
    Name: 'test job description view model',
    TemplateId: 0,
    HiddenElementIds: [0],
    Template: null,
    JobInformationFields: [0]
  };
}
