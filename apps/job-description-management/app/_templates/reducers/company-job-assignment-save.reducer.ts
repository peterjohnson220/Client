import * as fromCompanyJobActions from '../actions';
import { MessageHelper } from '../../shared';

export interface State {
    saving: boolean;
    success: boolean;
    error: boolean;
    errorMessage: string;
}

const initialState: State = {
    saving: false,
    success: false,
    error: false,
    errorMessage: ''
};

export function reducer(state = initialState, action: fromCompanyJobActions.CompanyJobActions): State {
    switch (action.type) {
        case  fromCompanyJobActions.SAVE_COMPANY_JOB_TEMPLATE_ASSIGNMENT:
            return {
                ...state,
                saving: true,
                success: false,
                error: false,
                errorMessage: ''
            };
        case fromCompanyJobActions.SAVE_COMPANY_JOB_TEMPLATE_ASSIGNMENT_SUCCESS:
            return {
                ...state,
                saving: false,
                success: true,
                error: false,
                errorMessage: '',
            };
        case fromCompanyJobActions.SAVE_COMPANY_JOB_TEMPLATE_ASSIGNMENT_ERROR:
            let errorMessage = '';
            if (action.payload.status === 409) {
                errorMessage = 'This job is already assigned to a template, please refresh the page.';
            } else {
                errorMessage = MessageHelper.buildErrorMessage('There was an error saving this assignment.');
            }
            return {
                ...state,
                saving: false,
                success: false,
                error: true,
                errorMessage: errorMessage,
            };
        case fromCompanyJobActions.CLEAR_COMPANY_JOB_TEMPLATE_ASSIGNMENT_MODAL:
            return initialState;
        default:
            return state;
    }
}

export const getSaving  = (state: State) => state.saving;
export const getSavingSuccess  = (state: State) => state.success;
export const getSavingError  = (state: State) => state.error;
export const getSavingErrorMessage  = (state: State) => state.errorMessage;
