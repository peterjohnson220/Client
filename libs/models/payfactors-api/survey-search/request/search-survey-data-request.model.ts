import { SearchField, PagingOptions, SearchFilter } from '../../search';

export interface SurveyDataFilterRequest {
    SurveyJobId: number;
    SearchFields: SearchField[];
    Filters: SearchFilter[];
    CurrencyCode: string;
    ProjectId: number;
    PagingOptions: PagingOptions;
  }
