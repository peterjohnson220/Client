export interface QuickPriceGridColumn {
  IsSortable: boolean;
  HeaderText: string;
  SortField?: string;
  CssClasses?: string;
  HideInSmallViewports: boolean;
}

export const QuickPriceGridColumnConfiguration: QuickPriceGridColumn[] = [
  {
    HeaderText: 'Job Title',
    HideInSmallViewports: false,
    IsSortable: true,
    SortField: 'JobTitle'
  },
  {
    HeaderText: 'Education',
    HideInSmallViewports: true,
    IsSortable: true,
    SortField: 'Education'
  },
  {
    HeaderText: 'Years Experience',
    HideInSmallViewports: true,
    IsSortable: true,
    SortField: 'YearsOfExperience'
  },
  {
    HeaderText: 'Manages',
    HideInSmallViewports: true,
    IsSortable: true,
    SortField: 'ManagesEmployees'
  },
  {
    HeaderText: 'Skills',
    HideInSmallViewports: true,
    IsSortable: false
  },
  {
    HeaderText: 'TCC 50th',
    HideInSmallViewports: false,
    IsSortable: true,
    SortField: 'Base50'
  },
  {
    HeaderText: 'TCC 50th',
    HideInSmallViewports: false,
    IsSortable: true,
    SortField: 'Tcc50'
  },
  {
    HeaderText: 'Incs',
    HideInSmallViewports: true,
    IsSortable: false,
    CssClasses: 'text-center'
  },
  {
    HeaderText: 'Orgs',
    HideInSmallViewports: true,
    IsSortable: false,
    CssClasses: 'text-center'
  },
  {
    HeaderText: 'Select',
    HideInSmallViewports: false,
    IsSortable: false,
    CssClasses: 'text-center'
  }
];

