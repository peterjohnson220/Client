export interface ExportAssignedEmployeesRequest {
  StatementId: string;
  EmployeeIds?: number[];
  EmployeeSearchTerm?: string;
  GridListState: any;
}
