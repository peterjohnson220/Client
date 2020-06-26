import { FilterType } from './filter.model';
import { OperatorEnum } from '../../../constants';

export interface SearchFilterMappingData {
  Type: FilterType;
  BackingField: string;
  DisplayName: string;
  Order: number;
  OptionCountDisabled: boolean;
  SaveDisabled: boolean;
  RefreshOptionsFromServer: boolean;
  Operator?: OperatorEnum;
  ParentBackingField?: string;
  AggregateCount?: number;
  IsCollapsedByDefault?: boolean;
}

interface ISearchFilterMappingDataObj {
  [s: string]: SearchFilterMappingData;
}

export abstract class SearchFilterMappingDataObj implements ISearchFilterMappingDataObj {
  [ s: string ]: SearchFilterMappingData;
}

