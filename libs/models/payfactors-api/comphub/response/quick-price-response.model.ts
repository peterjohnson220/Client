export interface QuickPriceResponse {
  Count: number;
  Data: QuickPriceMarketData[];
}

export interface QuickPriceMarketData {
  JobId: number;
  JobTitle: string;
  JobDescription: string;
  Education: string;
  YearsOfExperience: string;
  ManagesEmployees: boolean;
  Skills: string[];
  Base25?: number;
  Base50?: number;
  Base75?: number;
  Tcc25?: number;
  Tcc50?: number;
  Tcc75?: number;
  Incs?: number;
  Orgs?: number;
}

