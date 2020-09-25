import { QuickPriceType } from 'libs/constants';

export interface QuickPriceGridColumn {
  IsSortable: boolean;
  HeaderText: string;
  IsHidden?: boolean;
  SortField?: string;
  CssClasses?: string;
}

export class QuickPriceGridColumnConfiguration {
  static jobTitle: QuickPriceGridColumn = {
    HeaderText: 'Job Title',
    IsSortable: true,
    SortField: 'Job_Title',
    CssClasses: 'job-title-column'
  };
  static education: QuickPriceGridColumn = {
    HeaderText: 'Education',
    IsSortable: true,
    SortField: 'Education',
    CssClasses: 'education-column hide-when-small'
  };
  static yearsExp: QuickPriceGridColumn = {
    HeaderText: 'Years Exp.',
    IsSortable: true,
    SortField: 'Experience_From',
    CssClasses: 'hide-when-small'
  };
  static manages: QuickPriceGridColumn = {
    HeaderText: 'Manages',
    IsSortable: true,
    SortField: 'Manage_Employees',
    CssClasses: 'hide-when-small'
  };
  static base50th: QuickPriceGridColumn = {
    HeaderText: 'Base 50th',
    IsSortable: true,
    SortField: 'Base_50_Annual'
  };
  static tcc50th: QuickPriceGridColumn = {
    HeaderText: 'TCC 50th',
    IsSortable: true,
    SortField: 'TCC_50_Annual'
  };
  static action: QuickPriceGridColumn = {
    HeaderText: 'Select',
    IsSortable: false,
    CssClasses: 'text-center'
  };

  static getGridColumnConfigByType(type: QuickPriceType): QuickPriceGridColumn[] {
    switch (type) {
      case QuickPriceType.PEER: {
        return [
          {...this.jobTitle, IsSortable: false},
          {...this.education, IsSortable: false},
          {...this.yearsExp, IsSortable: false},
          {...this.manages, IsSortable: false},
          {...this.base50th, IsSortable: false},
          {...this.tcc50th, IsSortable: false},
          this.action
        ];
      }
      case QuickPriceType.SMALL_BUSINESS: {
        return [
          this.jobTitle,
          this.education,
          this.yearsExp,
          this.manages,
          this.action
        ];
      }
      default: {
        return [
          this.jobTitle,
          this.education,
          this.yearsExp,
          this.manages,
          this.base50th,
          this.tcc50th,
          this.action
        ];
      }
    }
  }
}
