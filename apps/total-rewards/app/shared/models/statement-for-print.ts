import { Statement } from './statement';
import { EmployeeRewardsData } from './employee-rewards-data';

export interface StatementForPrint extends Statement {
  EmployeeRewardsData: EmployeeRewardsData[];
}
