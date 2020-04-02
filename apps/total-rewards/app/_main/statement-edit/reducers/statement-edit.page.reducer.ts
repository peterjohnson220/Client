import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { Statement } from '../../../shared/models';
import { TotalRewardsStatementService } from '../../../shared/services/total-rewards-statement.service';
import * as fromEditStatementActions from '../actions/statement-edit.page.actions';

export interface State {
  statementId: number;
  statement: AsyncStateObj<Statement>;
}

export const initialState: State = {
  statementId: 0,
  statement: generateDefaultAsyncStateObj<Statement>(null)
};

export function reducer(state = initialState, action: fromEditStatementActions.Actions): State {
  switch (action.type) {
    case fromEditStatementActions.LOAD_STATEMENT: {
      const localStatement = AsyncStateObjHelper.loading(state, 'statement');
      return {
        ...localStatement,
        statementId: action.payload
      };
    }
    case fromEditStatementActions.LOAD_STATEMENT_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'statement', action.payload);
    }
    case fromEditStatementActions.LOAD_STATEMENT_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'statement', action.payload);
    }
    case fromEditStatementActions.SAVE_STATEMENT: {
      console.log('SAVE TRIGGERED');
      return AsyncStateObjHelper.saving(state, 'statement', action.payload);
    }
    case fromEditStatementActions.SAVE_STATEMENT_SUCCESS: {
      return AsyncStateObjHelper.savingSuccess(state, 'statement');
    }
    case fromEditStatementActions.SAVE_STATEMENT_ERROR: {
      return AsyncStateObjHelper.savingError(state, 'statement', action.payload);
    }
    case fromEditStatementActions.UPDATE_STATEMENT_CONTROL_TITLE: {
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const localStatement = cloneDeep(state.statement.obj);
      localStatement.Pages[Page]
        .Sections[Section]
        .Columns[Column]
        .Controls[Control]
        .Title = action.payload.NewSummaryTitle;

      return AsyncStateObjHelper.saving(state, 'statement', localStatement);
    }
    case fromEditStatementActions.UPDATE_STATEMENT_CONTROL_SUMMARY_TITLE: {
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const localStatement = cloneDeep(state.statement.obj);
      localStatement.Pages[Page]
        .Sections[Section]
        .Columns[Column]
        .Controls[Control]
        .SummaryTitle = action.payload.NewSummaryTitle;

      return AsyncStateObjHelper.saving(state, 'statement', localStatement);
    }
    case fromEditStatementActions.UPDATE_CALCULATION_CONTROL_FIELD_TITLE: {
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const localStatement = cloneDeep(state.statement.obj);
      const compFields = localStatement.Pages[Page].Sections[Section]
        .Columns[Column].Controls[Control].DataFields;
      for (let i = 0; i < compFields.length; i++) {
        if (compFields[i].Id === action.payload.DataFieldId) {
          localStatement.Pages[Page]
            .Sections[Section]
            .Columns[Column]
            .Controls[Control]
            .DataFields[i]
            .OverrideName = action.payload.NewName;
        }
      }
      return AsyncStateObjHelper.saving(state, 'statement', localStatement);
    }
    case fromEditStatementActions.ADD_CALCULATION_CONTROL_COMPENSATION_FIELD: {
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const localStatement = cloneDeep(state.statement.obj);
      const compFields = localStatement.Pages[Page].Sections[Section]
        .Columns[Column].Controls[Control].DataFields;
      for (let i = 0; i < compFields.length; i++) {
        if (compFields[i].Id === action.payload.DataFieldId) {
          localStatement.Pages[Page]
            .Sections[Section]
            .Columns[Column]
            .Controls[Control]
            .DataFields[i]
            .IsVisible = action.payload.IsVisible;
        }
      }
      return AsyncStateObjHelper.saving(state, 'statement', localStatement);
    }
    case fromEditStatementActions.REMOVE_CALCULATION_CONTROL_COMPENSATION_FIELD: {
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const localStatement = cloneDeep(state.statement.obj);
      const compFields = localStatement.Pages[Page].Sections[Section]
        .Columns[Column].Controls[Control].DataFields;
      for (let i = 0; i < compFields.length; i++) {
        if (compFields[i].Id === action.payload.DataFieldId) {
          localStatement.Pages[Page]
            .Sections[Section]
            .Columns[Column]
            .Controls[Control]
            .DataFields[i]
            .IsVisible = action.payload.IsVisible;

          // Removes override name so DefaultName displays if added back to the control.
          localStatement.Pages[Page]
            .Sections[Section]
            .Columns[Column]
            .Controls[Control]
            .DataFields[i]
            .OverrideName = '';
        }
      }
      return AsyncStateObjHelper.saving(state, 'statement', localStatement);
    }
    default: {
      return state;
    }
  }
}
