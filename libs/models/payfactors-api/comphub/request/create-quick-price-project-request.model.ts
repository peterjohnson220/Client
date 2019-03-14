export interface CreateQuickPriceProjectRequest {
  JobCode: string;
  ProjectTitle: string;
  CompanyPayMarketId: number;
  Rate: string;
  EffectiveDate: Date;
  Currency: string;
}
