import { FilterType, SearchFilterMappingDataObj } from 'libs/features/search/search/models';

export const SearchFilterMappingData: SearchFilterMappingDataObj = {
  'smart_jobs_family_group_code': {
    Type: FilterType.Multi,
    BackingField: 'smart_jobs_family_group_code',
    DisplayName: 'Family Group',
    Order: 2,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'category_group_name': {
    Type: FilterType.Multi,
    BackingField: 'category_group_name',
    DisplayName: 'Category Group',
    Order: 3,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'smart_jobs_category1_code': {
    Type: FilterType.Multi,
    BackingField: 'smart_jobs_category1_code',
    DisplayName: 'Category 1',
    Order: 4,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'smart_jobs_category2_code': {
    Type: FilterType.Multi,
    BackingField: 'smart_jobs_category2_code',
    DisplayName: 'Category 2',
    Order: 5,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'smart_jobs_type_level': {
    Type: FilterType.Multi,
    BackingField: 'smart_jobs_type_level',
    DisplayName: 'Level',
    Order: 6,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  }
};
