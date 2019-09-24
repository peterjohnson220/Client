import * as fromPfGridActions from '../actions';
import { PfDataGridFieldModel } from 'libs/models';

export interface DataGridState {
    entity: string;
    loading: boolean;
    fields: PfDataGridFieldModel[];
    data: any;
}

export interface DataGridStoreState {
    grids: { [key: string]: DataGridState };
}

const initialState: DataGridStoreState = {
    grids: {}
};

export function reducer(state = initialState, action: fromPfGridActions.DataGridActions): DataGridStoreState {
    switch (action.type) {
        case fromPfGridActions.INIT_GRID:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.entity]: {
                        ...state.grids[action.entity],
                        entity: action.entity,
                    }
                }
            };
        case fromPfGridActions.LOAD_FIELDS_SUCCESS:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.entity]: {
                        ...state.grids[action.entity],
                        fields: action.payload,
                    }
                }
            };
        case fromPfGridActions.LOAD_DATA_SUCCESS:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.entity]: {
                        ...state.grids[action.entity],
                        data: action.payload,
                    }
                }
            };
        case fromPfGridActions.UPDATE_FIELDS:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.entity]: {
                        ...state.grids[action.entity],
                        fields: action.fields,
                    }
                }
            };
        default:
            return state;
    }
}

export const getState = (state: DataGridStoreState) => state;
export const getGrid = (state: DataGridStoreState, entity: string) => state.grids[entity];
export const getFields = (state: DataGridStoreState, entity: string) => state.grids[entity].fields;
export const getData = (state: DataGridStoreState, entity: string) => state.grids[entity].data;
