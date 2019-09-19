import { ReportOrderType } from 'libs/constants';

export interface SaveReportOrderData {
  Type: ReportOrderType;
  ViewIds: string[];
  WorkbookId: string;
}
