import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { GenericNameValue } from 'libs/models/common';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { EmployeeRewardsData, generateMockEmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards/response';
import { CompensationField, ImageControl, Statement, StatementModeEnum } from 'libs/features/total-rewards/total-rewards-statement/models';
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
  visibleFieldsCount: 0
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
          localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].DataFields[i].IsVisible = action.payload.IsVisible;

          // Removes override name so DefaultName displays if added back to the control.
          localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].DataFields[i].Name.Override = null;
          if (compFields[i].Type) {
            const updatedField = localState.companyUdfs.obj.find(udf => udf.Id === action.payload.DataFieldId);
            if (!!updatedField) {
              updatedField.IsVisible = false;
              updatedField.Name.Override = null;
            }
            localState.statement.obj.Pages[Page].Sections[Section].Columns[Column].Controls[Control].DataFields.splice(i, 1);
          }
          --localState.visibleFieldsCount ;
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
    case fromEditStatementActions.TOGGLE_SETTINGS_PANEL: {
      const localState: State = cloneDeep(state);
      // bail if we're trying to open settings while in in preview mode
      if (state.mode === StatementModeEnum.Preview && !localState.isSettingsPanelOpen) {
        return localState;
      }
      localState.isSettingsPanelOpen = !localState.isSettingsPanelOpen;
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
    case fromEditStatementActions.UPDATE_SETTINGS_CHART_COLOR: {
      const localState: State = cloneDeep(state);
      localState.statement.obj.Settings.ChartColors[action.payload.ColorIndex] = action.payload.Color;
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
    case fromEditStatementActions.RESET_EMPLOYEE_REWARDS_DATA: {
      const employeeDataAsyncClone = cloneDeep(state.employeeData);
      employeeDataAsyncClone.loading = false;
      employeeDataAsyncClone.obj = generateMockEmployeeRewardsData();
      employeeDataAsyncClone.loadingError = false;
      return {
        ...state,
        employeeData: employeeDataAsyncClone
      };
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
      const statementClone = cloneDeep(state.statement.obj);
      const onlyUdfs = true;
      companyUdfClone.loading = false;
      companyUdfClone.obj = action.payload;

      const visibleUdfControls = TotalRewardsStatementService.getVisibleCalculationFields(statementClone, onlyUdfs);
      const visibleFieldsCount = TotalRewardsStatementService.getVisibleCalculationFields(statementClone).length;

      if (visibleUdfControls.length) {
        companyUdfClone.obj = companyUdfClone.obj.map(companyUdf => visibleUdfControls.find(x => x.Id === companyUdf.Id) || companyUdf);
      }

      return {
        ...state,
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
    default: {
      return state;
    }
  }
}
