import { Action } from '@ngrx/store';

import { EntityIdentifierViewModel } from '../models/entity-identifiers-view.model';

export const GET_EMPLOYEE_IDENTIFIERS = '[Data Management/Entity Identifier] Get Employee Identifiers';
export const GET_EMPLOYEE_IDENTIFIERS_SUCCESS = '[Data Management/Entity Identifier] Get Employee Identifiers Success';
export const GET_EMPLOYEE_IDENTIFIERS_FAILED = '[Data Management/Entity Identifier] Get Employee Identifiers Failed';

export const PUT_EMPLOYEE_IDENTIFIERS = '[Data Management/Entity Identifier] Put Employee Identifiers';
export const PUT_EMPLOYEE_IDENTIFIERS_SUCCESS = '[Data Management/Entity Identifier] Put Employee Identifiers Success';
export const PUT_EMPLOYEE_IDENTIFIERS_FAILED = '[Data Management/Entity Identifier] Put Employee Identifiers Failed';


export class GetEmployeeIdentifiers implements Action {
    readonly type = GET_EMPLOYEE_IDENTIFIERS;
    constructor(public companyId: number, public customEmployeeFields: any[]) { }
}

export class GetEmployeeIdentifiersSuccess implements Action {
    readonly type = GET_EMPLOYEE_IDENTIFIERS_SUCCESS;
    constructor(public employeeIdentifiers: EntityIdentifierViewModel[]) { }
}

export class GetEmployeeIdentifiersFailed implements Action {
    readonly type = GET_EMPLOYEE_IDENTIFIERS_FAILED;
    constructor() { }
}

export class PutEmployeeIdentifiers implements Action {
    readonly type = PUT_EMPLOYEE_IDENTIFIERS;
    constructor(public companyId: number, public keyFields: string[], public customEmployeeFields: any[]) { }
}

export class PutEmployeeIdentifiersFailed implements Action {
    readonly type = PUT_EMPLOYEE_IDENTIFIERS_FAILED;
    constructor() { }
}

export class PutEmployeeIdentifiersSuccess implements Action {
    readonly type = PUT_EMPLOYEE_IDENTIFIERS_SUCCESS;
    constructor(public employeeIdentifiers: EntityIdentifierViewModel[]) { }
}

export type Actions =
    GetEmployeeIdentifiers |
    GetEmployeeIdentifiersSuccess |
    GetEmployeeIdentifiersFailed |
    PutEmployeeIdentifiers |
    PutEmployeeIdentifiersSuccess |
    PutEmployeeIdentifiersFailed
    ;
