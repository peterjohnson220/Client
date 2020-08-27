import { State } from '@progress/kendo-data-query/';

export interface GenerateStatementsRequest {
  StatementId: string;
  CompanyEmployeeIds: number[];
  GenerateByQuery: State;
}
