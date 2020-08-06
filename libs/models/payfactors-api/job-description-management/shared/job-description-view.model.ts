export interface JobDescriptionViewApi {
  Id: number;
  CompanyId: number;
  Name: string;
  TemplateId: number;
  HiddenElementIds: number[];
  HiddenControlNameElementIds: number[];
  HiddenSubHeadingElementIds: number[];
  Template?: any;
  JobInformationFields: number[];
}

