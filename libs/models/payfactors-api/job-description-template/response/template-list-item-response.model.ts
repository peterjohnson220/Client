export interface TemplateListItemResponse {
  TemplateId: number;
  TemplateName: string;
  CreatedDate: Date;
  CreatedBy: string;
  LastModifiedDate: Date;
  LastModifiedBy: string;
  AssignedJobsCount: number;
  Status: string;
  Version: number;
}
