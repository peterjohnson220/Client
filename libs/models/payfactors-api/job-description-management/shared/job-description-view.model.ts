export interface JobDescriptionViewApi {
  Id: number;
  CompanyId: number;
  Name: string;
  TemplateId: number;
  HiddenElementIds: number[];
  Template?: any;
  JobInformationFields: number[];
}

