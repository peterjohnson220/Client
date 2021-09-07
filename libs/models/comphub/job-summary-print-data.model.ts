export interface JobSummaryPrintData {
  JobTitle: string;
  Base10?: number;
  Base25?: number;
  Base50?: number;
  Base75?: number;
  Base90?: number;
  BaseAvg?: number;
  Total10?: number;
  Total25?: number;
  Total50?: number;
  Total75?: number;
  Total90?: number;
  TotalAvg?: number;
  SelectedPayMarket: string;
  Industry: string;
  OrganizationType: string;
  AverageSizeCompetitor: string;
  City: string;
  State: string;
  Country: string;
  GovernmentContractor: string;
  YearsExperience?: number;
  Skills: string[];
  Certs: string[];
  Education: string;
  SupervisoryRole: string;
  DataSummaryReports: DataSummaryReportData[];
  UserName: string;
  ReportDate: string;
}

export interface DataSummaryReportData {
  Name: string;
  Rows: DataSummaryReportRowData[];
}

export interface DataSummaryReportRowData {
  Answer: string;
  PercentMatch: number;
}

