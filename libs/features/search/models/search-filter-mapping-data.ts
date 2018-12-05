import { FilterType } from './filter.model';

export interface SearchFilterMappingData {
  Type: FilterType;
  BackingField: string;
  DisplayName: string;
  Order: number;
  OptionCountDisabled: boolean;
  SaveDisabled: boolean;
  RefreshOptionsFromServer: boolean;
}

interface ISearchFilterMappingDataObj {
  [s: string]: SearchFilterMappingData;
}

export abstract class SearchFilterMappingDataObj implements ISearchFilterMappingDataObj {
  [ s: string ]: SearchFilterMappingData;
}

