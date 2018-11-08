import { Filter } from './filter.model';

export interface SavedFilter {
  Id: string;
  Name: string;
  MetaInfo: any;
  Filters: Filter[];
  Selected: boolean;
}
