import { State } from '@progress/kendo-data-query/';

import { StatementEmailTemplate } from 'libs/models/payfactors-api/total-rewards';
import { DeliveryMethod } from 'libs/features/total-rewards/total-rewards-statement/models/delivery-method';


export interface GenerateStatementsRequest {
  StatementId: string;
  UseMockEmployeeRewardsData: boolean;
  IncludeEmployeeNameInGeneratedFileName: boolean;
  CompanyEmployeeIds: number[];
  EmployeeSearchTerm: string;
  GenerateByQuery: State;
  WaitForPdfGenerationSelector: string;
  Method: DeliveryMethod;
  EmailTemplate?: StatementEmailTemplate;
}
