export interface StatementHistoryListResponse {
  Data: StatementHistoryList[];
  TotalCount: number;
}

export interface StatementHistoryList {
  Id: string;
  StatementName: string;
  GeneratedBy: string;
  GeneratedDate: Date;
  EmployeeCount: number;
  DeliveryMethod: string;
}
