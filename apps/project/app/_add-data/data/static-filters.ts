import { Filter, FilterType } from '../models';

export const staticFilters: Filter[] = [
  {
    id: 'jobTitleCode',
    backingField: 'job_title_code',
    displayName: 'Job Title/Code',
    type: FilterType.Text,
    values: []
  },
  {
    id: 'jobDescription',
    backingField: 'job_description',
    displayName: 'Job Description',
    type: FilterType.Text,
    values: []
  },
  {
    id: 'scope',
    backingField: 'combined_scope',
    displayName: 'Scope',
    type: FilterType.Text,
    values: []
  }
];
