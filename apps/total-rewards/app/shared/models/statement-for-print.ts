import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import { Statement } from './statement';

export interface StatementForPrint extends Statement {
  EmployeeRewardsData: EmployeeRewardsData[];
}
