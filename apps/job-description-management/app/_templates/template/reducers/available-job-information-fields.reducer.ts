import * as fromAvailableJobInfoFieldActions from '../actions';
import { AvailableJobInformationField } from '../../../shared';

export interface State {
    loading: boolean;
    entities: AvailableJobInformationField[];
}

const initialState: State = {
    loading: false,
    entities: []
};

export function reducer(state = initialState, action: fromAvailableJobInfoFieldActions.AvailableJobInformationFieldActions): State {
    switch (action.type) {
        case fromAvailableJobInfoFieldActions.LOAD_AVAILABLE_JOB_INFORMATION_FIELDS:
            return {
                ...state,
                loading: true
            };
        case fromAvailableJobInfoFieldActions.LOAD_AVAILABLE_JOB_INFORMATION_FIELDS_SUCCESS:
            return {
                ...state,
                loading: false,
                entities: action.payload.availableJobInformationFields
            };
        default:
            return state;
    }
}

export const getLoading = (state: State) => state.loading;
export const getAvailableJobInformationFields = (state: State) => state.entities;
