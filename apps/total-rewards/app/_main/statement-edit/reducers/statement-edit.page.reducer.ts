import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { GenericNameValue } from 'libs/models/common';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards/response';
import { CompensationField, ImageControl, Statement, StatementAdditionalPagePlacementEnum, StatementModeEnum } from 'libs/features/total-rewards/total-rewards-statement/models';
import { TotalRewardsStatementService } from 'libs/features/total-rewards/total-rewards-statement/services/total-rewards-statement.service';

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
  employeeData: AsyncStateObj<EmployeeRewardsData>;
  assignedEmployees: AsyncStateObj<GenericNameValue<number>[]>;
  companyUdfs: AsyncStateObj<CompensationField[]>;
  visibleFieldsCount: number;
  activeRichTextEditorId: string;
  isPageScrolling: boolean;
  generateStatementPreviewEventId: AsyncStateObj<string>;
  repeatableHeaderHeightInPixels: number;
  preparingSettingsSave: boolean;
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
  employeeData: generateDefaultAsyncStateObj<EmployeeRewardsData>(null),
  assignedEmployees: generateDefaultAsyncStateObj<GenericNameValue<number>[]>([]),
  companyUdfs: generateDefaultAsyncStateObj([]),
  visibleFieldsCount: 0,
  activeRichTextEditorId: null,
  isPageScrolling: false,
  generateStatementPreviewEventId: generateDefaultAsyncStateObj<string>(null),
  repeatableHeaderHeightInPixels: null,
  preparingSettingsSave: false,
};

export function reducer(state = initialState, action: fromEditStatementActions.StatementEditPageActions): State {
  switch (action.type) {
    case fromEditStatementActions.LOAD_STATEMENT: {
      const localState = cloneDeep(state);
      localState.cloningFromTemplate = false;
      localState.cloningFromTemplateSuccess = false;
      localState.cloningFromTemplateError = false;
      localState.statement.saving = false;
      localState.statement.savingError = false;
      localState.statement.savingSuccess = false;
      localState.statementPreviewGenerating = false;
      localState.statementPreviewGeneratingError = false;
      return AsyncStateObjHelper.loading(localState, 'statement');
    }
    case fromEditStatementActions.LOAD_STATEMENT_SUCCESS: {
      const localState = AsyncStateObjHelper.loadingSuccess(state, 'statement', action.payload);
      localState.lastSavedDateTime = Date.now();
      return localState;
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
      return AsyncStateObjHelper.savingSuccess(state, 'statement', action.payload);
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
      const compFields = localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].DataFields;
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
      const compFields = localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].DataFields;
      if (!action.payload.Type) {
        for (let i = 0; i < compFields.length; i++) {
          if (compFields[i].Id === action.payload.DataFieldId) {
            localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].DataFields[i].IsVisible = action.payload.IsVisible;
            ++localState.visibleFieldsCount;
            break;
          }
        }
      }
      if (action.payload.Type) {
        const newField = localState.companyUdfs.obj.find(udf => udf.Id === action.payload.DataFieldId);
        newField.IsVisible = true;

        localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].DataFields.push(newField);
        ++localState.visibleFieldsCount;
      }
      return localState;
    }
    case fromEditStatementActions.REMOVE_CALCULATION_CONTROL_COMPENSATION_FIELD: {
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const localState = cloneDeep(state);
      const compFields = localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].DataFields;

      for (let i = 0; i < compFields.length; i++) {
        if (compFields[i].Id === action.payload.DataFieldId) {
          let compField: CompensationField = null;
          compFields[i].IsVisible = action.payload.IsVisible;

          // Removes override name so DefaultName displays if added back to the control.
          compFields[i].Name.Override = null;
          if (compFields[i].Type) {
            const updatedField = localState.companyUdfs.obj.find(udf => udf.Id === action.payload.DataFieldId);
            if (!!updatedField) {
              updatedField.IsVisible = false;
              updatedField.Name.Override = null;
            }
          } else {
            compField = compFields[i];
          }

          // removes the field from the array, if it's not a UDF field we add it back it to end of the array
          compFields.splice(i, 1);
          if (compField) {
            compFields.splice(compFields.length, 0, compField);
          }

          --localState.visibleFieldsCount;
          break;
        }
      }
      return localState;
    }
    case fromEditStatementActions.REORDER_CALCULATION_CONTROL_COMPENSATION_FIELD: {
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const localState = cloneDeep(state);
      const compFields = localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].DataFields;
      const orderedVisibleFields = cloneDeep(action.payload.CompensationFields);

      // add back all non visible fields to the array
      for (let i = 0; i < compFields.length; i++) {
        if (!compFields[i].IsVisible) {
          orderedVisibleFields.push(compFields[i]);
        }
      }

      localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].DataFields = orderedVisibleFields;
      return localState;
    }
    case fromEditStatementActions.UPDATE_RICH_TEXT_CONTROL_CONTENT: {
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const localState = cloneDeep(state);
      const control = localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control];
      control.Content = action.payload.value;
      return localState;
    }
    case fromEditStatementActions.UPDATE_RICH_TEXT_CONTROL_UDFS_IN_CONTENT: {
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const localState = cloneDeep(state);
      const control = localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control];
      control.UdfDataFieldsInContent = action.payload.UdfDataFieldsInContent;
      return localState;
    }
    case fromEditStatementActions.TOGGLE_STATEMENT_EDIT_MODE: {
      const localState = cloneDeep(state);
      localState.mode = action.payload;
      localState.isSettingsPanelOpen = false;
      return localState;
    }
    // settings
    case fromEditStatementActions.OPEN_SETTINGS_PANEL: {
      const localState: State = cloneDeep(state);
      if (state.mode === StatementModeEnum.Preview) {
        return localState;
      }
      localState.isSettingsPanelOpen = true;
      return localState;
    }
    case fromEditStatementActions.CLOSE_SETTINGS_PANEL: {
      const localState: State = cloneDeep(state);
      localState.isSettingsPanelOpen = false;
      return localState;
    }
    case fromEditStatementActions.RESET_SETTINGS: {
      const localState: State = cloneDeep(state);
      localState.settingsSaving = true;
      localState.settingsSaveError = false;
      // temporarily remove all content when a addtl page settings are changed to circumvent RTE errors when statement is re-hydrated
      if (localState.statement.obj.Settings.AdditionalPageSettings.PagePlacement !== StatementAdditionalPagePlacementEnum.None) {
        localState.statement.obj.Pages = localState.statement.obj.Pages.map(p => ({ Sections: [] }));
      }
      return localState;
    }
    case fromEditStatementActions.PREPARE_SAVE_SETTINGS: {
      return { ...state, preparingSettingsSave: true };
    }
    case fromEditStatementActions.SAVE_SETTINGS: {
      const localState: State = cloneDeep(state);
      localState.settingsSaving = true;
      localState.settingsSaveError = false;
      localState.preparingSettingsSave = false;
      return localState;
    }
    case fromEditStatementActions.SAVE_SETTINGS_SUCCESS: {
      const localState: State = cloneDeep(state);
      localState.statement.obj.Settings = action.payload;
      localState.settingsSaving = false;
      localState.settingsSaveSuccess = true;
      localState.settingsSaveError = false;
      localState.statement.obj.AuditRecord.EditedDateTime = new Date();
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
    case fromEditStatementActions.UPDATE_SETTINGS_COLOR: {
      const localState: State = cloneDeep(state);
      localState.statement.obj.Settings.Colors[action.payload.ColorIndex] = action.payload.Color;
      return localState;
    }
    case fromEditStatementActions.TOGGLE_DISPLAY_SETTING: {
      const localState: State = cloneDeep(state);
      const displaySettings = localState.statement.obj.Settings.DisplaySettings;
      displaySettings[action.payload.displaySettingKey] = !displaySettings[action.payload.displaySettingKey];
      return localState;
    }
    case fromEditStatementActions.UPDATE_ADDITIONAL_PAGE_SETTINGS: {
      const localState: State = cloneDeep(state);
      localState.statement.obj.Settings.AdditionalPageSettings = action.payload.additionalPageSettings;

      // temporarily remove all content when a addtl page settings are changed to circumvent RTE errors when statement is re-hydrated
      localState.statement.obj.Pages = localState.statement.obj.Pages.map(p => ({ Sections: [] }));
      return localState;
    }
    case fromEditStatementActions.SAVE_IMAGE_CONTROL_IMAGE: {
      const localState: State = cloneDeep(state);
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.ControlId);
      const control: ImageControl = localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control] as ImageControl;
      control.FileName = action.payload.FileName;
      control.FileUrl = action.payload.FileUrl;
      return localState;
    }
    case fromEditStatementActions.REMOVE_IMAGE_CONTROL_IMAGE: {
      const localState: State = cloneDeep(state);
      const {Page, Section, Column, Control} = TotalRewardsStatementService.getCurrentControlIndex(state.statement.obj, action.payload.Id);
      const control: ImageControl = localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control] as ImageControl;
      control.FileName = '';
      control.FileUrl = '';
      return localState;
    }
    case fromEditStatementActions.SELECT_IMAGE_CONTROL_IMAGE: {
      const localState: State = cloneDeep(state);
      localState.statement.saving = true;
      return localState;
    }
    case fromEditStatementActions.UPDATE_EFFECTIVE_DATE: {
      const localState: State = cloneDeep(state);
      localState.statement.obj.EffectiveDate = action.payload.effectiveDate;
      return localState;
    }
    case fromEditStatementActions.SEARCH_ASSIGNED_EMPLOYEES: {
      return AsyncStateObjHelper.loading(state, 'assignedEmployees');
    }
    case fromEditStatementActions.SEARCH_ASSIGNED_EMPLOYEES_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'assignedEmployees', action.payload);
    }
    case fromEditStatementActions.SEARCH_ASSIGNED_EMPLOYEES_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'assignedEmployees');
    }
    case fromEditStatementActions.GET_EMPLOYEE_REWARDS_DATA: {
      return AsyncStateObjHelper.loading(state, 'employeeData');
    }
    case fromEditStatementActions.GET_EMPLOYEE_REWARDS_DATA_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'employeeData', action.payload);
    }
    case fromEditStatementActions.GET_EMPLOYEE_REWARDS_DATA_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'employeeData');
    }
    case fromEditStatementActions.GET_COMPANY_UDF: {
      const companyUdfClone: AsyncStateObj<CompensationField[]> = cloneDeep(state.companyUdfs);
      companyUdfClone.loading = true;
      companyUdfClone.loadingError = false;

      return {
        ...state,
        companyUdfs: companyUdfClone
      };
    }
    case fromEditStatementActions.GET_COMPANY_UDF_SUCCESS: {
      const companyUdfClone: AsyncStateObj<CompensationField[]> = cloneDeep(state.companyUdfs);
      const statementClone: AsyncStateObj<Statement> = cloneDeep(state.statement);
      companyUdfClone.loading = false;

      const allUdfFields: CompensationField[] = cloneDeep(action.payload);
      const statementUdfFields = TotalRewardsStatementService.getStatementUdfFields(statementClone.obj);
      TotalRewardsStatementService.syncUdfFields(statementClone.obj, statementUdfFields, allUdfFields);
      const visibleFieldsCount = TotalRewardsStatementService.getVisibleCalculationFields(statementClone.obj).length;

      companyUdfClone.obj = allUdfFields;

      return {
        ...state,
        statement: statementClone,
        companyUdfs: companyUdfClone,
        visibleFieldsCount: visibleFieldsCount
      };
    }
    case fromEditStatementActions.GET_COMPANY_UDF_ERROR: {
      const companyUdfClone: AsyncStateObj<CompensationField[]> = cloneDeep(state.companyUdfs);
      companyUdfClone.loading = false;
      companyUdfClone.loadingError = true;

      return {
        ...state,
        companyUdfs: companyUdfClone
      };
    }
    case fromEditStatementActions.UPDATE_ACTIVE_RICH_TEXT_EDITOR_ID: {
      return {
        ...state,
        activeRichTextEditorId: action.payload
      };
    }
    case fromEditStatementActions.PAGE_SCROLL: {
      return {
        ...state,
        isPageScrolling: action.payload.isScrolling
      };
    }
    case fromEditStatementActions.GENERATE_STATEMENT_PREVIEW: {
      return AsyncStateObjHelper.loading(state, 'generateStatementPreviewEventId');
    }
    case fromEditStatementActions.GENERATE_STATEMENT_PREVIEW_SUCCESS: {
      const asyncClone = cloneDeep(state.generateStatementPreviewEventId);
      asyncClone.obj = action.payload;
      return {
        ...state,
        generateStatementPreviewEventId: asyncClone
      };
    }
    case fromEditStatementActions.GENERATE_STATEMENT_PREVIEW_COMPLETE: {
      return AsyncStateObjHelper.loadingSuccess(state, 'generateStatementPreviewEventId');
    }
    case fromEditStatementActions.GENERATE_STATEMENT_PREVIEW_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'generateStatementPreviewEventId');
    }
    case fromEditStatementActions.CALCULATE_REPEATABLE_HEADER_CONTENT_HEIGHT_IN_PIXELS: {
      return { ...state, repeatableHeaderHeightInPixels: action.payload.headerHeight };
    }
    default: {
      return state;
    }
  }
}
