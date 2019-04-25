import { Action } from '@ngrx/store';

// Companies Grid Actions
export const GET_GRID_SKIP_AMOUNT = '[Pf-Admin / Companies Grid] Get Pf-Admin Companies Grid Skip Amount';
export const GET_GRID_TAKE_AMOUNT = '[Pf-Admin / Companies Grid] Get Pf-Admin Companies Grid Take Amount';

export class GetGridSkipAmount implements Action {
    readonly type = GET_GRID_SKIP_AMOUNT;

    constructor(public payload: number) {}
}

export class GetGridTakeAmount implements Action {
    readonly type = GET_GRID_TAKE_AMOUNT;

    constructor(public payload: number) {}
}

export type Actions
    = GetGridSkipAmount
    | GetGridTakeAmount;
