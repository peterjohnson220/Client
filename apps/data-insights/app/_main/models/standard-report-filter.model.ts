export interface StandardReportFilter {
  FieldName: string;
  FilterValue: string;
}

export enum StandardReportTitle {
  PublishedCompositesWithEmployees = 'Published%20Composites%20with%20Employees',
  SalaryStructures = 'Salary%20Structures'
}

export enum StandardReportSheetName {
  EmployeesAndMarketData = 'EmployeesandMarketData',
  SalaryStructures = 'SalaryStructures'
}
