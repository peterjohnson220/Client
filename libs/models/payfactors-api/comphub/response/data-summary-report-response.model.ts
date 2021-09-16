export interface DataSummaryReportResponse {
  Report: ReportResponse;
}

export interface ReportResponse {
  SubReports: SubReport[];
}

export interface SubReport {
  Name: string;
  Rows: SubReportResponse[];
}

export interface SubReportResponse {
  Name: string;
  Percent: number;
}
