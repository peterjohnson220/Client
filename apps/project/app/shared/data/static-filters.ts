import { FilterType, TextFilter } from '../models';

export const staticFilters: TextFilter[] = [
  {
    Id: 'jobTitleCode',
    BackingField: 'job_title_code',
    DisplayName: 'Job Title/Code',
    Value: '',
    Type: FilterType.Text,
    Order: 1,
    CssClassName: 'job-title'
  },
  {
    Id: 'jobDescription',
    BackingField: 'job_description',
    DisplayName: 'Job Description',
    Value: '',
    Type: FilterType.Text,
    Order: 2,
    CssClassName: 'job-description'
  },
  {
    Id: 'scope',
    BackingField: 'combined_scopes',
    DisplayName: 'Scope',
    Value: '',
    Type: FilterType.Text,
    Order: 3,
    CssClassName: 'scope'
  }
];
