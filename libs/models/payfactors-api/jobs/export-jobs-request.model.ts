export interface ExportJobsRequest {
  CompanyJobIds: number[];
  PricingIds: number[];
  FileExtension: string;
  Name: string;
  PageViewId: string;
  Endpoint: string;
}
