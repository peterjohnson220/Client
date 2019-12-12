import { ReportType } from './report-types.enum';

export interface SearchResult {
  Type: ReportType;
  Url: string;
  WorkbookName: string;
  ViewName?: string;
  IsWorkbook: boolean;
  Id: string;
}

export function generateMockSearchResult(): SearchResult {
  return {
    IsWorkbook: true,
    WorkbookName: 'Some Workbook',
    Type: ReportType.TableauReport,
    Id: '123456789',
    Url: '/company-reports/123456789'
  };
}
