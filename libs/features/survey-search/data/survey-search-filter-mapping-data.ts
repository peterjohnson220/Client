import { FilterType, SearchFilterMappingDataObj } from 'libs/features/search/models';

export const SurveySearchFilterMappingDataObj: SearchFilterMappingDataObj = {
  'default_survey_scopes': {
    Type: FilterType.Multi,
    BackingField: 'combined_scopes_weighted',
    DisplayName: 'Default Survey Scopes',
    Order: 12,
    OptionCountDisabled: true,
    SaveDisabled: true,
    RefreshOptionsFromServer: false
  },
  'job_family': {
    Type: FilterType.Multi,
    BackingField: 'job_family',
    DisplayName: 'Job Family',
    Order: 5,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'survey_effective_year': {
    Type: FilterType.Multi,
    BackingField: 'survey_effective_year',
    DisplayName: 'Year',
    Order: 9,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'survey_title': {
    Type: FilterType.Multi,
    BackingField: 'survey_title',
    DisplayName: 'Survey Title',
    Order: 8,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'survey_publisher': {
    Type: FilterType.Multi,
    BackingField: 'survey_publisher',
    DisplayName: 'Survey Publisher',
    Order: 7,
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
  'weighting_types': {
    Type: FilterType.Multi,
    BackingField: 'weighting_types',
    DisplayName: 'Weighting',
    Order: 11,
    OptionCountDisabled: true,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'country_codes': {
    Type: FilterType.Multi,
    BackingField: 'country_codes',
    DisplayName: 'Country',
    Order: 10,
    OptionCountDisabled: true,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
  'base_50th': {
    Type: FilterType.Range,
    BackingField: 'base_50th',
    DisplayName: 'Base 50th',
    Order: 13,
    OptionCountDisabled: false,
    SaveDisabled: true,
    RefreshOptionsFromServer: true
  },
  'data_source': {
    Type: FilterType.Multi,
    BackingField: 'data_source',
    DisplayName: 'Data Source',
    Order: 4,
    OptionCountDisabled: false,
    SaveDisabled: false,
    RefreshOptionsFromServer: true
  },
};
