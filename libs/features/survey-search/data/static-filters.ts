import { FilterType, SearchType, TextFilter } from 'libs/features/search/models';

export function getSearchFilters(matchModeEnabled: boolean): TextFilter[] {
  return [
    {
      Id: 'jobTitleCode',
      BackingField: 'job_title_code',
      DisplayName: 'Job Title/Code',
      Value: '',
      Type: FilterType.Text,
      Order: 1,
      CssClassName: 'job-title',
      SearchType: matchModeEnabled ? SearchType.Match : null
    },
    {
      Id: 'jobDescription',
      BackingField: 'job_description',
      DisplayName: 'Job Description',
      Value: '',
      Type: FilterType.Text,
      Order: 2,
      CssClassName: 'job-description',
      SearchType: matchModeEnabled ? SearchType.MatchPhrase : null
    },
    {
      Id: 'scope',
      BackingField: 'combined_scopes',
      DisplayName: 'Scope',
      Value: '',
      Type: FilterType.Text,
      Order: 3,
      CssClassName: 'scope',
      SearchType: matchModeEnabled ? SearchType.MatchPhrase : null
    }
  ];
}
