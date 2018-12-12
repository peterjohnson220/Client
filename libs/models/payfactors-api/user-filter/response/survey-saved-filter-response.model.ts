import { SearchFilter } from '../../survey-search/response';
import { SurveySavedFilterMetaInfo } from '../survey-saved-filter-meta-info';

export interface SurveySavedFilterResponse {
  Id: string;
  Name: string;
  MetaInfo: SurveySavedFilterMetaInfo;
  Filters: SearchFilter[];
}
