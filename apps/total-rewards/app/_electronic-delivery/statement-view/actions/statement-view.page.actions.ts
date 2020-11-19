import { Action } from '@ngrx/store';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards/response';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';

export const LOAD_STATEMENT = '[Total Rewards/Statement View] Load Statement';
export const LOAD_STATEMENT_SUCCESS = '[Total Rewards/Statement View] Load Statement Success';
export const LOAD_STATEMENT_ERROR = '[Total Rewards/Statement View] Load Statement Error';
export const GET_EMPLOYEE_REWARDS_DATA = '[Total Rewards/Statement View] Get Employee Rewards Data';
export const GET_EMPLOYEE_REWARDS_DATA_SUCCESS = '[Total Rewards/Statement View] Get Employee Rewards Data Success';
export const GET_EMPLOYEE_REWARDS_DATA_ERROR = '[Total Rewards/Statement View] Get Employee Rewards Data Error';

export class LoadStatement implements Action {
  readonly type = LOAD_STATEMENT;
  constructor(public payload: string) {}
}

export class LoadStatementSuccess implements Action {
  readonly type = LOAD_STATEMENT_SUCCESS;
  constructor(public payload: Statement) { }
}

export class LoadStatementError implements Action {
  readonly type = LOAD_STATEMENT_ERROR;
  constructor(public payload: any) {}
}

export class GetEmployeeRewardsData implements Action {
  readonly type = GET_EMPLOYEE_REWARDS_DATA;
  constructor(public payload: { companyEmployeeId: number, statementId: string }) {}
}

export class GetEmployeeRewardsDataSuccess implements Action {
  readonly type = GET_EMPLOYEE_REWARDS_DATA_SUCCESS;
  constructor(public payload: EmployeeRewardsData) {}
}

export class GetEmployeeRewardsDataError implements Action {
  readonly type = GET_EMPLOYEE_REWARDS_DATA_ERROR;
  constructor() {}
}


export type StatementViewPageActions =
  LoadStatement |
  LoadStatementSuccess |
  LoadStatementError |
  GetEmployeeRewardsData |
  GetEmployeeRewardsDataSuccess |
  GetEmployeeRewardsDataError;
