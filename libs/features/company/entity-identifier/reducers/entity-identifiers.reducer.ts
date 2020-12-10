import * as fromEntityIdentifierActions from '../actions/entity-identifier.actions';
import { EntityIdentifierViewModel } from '../models/entity-identifiers-view.model';

export interface State {
    isFetchingData: boolean;
    hasDataError: boolean;
    employeeIdentifiers: EntityIdentifierViewModel[];
    hasSaved: boolean;
}

export const initialState: State = {
    isFetchingData: false,
    hasDataError: false,
    employeeIdentifiers: null,
    hasSaved: false
};

export function reducer(state = initialState, action: fromEntityIdentifierActions.Actions): State {
    switch (action.type) {
        case fromEntityIdentifierActions.PUT_EMPLOYEE_IDENTIFIERS:
        case fromEntityIdentifierActions.GET_EMPLOYEE_IDENTIFIERS: {
            return {
                ...state,
                hasDataError: false,
                isFetchingData: true,
                hasSaved: false
            };
        }
        case fromEntityIdentifierActions.PUT_EMPLOYEE_IDENTIFIERS_FAILED:
        case fromEntityIdentifierActions.GET_EMPLOYEE_IDENTIFIERS_FAILED: {
            return {
                ...state,
                hasDataError: true,
                isFetchingData: false,
                hasSaved: false
            };
        }
        case fromEntityIdentifierActions.PUT_EMPLOYEE_IDENTIFIERS_SUCCESS: {
            return {
                ...state,
                hasDataError: false,
                isFetchingData: false,
                employeeIdentifiers: action.employeeIdentifiers,
                hasSaved: true
            };
        }
        case fromEntityIdentifierActions.GET_EMPLOYEE_IDENTIFIERS_SUCCESS: {
            return {
                ...state,
                hasDataError: false,
                isFetchingData: false,
                employeeIdentifiers: action.employeeIdentifiers,
                hasSaved: false
            };
        }
        default:
            return state;
    }
}

export const IsFetchingData = (state: State) => state.isFetchingData;
export const HasDataError = (state: State) => state.hasDataError;
export const GetEmployeeIdentifiers = (state: State) => state.employeeIdentifiers;
export const HasSavedEmployeeIdentifiers = (state: State) => state.hasSaved;
