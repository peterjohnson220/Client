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
  openActionMenuStatement: StatementListViewModel;
  isDeleteStatetementModalOpen: boolean;
  deletingStatetement: boolean;
  deletingStatetementSuccess: boolean;
  deletingStatetementError: boolean;
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
  openActionMenuStatement: null,
  isDeleteStatetementModalOpen: false,
  deletingStatetement: false,
  deletingStatetementSuccess: false,
  deletingStatetementError: false,
});

export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.TotalRewardsStatements,
    (featureState: State = initialState, featureAction: fromStatementGridActions.StatementGridActions): State => {
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
            ...adapter.setAll(featureAction.payload.data, featureState),
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
            openActionMenuStatement: featureAction.payload
          };
        }
        case fromStatementGridActions.CLOSE_ACTION_MENU: {
          return {
            ...featureState,
            // action menu is behind an opacity blanket when the delete modal is open, so noop on a close in that case
            openActionMenuStatement: (featureState.isDeleteStatetementModalOpen) ? featureState.openActionMenuStatement : null,
          };
        }
        case fromStatementGridActions.CONFIRM_DELETE_STATEMENT: {
          return {
            ...featureState,
            isDeleteStatetementModalOpen: true,
            openActionMenuStatement: action.payload
          };
        }
        case fromStatementGridActions.CLOSE_DELETE_STATEMENT:
          return {
            ...featureState,
            isDeleteStatetementModalOpen: false
          };
        case fromStatementGridActions.DELETE_STATEMENT:
          return {
            ...featureState,
            deletingStatetement: true,
            deletingStatetementSuccess: false,
            deletingStatetementError: false,
          };
        case fromStatementGridActions.DELETE_STATEMENT_SUCCESS:
          return {
            ...featureState,
            deletingStatetement: false,
            deletingStatetementSuccess: true,
            deletingStatetementError: false,
          };
        case fromStatementGridActions.DELETE_STATEMENT_ERROR:
          return {
            ...featureState,
            deletingStatetement: false,
            deletingStatetementSuccess: false,
            deletingStatetementError: true,
          };
        default: {
          return featureState;
        }
      }
    }, {
      take: 20,
      sort: [
        {
          field: 'CreatedDate',
          dir: 'desc'
        }
      ]
    })(state, action);
}

export const getStatementsTotal = (state: State) => state.statementsTotal;
export const getStatementsLoading = (state: State) => state.statementsLoading;
export const getStatementsLoadingError = (state: State) => state.statementsLoadingError;
export const getSearchTerm = (state: State) => state.searchTerm;

export const getOpenActionMenuStatement = (state: State) => state.openActionMenuStatement;

export const getIsDeleteStatetementModalOpen = (state: State) => state.isDeleteStatetementModalOpen;
export const getDeletingStatetement = (state: State) => state.deletingStatetement;
export const getDeletingStatetementSuccess = (state: State) => state.deletingStatetementSuccess;
export const getDeletingStatetementError = (state: State) => state.deletingStatetementError;
