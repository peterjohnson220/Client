import * as cloneDeep from 'lodash.clonedeep';

import { CompanyJob } from 'libs/models';

import * as fromJobAssignmentActions from '../actions';

export interface State {
    loading: boolean;
    entities: CompanyJob[];
    selected: number[];
    error: boolean;
    errorMessage: string;
}

const initialState: State = {
    loading: false,
    entities: [],
    selected: [],
    error: false,
    errorMessage: ''
};

export function reducer(state = initialState, action: fromJobAssignmentActions.CompanyJobActions): State {
    switch (action.type) {
        case  fromJobAssignmentActions.LOAD_JOBS_BY_FAMILY_WITH_TEMPLATE:
            return {
                ...state,
                loading: true
            };
        case fromJobAssignmentActions.LOAD_JOBS_BY_FAMILY_WITH_TEMPLATE_SUCCESS:
           return {
                ...state,
               loading: false,
               error: false,
               errorMessage: '',
               entities: action.payload
           };
        case fromJobAssignmentActions.LOAD_JOBS_BY_FAMILY_WITH_TEMPLATE_ERROR:
            return {
                ...state,
                loading: false,
                error: true,
                errorMessage: action.payload.errorMessage
            };
        case fromJobAssignmentActions.SELECT_COMPANY_JOB_UNASSIGN_TAB:
           const companyJobId = action.payload.companyJobId;
           if (state.selected.indexOf(companyJobId) !== -1) {
               return {
                    ...state,
                   selected: state.selected.filter(id => id !== companyJobId)
               };
           }

           return {
                ...state,
               selected: [...state.selected, companyJobId]
           };
        case fromJobAssignmentActions.CLEAR_VISIBLE_SELECTIONS_UNASSIGN_TAB:
           return {
                ...state,
               selected: state.selected.filter(id => action.payload.companyJobIds.indexOf(id) === -1)
           };
        case fromJobAssignmentActions.SELECT_ALL_UNASSIGN_TAB:
           const newSelected = cloneDeep(state.selected);
           for (const id of action.payload.companyJobIds) {
               if (newSelected.indexOf(id) === -1) {
                newSelected.push(id);
               }
           }

           return {
               ...state,
               selected: newSelected
           };
        case fromJobAssignmentActions.CLEAR_COMPANY_JOB_TEMPLATE_ASSIGNMENT_MODAL:
            return initialState;
        default:
            return state;
    }
}

export const getLoading  = (state: State) => state.loading;
export const getCompanyJobsWithTemplate  = (state: State) => state.entities;
export const getSelected  = (state: State) => state.selected;
export const getError  = (state: State) => state.error;
export const getErrorMessage  = (state: State) => state.errorMessage;
