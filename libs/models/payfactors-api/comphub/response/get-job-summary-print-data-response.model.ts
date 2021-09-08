import { CompensableFactorsResponse } from './compensable-factors-response.model';
import { DataSummaryReportResponse } from './data-summary-report-response.model';

export interface GetJobSummaryPrintDataResponse {
  JobTitle: string;
  Base10th?: number;
  Base25th?: number;
  Base50th?: number;
  Base75th?: number;
  Base90th?: number;
  BaseAvg?: number;
  Total10th?: number;
  Total25th?: number;
  Total50th?: number;
  Total75th?: number;
  Total90th?: number;
  TotalAvg?: number;
  SelectedPayMarket: string;
  Industry: string;
  Location: LocationResponse;
  SelectedFactors: CompensableFactorsResponse[];
  DataSummaryReport: DataSummaryReportResponse;
  UserName: string;
  ReportDate: string;
  Rate: string;
}

export interface LocationResponse {
  OrganizationType: string;
  AverageSizeCompetitor: string;
  City: string;
  State: string;
  Country: string;
  GovernmentContractor: string;
}
