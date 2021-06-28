export interface StatementHistoryViewModel {
  StatementHistory: StatementHistoryListViewModel[];
  TotalCount: number;
}

export interface StatementHistoryListViewModel {
  Id: string;
  StatementName: string;
  GeneratedBy: string;
  GeneratedDate: Date;
  EmployeeCount: number;
  DeliveryMethod: string;
}
