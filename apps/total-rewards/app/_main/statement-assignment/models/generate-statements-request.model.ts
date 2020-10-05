import { State } from '@progress/kendo-data-query/';
import { DeliveryMethod } from './delivery-methods.model';

export interface GenerateStatementsRequest {
  StatementId: string;
  CompanyEmployeeIds: number[];
  GenerateByQuery: State;
  WaitForPdfGenerationSelector: string;
  Method: DeliveryMethod;
}
