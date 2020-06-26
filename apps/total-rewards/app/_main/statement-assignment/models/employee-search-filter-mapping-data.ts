import { FilterType, SearchFilterMappingDataObj } from 'libs/features/search/models';
export const SearchFilterMappingData: SearchFilterMappingDataObj = {
  'job_family': {
    Type: FilterType.Multi,
    BackingField: 'job_family',
    DisplayName: 'Job Family',
    Order: 2,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'job_level': {
    Type: FilterType.Multi,
    BackingField: 'job_level',
    DisplayName: 'Job Level',
    Order: 3,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'job_grade': {
    Type: FilterType.Multi,
    BackingField: 'job_grade_code',
    DisplayName: 'Job Grade',
    Order: 4,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  }
};
