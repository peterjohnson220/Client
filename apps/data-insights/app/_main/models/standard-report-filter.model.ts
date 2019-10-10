export interface StandardReportFilter {
  FieldName: string;
  FilterValue: string;
}

export enum StandardReportTitle {
  PublishedCompositesWithEmployees = 'Published Composites with Employees',
  SalaryStructures = 'Salary Structures'
}

export enum StandardReportSheetName {
  EmployeesAndMarketData = 'Employees and Market Data',
  SalaryStructures = 'Salary Structures'
}
