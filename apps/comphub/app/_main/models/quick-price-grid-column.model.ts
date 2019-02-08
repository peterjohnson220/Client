export interface QuickPriceGridColumn {
  IsSortable: boolean;
  HeaderText: string;
  SortField?: string;
  CssClasses?: string;
}

export const QuickPriceGridColumnConfiguration: QuickPriceGridColumn[] = [
  {
    HeaderText: 'Job Title',
    IsSortable: true,
    SortField: 'JobTitle',
    CssClasses: 'job-title-column'
  },
  {
    HeaderText: 'Education',
    IsSortable: true,
    SortField: 'Education',
    CssClasses: 'education-column hide-when-small'
  },
  {
    HeaderText: 'Years Experience',
    IsSortable: true,
    SortField: 'YearsOfExperience',
    CssClasses: 'hide-when-small'
  },
  {
    HeaderText: 'Manages',
    IsSortable: true,
    SortField: 'ManagesEmployees',
    CssClasses: 'hide-when-small'
  },
  {
    HeaderText: 'Skills',
    IsSortable: false,
    CssClasses: 'hide-when-small hide-when-medium'
  },
  {
    HeaderText: 'Base 50th',
    IsSortable: true,
    SortField: 'Base50'
  },
  {
    HeaderText: 'TCC 50th',
    IsSortable: true,
    SortField: 'Tcc50'
  },
  {
    HeaderText: 'Incs',
    IsSortable: false,
    CssClasses: 'text-center hide-when-small'
  },
  {
    HeaderText: 'Orgs',
    IsSortable: false,
    CssClasses: 'text-center hide-when-small'
  },
  {
    HeaderText: 'Select',
    IsSortable: false,
    CssClasses: 'text-center'
  }
];

