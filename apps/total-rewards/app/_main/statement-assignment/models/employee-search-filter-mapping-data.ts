import { FilterType, SearchFilterMappingDataObj } from 'libs/features/search/search/models';

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
  'job_grades': {
    Type: FilterType.Multi,
    BackingField: 'job_grades',
    DisplayName: 'Job Grade',
    Order: 4,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'work_country': {
    Type: FilterType.Multi,
    BackingField: 'work_country',
    DisplayName: 'Work Country',
    Order: 5,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'manager_name': {
    Type: FilterType.Multi,
    BackingField: 'manager_name',
    DisplayName: 'Manager Name',
    Order: 6,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'facility': {
    Type: FilterType.Multi,
    BackingField: 'facility',
    DisplayName: 'Facility',
    Order: 7,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  }
};
