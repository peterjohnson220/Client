import { FilterType, SearchFilterMappingDataObj } from 'libs/features/search/search/models';

export const SearchFilterMappingData: SearchFilterMappingDataObj = {
  'relational_family_group_name': {
    Type: FilterType.Multi,
    BackingField: 'relational_family_group_name',
    DisplayName: 'Family Group',
    Order: 2,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'relational_category_group_name': {
    Type: FilterType.Multi,
    BackingField: 'relational_category_group_name',
    DisplayName: 'Category Group',
    Order: 3,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'relational_category1_name': {
    Type: FilterType.Multi,
    BackingField: 'relational_category1_name',
    DisplayName: 'Category 1',
    Order: 4,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'relational_category2_name': {
    Type: FilterType.Multi,
    BackingField: 'relational_category2_name',
    DisplayName: 'Category 2',
    Order: 5,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'relational_type_level': {
    Type: FilterType.Multi,
    BackingField: 'relational_type_level',
    DisplayName: 'Level',
    Order: 6,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  }
};
