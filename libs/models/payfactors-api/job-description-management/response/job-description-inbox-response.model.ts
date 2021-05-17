export interface JobDescriptionInboxResponse {
  TotalCount: number;
  Data: JobDescriptionInbox[];
}

export interface JobDescriptionInbox {
  CompanyWorkflowStepUserId: number;
  CreateDate: Date;
  CreatedBy: string;
  CurrentReviewer: string;
  IsRead: boolean;
  JobCode: string;
  JobDescriptionId: number;
  JobTitle: string;
  LastUpdatedDate: Date;
  StatusChangedDate: Date;
  Token: string;
  VersionNumber: number;
}
