import * as cloneDeep from 'lodash.clonedeep';

import { CompanyJob } from 'libs/models';

import * as fromCompanyJobActions from '../actions';

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

export function reducer(state = initialState, action: fromCompanyJobActions.CompanyJobActions): State {
    switch (action.type) {
        case  fromCompanyJobActions.LOAD_JOBS_BY_FAMILY_WITH_NO_TEMPLATE:
            return {
                ...state,
                loading: true
            };
        case fromCompanyJobActions.LOAD_JOBS_BY_FAMILY_WITH_NO_TEMPLATE_SUCCESS:
            return {
                ...state,
                loading: false,
                error: false,
                errorMessage: '',
                entities: action.payload
            };
        case fromCompanyJobActions.LOAD_JOBS_BY_FAMILY_WITH_NO_TEMPLATE_ERROR:
            return {
                ...state,
                loading: false,
                error: true,
                errorMessage: action.payload.errorMessage,
            };
        case fromCompanyJobActions.SELECT_COMPANY_JOB_ASSIGN_TAB:
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
       case fromCompanyJobActions.CLEAR_VISIBLE_SELECTIONS_ASSIGN_TAB:
           return {
                ...state,
               selected: state.selected.filter(id => action.payload.companyJobIds.indexOf(id) === -1)
           };
        case fromCompanyJobActions.SELECT_ALL_ASSIGN_TAB:
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
        case fromCompanyJobActions.CLEAR_COMPANY_JOB_TEMPLATE_ASSIGNMENT_MODAL:
            return initialState;
        default:
            return state;
    }
}

export const getCompanyJobsWithNoTemplate  = (state: State) => state.entities;
export const getLoading  = (state: State) => state.loading;
export const getError  = (state: State) => state.error;
export const getErrorMessage  = (state: State) => state.errorMessage;
export const getSelected  = (state: State) => state.selected;
