import { Action } from '@ngrx/store';

import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api';
import { DataCut } from 'libs/features/surveys/survey-search/models';

import { TempDataCutIdentity } from '../models';

export const CREATE_TEMP_DATA_CUT = '[Libs/Features/Temp Data Cut] Create Temp Data Cut';
export const CREATE_TEMP_DATA_CUT_COMPLETE = '[Libs/Features/Temp Data Cut] Create Temp Data Cut Complete';
export const REPLACE_DATA_CUT_WITH_TEMP = '[Libs/Features/Temp Data Cut] Replace Data Cut With Temp';
export const EDIT_TEMP_DATA_CUT = '[Libs/Features/Temp Data Cut] Edit Temp Data Cut';
export const EDIT_TEMP_DATA_CUT_COMPLETE = '[Libs/Features/Temp Data Cut] Edit Temp Data Cut Complete';
export const RESET_TEMP_DATA_CUT_SERVICE = '[Libs/Features/Temp Data Cut] Reset Temp Data Cut Service';

export class CreateTempDataCut implements Action {
  readonly type = CREATE_TEMP_DATA_CUT;

  constructor(public payload: { exchangeJobId: number }) {}
}

export class CreateTempDataCutComplete implements Action {
  readonly type = CREATE_TEMP_DATA_CUT_COMPLETE;

  constructor(public payload: {tempDataCutId: string, exchangeDataSearchRequest: BaseExchangeDataSearchRequest}) {}
}

export class ReplaceDataCutWithTemp implements Action {
  readonly type = REPLACE_DATA_CUT_WITH_TEMP;

  constructor(public payload: {tempDataCut: DataCut, exchangeJobId?: number}) { }
}

export class EditTempDataCut implements Action {
  readonly type = EDIT_TEMP_DATA_CUT;

  constructor(public payload: TempDataCutIdentity) {}
}

export class EditTempDataCutComplete implements Action {
  readonly type = EDIT_TEMP_DATA_CUT_COMPLETE;

  constructor(public payload: { tempDataCutId: string, exchangeDataSearchRequest: BaseExchangeDataSearchRequest }) {}
}

export class ResetTempDataCutService implements Action {
  readonly type = RESET_TEMP_DATA_CUT_SERVICE;
}

export type TempDataCutActions
  = CreateTempDataCut
  | CreateTempDataCutComplete
  | ReplaceDataCutWithTemp
  | EditTempDataCut
  | EditTempDataCutComplete
  | ResetTempDataCutService;
