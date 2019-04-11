import * as fromCompaniesGridActions from '../actions/companies-grid.actions';


export interface GridState {
    skip: number;
    take: number;
}

export const initialState: GridState = {
    skip: 0,
    take: 15
};

export function reducer(state = initialState, action: fromCompaniesGridActions.Actions): GridState {
    switch (action.type) {
    case fromCompaniesGridActions.GET_GRID_SKIP_AMOUNT:
        return {
          ...state,
          skip: action.payload
        };
    case fromCompaniesGridActions.GET_GRID_TAKE_AMOUNT:
        return {
          ...state,
          take: action.payload
        };
    default:
      return state;
  }
}

export const getSkipAmount = (state: GridState) => state.skip;
export const getTakeAmount = (state: GridState) => state.take;
export const getState = (state: GridState) => state;
