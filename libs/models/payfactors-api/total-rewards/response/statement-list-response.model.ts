export interface StatementListResponse {
  TotalCount: number;
  Data: StatementList[];
}

export interface StatementList {
  Id: string;
  Name: string;
  CompanyId: number;
  CreatedBy: string;
  CreatedDate: Date;
  LastGeneratedBy: string;
  LastGeneratedDate?: Date;
  Employees: number;
}
