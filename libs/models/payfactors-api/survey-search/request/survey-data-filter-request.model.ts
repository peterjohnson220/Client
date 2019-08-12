import { PagingOptions } from '../../search';
import { DataFilterRequest } from './data-filter-request.model';

export interface SurveyDataFilterRequest extends DataFilterRequest {
  SurveyJobId: number;
  PagingOptions: PagingOptions;
}
