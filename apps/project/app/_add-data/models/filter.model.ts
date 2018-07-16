export enum FilterType {
  Text = 'Text',
  Multi = 'Multi'
}

export interface Filter {
  id: string;
  backingField: string;
  displayName: string;
  type: FilterType;
  values: any[];
}

export function generateMockFilter(): Filter {
  return {
    id: 'jobTitleCode',
    backingField: 'job_title_code',
    displayName: 'Job Title/Code',
    type: FilterType.Text,
    values: ['Accountant']
  };
}
