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
    SortField: 'Job_Title',
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
    SortField: 'Experience_From',
    CssClasses: 'hide-when-small'
  },
  {
    HeaderText: 'Manages',
    IsSortable: true,
    SortField: 'Manage_Employees',
    CssClasses: 'hide-when-small'
  },
  {
    HeaderText: 'Base 50th',
    IsSortable: true,
    SortField: 'Base_50_Annual'
  },
  {
    HeaderText: 'TCC 50th',
    IsSortable: true,
    SortField: 'TCC_50_Annual'
  },
  {
    HeaderText: 'Select',
    IsSortable: false,
    CssClasses: 'text-center'
  }
];

