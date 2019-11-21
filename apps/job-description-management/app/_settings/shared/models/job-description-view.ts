export interface JobDescriptionView {
  Id: number;
  CompanyId: number;
  Name: string;
  TemplateId: number;
  HiddenElementIds: number[];
  JobInformationFields: number[];
  Template: any;
}

export function generateMockJobDescriptionView(): JobDescriptionView {
  return {
    Id: 7,
    CompanyId: 13,
    Name: 'Im a View!',
    TemplateId: 100,
    HiddenElementIds: [],
    JobInformationFields: [],
    Template: {}
  };
}
