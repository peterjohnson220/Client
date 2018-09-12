import {SearchField, PagingOptions} from './search-request.model';
import {SearchFilter} from './search-filter.model';

export interface SurveyDataFilterRequest {
    SurveyJobId: number;
    SearchFields: SearchField[];
    Filters: SearchFilter[];
    CurrencyCode: string;
    ProjectId: number;
    PagingOptions: PagingOptions;
  }
