import { Action } from '@ngrx/store';

export const LOAD_JOBS_BY_FAMILY_WITH_NO_TEMPLATE = '[JobDescription/CompanyJob] Load Jobs by Family with no Template';
export const LOAD_JOBS_BY_FAMILY_WITH_NO_TEMPLATE_SUCCESS = '[JobDescription/CompanyJob] Load Jobs by Family with no Template Success';
export const LOAD_JOBS_BY_FAMILY_WITH_NO_TEMPLATE_ERROR = '[JobDescription/CompanyJob] Load Jobs by Family with no Template Error';

export const LOAD_JOBS_BY_FAMILY_WITH_TEMPLATE = '[JobDescription/CompanyJob] Load Jobs by Family with Template';
export const LOAD_JOBS_BY_FAMILY_WITH_TEMPLATE_SUCCESS = '[JobDescription/CompanyJob] Load Jobs by Family with Template Success';
export const LOAD_JOBS_BY_FAMILY_WITH_TEMPLATE_ERROR = '[JobDescription/CompanyJob] Load Jobs by Family with Template Error';

export const LOAD_JOB_FAMILIES = '[JobDescription/CompanyJob] Load Job Families';
export const LOAD_JOB_FAMILIES_SUCCESS = '[JobDescription/CompanyJob] Load Job Families Success';
export const LOAD_JOB_FAMILIES_ERROR = '[JobDescription/CompanyJob] Load Job Families Error';

export const SELECT_COMPANY_JOB_ASSIGN_TAB = '[JobDescription/CompanyJob] Select Company Job Assign Tab';
export const SELECT_COMPANY_JOB_UNASSIGN_TAB = '[JobDescription/CompanyJob] Select Company Job Unassign Tab';

export const SELECT_ALL_ASSIGN_TAB = '[JobDescription/CompanyJob] Select All Assign Tab';
export const SELECT_ALL_UNASSIGN_TAB = '[JobDescription/CompanyJob] Select All Unassign Tab';

export const SAVE_COMPANY_JOB_TEMPLATE_ASSIGNMENT = '[JobDescription/CompanyJob] Save Company Job Template Assignment';
export const SAVE_COMPANY_JOB_TEMPLATE_ASSIGNMENT_SUCCESS = '[JobDescription/CompanyJob] Save Company Job Template Assignment Success';
export const SAVE_COMPANY_JOB_TEMPLATE_ASSIGNMENT_ERROR = '[JobDescription/CompanyJob] Save Company Job Template Assignment Error';

export const CLEAR_VISIBLE_SELECTIONS_ASSIGN_TAB = '[JobDescription/CompanyJob] Clear Visible Selections Assign Tab';
export const CLEAR_VISIBLE_SELECTIONS_UNASSIGN_TAB = '[JobDescription/CompanyJob] Clear Visible Selections Unassign Tab';
export const CLEAR_COMPANY_JOB_TEMPLATE_ASSIGNMENT_MODAL = '[JobDescription/CompanyJob] Clear Company Job Template Assignment Modal';

export class LoadJobsByFamilyWithNoTemplate implements Action {
    readonly type = LOAD_JOBS_BY_FAMILY_WITH_NO_TEMPLATE;

    constructor(public payload: {jobFamily: string, templateId: number}) {}
}

export class LoadJobsByFamilyWithNoTemplateSuccess implements Action {
    readonly type = LOAD_JOBS_BY_FAMILY_WITH_NO_TEMPLATE_SUCCESS;

    constructor(public payload: any) {}
}

export class LoadJobsByFamilyWithNoTemplateError implements Action {
    readonly type = LOAD_JOBS_BY_FAMILY_WITH_NO_TEMPLATE_ERROR;

    constructor(public payload: {errorMessage: string}) {}
}

export class LoadJobsByFamilyWithTemplate implements Action {
    readonly type = LOAD_JOBS_BY_FAMILY_WITH_TEMPLATE;

    constructor(public payload: {jobFamily: string, templateId: number}) {}
}

export class LoadJobsByFamilyWithTemplateSuccess implements Action {
    readonly type = LOAD_JOBS_BY_FAMILY_WITH_TEMPLATE_SUCCESS;

    constructor(public payload: any) {}
}

export class LoadJobsByFamilyWithTemplateError implements Action {
    readonly type = LOAD_JOBS_BY_FAMILY_WITH_TEMPLATE_ERROR;

    constructor(public payload: {errorMessage: string}) {}
}

export class LoadJobFamilies implements Action {
    readonly type = LOAD_JOB_FAMILIES;
}

export class LoadJobFamiliesSuccess implements Action {
    readonly type = LOAD_JOB_FAMILIES_SUCCESS;

    constructor(public payload: any) {}
}

export class LoadJobFamiliesError implements Action {
    readonly type = LOAD_JOB_FAMILIES_ERROR;

    constructor(public payload: {errorMessage: string}) {}
}

export class SelectCompanyJobAssignTab implements Action {
    readonly type = SELECT_COMPANY_JOB_ASSIGN_TAB;

    constructor(public payload: {companyJobId: number}) {}
}

export class SelectCompanyJobUnassignTab implements Action {
    readonly type = SELECT_COMPANY_JOB_UNASSIGN_TAB;

    constructor(public payload: {companyJobId: number}) {}
}

export class SelectAllAssignTab implements Action {
    readonly type = SELECT_ALL_ASSIGN_TAB;

    constructor(public payload: {companyJobIds: number[]}) {}
}

export class SelectAllUnassignTab implements Action {
    readonly type = SELECT_ALL_UNASSIGN_TAB;

    constructor(public payload: {companyJobIds: number[]}) {}
}

export class ClearVisibleSelectionsAssignTab implements Action {
    readonly type = CLEAR_VISIBLE_SELECTIONS_ASSIGN_TAB;

    constructor(public payload: {companyJobIds: number[]}) {}
}

export class ClearVisibleSelectionsUnassignTab implements Action {
    readonly type = CLEAR_VISIBLE_SELECTIONS_UNASSIGN_TAB;

    constructor(public payload: {companyJobIds: number[]}) {}
}

export class SaveCompanyJobTemplateAssignment implements Action {
    readonly type = SAVE_COMPANY_JOB_TEMPLATE_ASSIGNMENT;

    constructor(public payload: {templateId: number, companyJobIdsToAssign: number[], companyJobIdsToUnassign: number[]}) {}
}

export class SaveCompanyJobTemplateAssignmentSuccess implements Action {
    readonly type = SAVE_COMPANY_JOB_TEMPLATE_ASSIGNMENT_SUCCESS;
}

export class SaveCompanyJobTemplateAssignmentError implements Action {
    readonly type = SAVE_COMPANY_JOB_TEMPLATE_ASSIGNMENT_ERROR;

    constructor(public payload: any) {}
}

export class ClearCompanyJobTemplateAssignmentModal implements Action {
    readonly type = CLEAR_COMPANY_JOB_TEMPLATE_ASSIGNMENT_MODAL;
}

export type CompanyJobActions
 = LoadJobsByFamilyWithNoTemplate
 | LoadJobsByFamilyWithNoTemplateSuccess
 | LoadJobsByFamilyWithNoTemplateError
 | LoadJobsByFamilyWithTemplate
 | LoadJobsByFamilyWithTemplateSuccess
 | LoadJobsByFamilyWithTemplateError
 | LoadJobFamilies
 | LoadJobFamiliesSuccess
 | LoadJobFamiliesError
 | SelectCompanyJobAssignTab
 | SelectCompanyJobUnassignTab
 | SelectAllAssignTab
 | SelectAllUnassignTab
 | ClearVisibleSelectionsAssignTab
 | ClearVisibleSelectionsUnassignTab
 | SaveCompanyJobTemplateAssignment
 | SaveCompanyJobTemplateAssignmentSuccess
 | SaveCompanyJobTemplateAssignmentError
 | ClearCompanyJobTemplateAssignmentModal;

