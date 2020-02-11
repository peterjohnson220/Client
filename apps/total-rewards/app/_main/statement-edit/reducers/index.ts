import { createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromPageReducer from './statement-edit.page.reducer';

// Feature area state
export interface StatementEditState {
  page: fromPageReducer.State;
}

// Extend root state with feature area state
export interface State extends  fromRoot.State {
  totalRewards_statementEdit: StatementEditState;
}

// Feature area reducers
export const reducers = {
  page: fromPageReducer.reducer
};

// Select Feature Area
export const selectStatementEditPageState =
  createFeatureSelector<StatementEditState>('totalRewards_statementEdit');
