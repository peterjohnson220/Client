export interface StatementListViewModel {
  Id: string;
  Name: string;
  CreatedBy: string;
  CreatedDate: Date;
  LastRunBy: string;
  LastRunDate: Date;
  Employees: number;
  Jobs: number;
  Status: 'Active' | 'Draft';
}
