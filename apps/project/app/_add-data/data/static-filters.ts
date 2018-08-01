import { FilterType, TextFilter } from '../models';

export const staticFilters: TextFilter[] = [
  {
    Id: 'jobTitleCode',
    BackingField: 'job_title_code',
    DisplayName: 'Job Title/Code',
    Value: '',
    Type: FilterType.Text
  },
  {
    Id: 'jobDescription',
    BackingField: 'job_description',
    DisplayName: 'Job Description',
    Value: '',
    Type: FilterType.Text
  },
  {
    Id: 'scope',
    BackingField: 'combined_scope',
    DisplayName: 'Scope',
    Value: '',
    Type: FilterType.Text
  }
];
