import { FilterType, SearchFilterMappingDataObj } from 'libs/features/search/models';

export const StructuresSearchFilterMappingDataObj: SearchFilterMappingDataObj = {
  'job_family': {
    Type: FilterType.Multi,
    BackingField: 'job_family',
    DisplayName: 'Job Family',
    Order: 4,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'job_level': {
    Type: FilterType.Multi,
    BackingField: 'job_level',
    DisplayName: 'Job Level',
    Order: 6,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'priced': {
    Type: FilterType.Multi,
    BackingField: 'is_priced',
    DisplayName: 'Priced',
    Order: 8,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'employee_count': {
    Type: FilterType.Multi,
    BackingField: 'employee_count',
    DisplayName: 'Employees',
    Order: 9,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  }
};
