import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { Statement, StatementModeEnum } from '../../../shared/models';
import { TotalRewardsStatementService } from '../../../shared/services/total-rewards-statement.service';
import * as fromEditStatementActions from '../actions';

export interface State {
  statement: AsyncStateObj<Statement>;
  cloningFromTemplate: boolean;
  cloningFromTemplateError: boolean;
  cloningFromTemplateSuccess: boolean;
  mode: StatementModeEnum;
  isSettingsPanelOpen: boolean;
  settingsSaving: boolean;
  settingsSaveSuccess: boolean;
  settingsSaveError: boolean;
}

export const initialState: State = {
  statement: generateDefaultAsyncStateObj<Statement>(null),
  cloningFromTemplate: false,
  cloningFromTemplateError: false,
  cloningFromTemplateSuccess: false,
  mode: StatementModeEnum.Edit,
  isSettingsPanelOpen: false,
  settingsSaving: false,
  settingsSaveSuccess: false,
  settingsSaveError: false,
};

export function reducer(state = initialState, action: fromEditStatementActions.StatementEditPageActions): State {
  switch (action.type) {
    case fromEditStatementActions.CLONE_STATEMENT_FROM_TEMPLATE: {
      return {
        ...state,
        cloningFromTemplate: true,
        cloningFromTemplateSuccess: false,
        cloningFromTemplateError: false
      };
    }
    case fromEditStatementActions.CLONE_STATEMENT_FROM_TEMPLATE_SUCCESS: {
      return {
        ...state,
        cloningFromTemplate: false,
        cloningFromTemplateSuccess: true,
        cloningFromTemplateError: false,
        statement: generateDefaultAsyncStateObj(action.payload)
      };
    }
    case fromEditStatementActions.CLONE_STATEMENT_FROM_TEMPLATE_ERROR: {
      return {
        ...state,
        cloningFromTemplate: false,
        cloningFromTemplateSuccess: false,
        cloningFromTemplateError: true
      };
    }
    case fromEditStatementActions.LOAD_STATEMENT: {
      const localState = cloneDeep(state);
      localState.cloningFromTemplate = false;
      localState.cloningFromTemplateSuccess = false;
      localState.cloningFromTemplateError = false;
      localState.statement.saving = false;
      localState.statement.savingError = false;
      localState.statement.savingSuccess = false;
      return AsyncStateObjHelper.loading(localState, 'statement');
    }
    case fromEditStatementActions.LOAD_STATEMENT_SUCCESS: {
      const localState = cloneDeep(state);
      localState.lastSavedDateTime = Date.now();
      return AsyncStateObjHelper.loadingSuccess(state, 'statement', action.payload);
    }
    case fromEditStatementActions.LOAD_STATEMENT_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'statement', action.payload);
    }
    case fromEditStatementActions.RESET_STATEMENT: {
      return initialState;
    }
    case fromEditStatementActions.SAVE_STATEMENT: {
      return AsyncStateObjHelper.saving(state, 'statement');
    }
    case fromEditStatementActions.SAVE_STATEMENT_SUCCESS: {
      return AsyncStateObjHelper.savingSuccess(state, 'statement');
    }
    case fromEditStatementActions.SAVE_STATEMENT_ERROR: {
      return AsyncStateObjHelper.savingError(state, 'statement', action.payload);
    }
    case fromEditStatementActions.UPDATE_STATEMENT_NAME: {
      const localState = cloneDeep(state);
      localState.statement.obj.StatementName = action.payload;
      return localState;
    }
    case fromEditStatementActions.UPDATE_STATEMENT_CONTROL_TITLE: {
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const localState = cloneDeep(state);
      localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].Title.Override = action.payload.Title;
      return localState;
    }
    case fromEditStatementActions.UPDATE_CALCULATION_CONTROL_FIELD_TITLE: {
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const localState = cloneDeep(state);
      const compFields = localState.statement.obj.Pages[Page].Sections[Section]
        .Columns[Column].Controls[Control].DataFields;
      for (let i = 0; i < compFields.length; i++) {
        if (compFields[i].Id === action.payload.DataFieldId) {
          localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].DataFields[i].Name.Override = action.payload.NewName;
        }
      }
      return localState;
    }
    case fromEditStatementActions.UPDATE_CALCULATION_CONTROL_SUMMARY_TITLE: {
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const localState = cloneDeep(state);
      localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].Summary.Override = action.payload.Title;
      return localState;
    }
    case fromEditStatementActions.ADD_CALCULATION_CONTROL_COMPENSATION_FIELD: {
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const localState = cloneDeep(state);
      const compFields = localState.statement.obj.Pages[Page].Sections[Section]
        .Columns[Column].Controls[Control].DataFields;
      for (let i = 0; i < compFields.length; i++) {
        if (compFields[i].Id === action.payload.DataFieldId) {
          localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].DataFields[i].IsVisible = action.payload.IsVisible;
        }
      }
      return localState;
    }
    case fromEditStatementActions.REMOVE_CALCULATION_CONTROL_COMPENSATION_FIELD: {
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const localState = cloneDeep(state);
      const compFields = localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].DataFields;
      for (let i = 0; i < compFields.length; i++) {
        if (compFields[i].Id === action.payload.DataFieldId) {
          localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].DataFields[i].IsVisible = action.payload.IsVisible;

          // Removes override name so DefaultName displays if added back to the control.
          localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].DataFields[i].Name.Override = null;
        }
      }
      return localState;
    }
    case fromEditStatementActions.UPDATE_RICH_TEXT_CONTROL_CONTENT: {
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const localState = cloneDeep(state);
      const control = localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control];
      control.Content = action.payload.value;
      return localState;
    }
    case fromEditStatementActions.TOGGLE_STATEMENT_EDIT_MODE: {
      const localState = cloneDeep(state);
      localState.mode = action.payload;
      return localState;
    }
    // settings
    case fromEditStatementActions.OPEN_SETTINGS: {
      const localState: State = cloneDeep(state);
      localState.isSettingsPanelOpen = true;
      return localState;
    }
    case fromEditStatementActions.CLOSE_SETTINGS: {
      const localState: State = cloneDeep(state);
      localState.isSettingsPanelOpen = false;
      return localState;
    }
    case fromEditStatementActions.RESET_SETTINGS:
    case fromEditStatementActions.SAVE_SETTINGS: {
      const localState: State = cloneDeep(state);
      localState.settingsSaving = true;
      localState.settingsSaveError = false;
      return localState;
    }
    case fromEditStatementActions.SAVE_SETTINGS_SUCCESS: {
      const localState: State = cloneDeep(state);
      localState.statement.obj.Settings = action.payload;
      localState.settingsSaving = false;
      localState.settingsSaveSuccess = true;
      localState.settingsSaveError = false;
      return localState;
    }
    case fromEditStatementActions.SAVE_SETTINGS_ERROR: {
      const localState: State = cloneDeep(state);
      localState.settingsSaving = false;
      localState.settingsSaveSuccess = false;
      localState.settingsSaveError = true;
      return localState;
    }
    case fromEditStatementActions.UPDATE_SETTINGS_FONT_FAMILY: {
      const localState: State = cloneDeep(state);
      localState.statement.obj.Settings.FontFamily = action.payload;
      return localState;
    }
    case fromEditStatementActions.UPDATE_SETTINGS_FONT_SIZE: {
      const localState: State = cloneDeep(state);
      localState.statement.obj.Settings.FontSize = action.payload;
      return localState;
    }
    case fromEditStatementActions.UPDATE_SETTINGS_CHART_COLOR: {
      const localState: State = cloneDeep(state);
      localState.statement.obj.Settings.ChartColors[action.payload.ColorIndex] = action.payload.Color;
      return localState;
    }
    default: {
      return state;
    }
  }
}
