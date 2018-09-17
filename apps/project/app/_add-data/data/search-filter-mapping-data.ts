import { FilterType } from '../models';

export const SearchFilterMappingData = {
  'default_survey_scopes': {
    Type: FilterType.Multi,
    BackingField: 'combined_scopes_weighted',
    DisplayName: 'Default Survey Scopes',
    Order: 11
  },
  'job_family': {
    Type: FilterType.Multi,
    BackingField: 'job_family',
    DisplayName: 'Job Family',
    Order: 4
  },
  'survey_effective_year': {
    Type: FilterType.Multi,
    BackingField: 'survey_effective_year',
    DisplayName: 'Year',
    Order: 8
  },
  'survey_title': {
    Type: FilterType.Multi,
    BackingField: 'survey_title',
    DisplayName: 'Survey Title',
    Order: 7
  },
  'survey_publisher': {
    Type: FilterType.Multi,
    BackingField: 'survey_publisher',
    DisplayName: 'Survey Publisher',
    Order: 6
  },
  'job_level': {
    Type: FilterType.Multi,
    BackingField: 'job_level',
    DisplayName: 'Job Level',
    Order: 5
  },
  'weighting_types': {
    Type: FilterType.Multi,
    BackingField: 'weighting_types',
    DisplayName: 'Weighting',
    Order: 10
  },
  'country_codes': {
    Type: FilterType.Multi,
    BackingField: 'country_codes',
    DisplayName: 'Country',
    Order: 9
  },
  'base_50th': {
    Type: FilterType.Range,
    BackingField: 'base_50th',
    DisplayName: 'Base 50th',
    Order: 12
  },
};
