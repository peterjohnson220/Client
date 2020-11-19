export interface CompositeDataLoadSearchCriteria {
  StartDate?: number;
  EndDate?: number;
  ExcludeTestCompanies: boolean;
  LoaderType?: string;
  Page?: number;
  PageSize?: number;
}
