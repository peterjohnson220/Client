import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';
import { StatementListViewModel } from 'libs/features/total-rewards/total-rewards-statement/models';

import * as fromStatementGridActions from '../actions/statement-grid.actions';

export interface State extends EntityState<StatementListViewModel> {
  statementsTotal: number;
  statementsLoading: boolean;
  statementsLoadingError: boolean;
  searchTerm: string;
  openActionMenuStatement: StatementListViewModel;
  isDeleteStatementModalOpen: boolean;
  deletingStatement: boolean;
  deletingStatementSuccess: boolean;
  deletingStatementError: boolean;
  isCopyStatementModalOpen: boolean;
  copyingStatement: boolean;
  copyingStatementSuccess: boolean;
  copyingStatementError: boolean;
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
  isDeleteStatementModalOpen: false,
  deletingStatement: false,
  deletingStatementSuccess: false,
  deletingStatementError: false,
  isCopyStatementModalOpen: false,
  copyingStatement: false,
  copyingStatementSuccess: false,
  copyingStatementError: false,
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
            openActionMenuStatement: (featureState.isDeleteStatementModalOpen) ? featureState.openActionMenuStatement : null,
          };
        }
        case fromStatementGridActions.CONFIRM_DELETE_STATEMENT: {
          return {
            ...featureState,
            isDeleteStatementModalOpen: true,
            openActionMenuStatement: action.payload
          };
        }
        case fromStatementGridActions.CLOSE_DELETE_STATEMENT:
          return {
            ...featureState,
            isDeleteStatementModalOpen: false
          };
        case fromStatementGridActions.DELETE_STATEMENT:
          return {
            ...featureState,
            deletingStatement: true,
            deletingStatementSuccess: false,
            deletingStatementError: false,
          };
        case fromStatementGridActions.DELETE_STATEMENT_SUCCESS:
          return {
            ...featureState,
            deletingStatement: false,
            deletingStatementSuccess: true,
            deletingStatementError: false,
          };
        case fromStatementGridActions.DELETE_STATEMENT_ERROR:
          return {
            ...featureState,
            deletingStatement: false,
            deletingStatementSuccess: false,
            deletingStatementError: true,
          };
        case fromStatementGridActions.CONFIRM_COPY_STATEMENT:
          return {
            ...featureState,
            isCopyStatementModalOpen: true,
            openActionMenuStatement: action.payload
          };
        case fromStatementGridActions.CLOSE_COPY_STATEMENT:
          return {
            ...featureState,
            isCopyStatementModalOpen: false
          };
        case fromStatementGridActions.COPY_STATEMENT:
          return {
            ...featureState,
            copyingStatement: true,
            copyingStatementSuccess: false,
            copyingStatementError: false,
          };
        case fromStatementGridActions.COPY_STATEMENT_SUCCESS:
          return {
            ...featureState,
            copyingStatement: false,
            copyingStatementSuccess: true,
            copyingStatementError: false,
          };
        case fromStatementGridActions.COPY_STATEMENT_ERROR:
          return {
            ...featureState,
            copyingStatement: false,
            copyingStatementSuccess: false,
            copyingStatementError: true,
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

export const getIsDeleteStatementModalOpen = (state: State) => state.isDeleteStatementModalOpen;
export const getDeletingStatement = (state: State) => state.deletingStatement;
export const getDeletingStatementSuccess = (state: State) => state.deletingStatementSuccess;
export const getDeletingStatementError = (state: State) => state.deletingStatementError;

export const getIsCopyStatementModalOpen = (state: State) => state.isCopyStatementModalOpen;
export const getCopyingStatement = (state: State) => state.copyingStatement;
export const getCopyingStatementSuccess = (state: State) => state.copyingStatementSuccess;
export const getCopyingStatementError = (state: State) => state.copyingStatementError;
