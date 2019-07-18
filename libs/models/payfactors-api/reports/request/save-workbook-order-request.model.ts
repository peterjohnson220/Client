import { WorkbookOrderType } from '../../../../constants';

export interface SaveWorkbookOrderRequest {
  WorkbookIds: string[];
  Type: WorkbookOrderType;
}
