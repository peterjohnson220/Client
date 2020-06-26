import { Action } from '@ngrx/store';

import { AvailableJobInformationField } from '../../../../app/shared';

export const LOAD_AVAILABLE_JOB_INFORMATION_FIELDS = '[Template/Available Job Information Fields] Load Job Information Fields';
export const LOAD_AVAILABLE_JOB_INFORMATION_FIELDS_SUCCESS = '[Template/Available Job Information Fields] Load Job Information Fields Success';
export const LOAD_AVAILABLE_JOB_INFORMATION_FIELDS_ERROR = '[Template/Available Job Information Fields] Load Job Information Fields Error';

export class LoadAvailableJobInformationFields implements Action {
    readonly type = LOAD_AVAILABLE_JOB_INFORMATION_FIELDS;
}

export class LoadAvailableJobInformationFieldsSuccess implements Action {
    readonly type = LOAD_AVAILABLE_JOB_INFORMATION_FIELDS_SUCCESS;

    constructor(public payload: {availableJobInformationFields: AvailableJobInformationField[]}) {}
}

export class LoadAvailableJobInformationFieldsError implements Action {
    readonly type = LOAD_AVAILABLE_JOB_INFORMATION_FIELDS_ERROR;

    constructor(public payload: {errorMessage: string}) {}
}

export type AvailableJobInformationFieldActions
 = LoadAvailableJobInformationFields
 | LoadAvailableJobInformationFieldsSuccess
 | LoadAvailableJobInformationFieldsError;
