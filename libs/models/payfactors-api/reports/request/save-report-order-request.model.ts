import { ReportOrderType } from '../../../../constants';

export interface SaveReportOrderRequest {
  WorkbookId: string;
  Type: ReportOrderType;
  Views: string[];
}
