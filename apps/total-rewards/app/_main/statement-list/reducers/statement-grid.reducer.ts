import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';

import { StatementListViewModel } from '../../../shared/models';
import * as fromStatementGridActions from '../actions/statement-grid.actions';

export interface State extends EntityState<StatementListViewModel> {
  statementsTotal: number;
  statementsLoading: boolean;
  statementsLoadingError: boolean;
  searchTerm: string;
  openActionMenuStatementId: string;
}

// define our EntityAdapter of Statement type
export const adapter: EntityAdapter<StatementListViewModel> = createEntityAdapter<StatementListViewModel>({
  selectId: (statement: StatementListViewModel) => statement.Id
});

const initialState: State = adapter.getInitialState({
  statementsTotal: 0,
  statementsLoading: false,
  statementsLoadingError: false,
  searchTerm: null,
  openActionMenuStatementId: null
});

export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.TotalRewardsStatements,
    (featureState: State = initialState, featureAction: fromStatementGridActions.Actions): State => {
      switch (featureAction.type) {
        case fromStatementGridActions.LOAD_STATEMENTS: {
          return {
            ...featureState,
            statementsLoading: true,
            statementsLoadingError: false
          };
        }
        case fromStatementGridActions.LOAD_STATEMENTS_SUCCESS: {
          return {
            ...adapter.addAll(featureAction.payload.data, featureState),
            statementsTotal: featureAction.payload.total,
            statementsLoading: false,
            statementsLoadingError: false
          };
        }
        case fromStatementGridActions.LOAD_STATEMENTS_ERROR: {
          return {
            ...featureState,
            statementsLoading: false,
            statementsLoadingError: true
          };
        }
        case fromStatementGridActions.UPDATE_SEARCH_TERM: {
          return {
            ...featureState,
            searchTerm: featureAction.payload
          };
        }
        case fromStatementGridActions.OPEN_ACTION_MENU: {
          return {
            ...featureState,
            openActionMenuStatementId: featureAction.payload
          };
        }
        case fromStatementGridActions.CLOSE_ACTION_MENU: {
          return {
            ...featureState,
            openActionMenuStatementId: null
          };
        }
        default: {
          return featureState;
        }
      }
    }, {
      take: 50
    })(state, action);
}

export const getStatementsTotal = (state: State) => state.statementsTotal;
export const getStatementsLoading = (state: State) => state.statementsLoading;
export const getStatementsLoadingError = (state: State) => state.statementsLoadingError;
export const getSearchTerm = (state: State) => state.searchTerm;

export const getOpenActionMenuStatementId = (state: State) => state.openActionMenuStatementId;
