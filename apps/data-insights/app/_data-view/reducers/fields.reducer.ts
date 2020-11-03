import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import * as fromDataViewFieldsActions from 'libs/features/formula-editor/actions/fields.actions';
import { Field, FieldType, DataViewAccessLevel, Suggestion, FieldsHelper } from 'libs/features/formula-editor';

export interface State {
  reportFieldsAsync: AsyncStateObj<Field[]>;
  selectedReportFields: Field[];
  savingReportFields: boolean;
  savingReportFieldsError: boolean;
}

const initialState: State = {
  reportFieldsAsync: generateDefaultAsyncStateObj<Field[]>([]),
  selectedReportFields: [],
  savingReportFields: false,
  savingReportFieldsError: false
};

export function reducer(state = initialState, action: fromDataViewFieldsActions.Actions): State {
  switch (action.type) {
    case fromDataViewFieldsActions.GET_AVAILABLE_REPORT_FIELDS: {
      const asyncStateObjClone = cloneDeep(state.reportFieldsAsync);

      asyncStateObjClone.loading = true;
      asyncStateObjClone.loadingError = false;
      asyncStateObjClone.obj = [];
      return {
        ...state,
        reportFieldsAsync: asyncStateObjClone
      };
    }
    case fromDataViewFieldsActions.GET_AVAILABLE_REPORT_FIELDS_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.reportFieldsAsync);
      asyncStateObjClone.loading = false;
      asyncStateObjClone.obj = action.payload;

      return {
        ...state,
        reportFieldsAsync: asyncStateObjClone
      };
    }
    case fromDataViewFieldsActions.GET_AVAILABLE_REPORT_FIELDS_ERROR: {
      const asyncStateObjClone = cloneDeep(state.reportFieldsAsync);

      asyncStateObjClone.loading = false;
      asyncStateObjClone.loadingError = true;
      return {
        ...state,
        reportFieldsAsync: asyncStateObjClone
      };
    }
    case fromDataViewFieldsActions.SAVE_REPORT_FIELDS: {
      return {
        ...state,
        savingReportFields: true,
        savingReportFieldsError: false
      };
    }
    case fromDataViewFieldsActions.SAVE_REPORT_FIELDS_SUCCESS: {
      return {
        ...state,
        savingReportFields: false,
        savingReportFieldsError: false
      };
    }
    case fromDataViewFieldsActions.SAVE_REPORT_FIELDS_ERROR: {
      return {
        ...state,
        savingReportFields: false,
        savingReportFieldsError: true
      };
    }
    case fromDataViewFieldsActions.REORDER_FIELDS: {
      let fieldsClone = cloneDeep(state.selectedReportFields);
      fieldsClone = fieldsClone.map(x => {
        const newFieldIndex = FieldsHelper.findFieldIndex(action.payload, x);
        if (newFieldIndex !== -1) {
          x.Order = newFieldIndex + 1;
        }
        return x;
      });
      fieldsClone = orderBy(fieldsClone, 'Order');
      return {
        ...state,
        selectedReportFields: fieldsClone
      };
    }
    case fromDataViewFieldsActions.REMOVE_SELECTED_FIELD: {
      let selectedFieldsClone: Field[] = cloneDeep(state.selectedReportFields);
      selectedFieldsClone = FieldsHelper.excludeFilter(selectedFieldsClone, action.payload);
      const reportFieldStateObjClone = cloneDeep(state.reportFieldsAsync);
      const removedField = FieldsHelper.findField(reportFieldStateObjClone.obj, action.payload);
      removedField.IsSelected = false;
      if (removedField.FieldType === FieldType.Formula && !hasAccessToFormulaField(removedField)) {
        reportFieldStateObjClone.obj = FieldsHelper.excludeFilter(reportFieldStateObjClone.obj, removedField);
      }
      return {
        ...state,
        selectedReportFields: selectedFieldsClone,
        reportFieldsAsync: reportFieldStateObjClone
      };
    }
    case fromDataViewFieldsActions.ADD_SELECTED_FIELD: {
      let fieldsClone = cloneDeep(state.selectedReportFields);
      const reportFieldStateObjClone = cloneDeep(state.reportFieldsAsync);
      const fieldToAdd = FieldsHelper.findField(reportFieldStateObjClone.obj, action.payload);
      const maxOrder = Math.max.apply(Math, fieldsClone.filter(f => f.IsSelected).map(function(o: Field) { return o.Order; }));
      if (fieldToAdd) {
        fieldToAdd.IsSelected = true;
        fieldToAdd.Order = maxOrder + 1;
        fieldsClone.push(fieldToAdd);
      }
      fieldsClone = orderBy(fieldsClone, 'Order');
      return {
        ...state,
        selectedReportFields: fieldsClone,
        reportFieldsAsync: reportFieldStateObjClone
      };
    }
    case fromDataViewFieldsActions.SET_SELECTED_FIELDS: {
      let fieldsClone = cloneDeep(state.selectedReportFields);
      fieldsClone = action.payload;
      return {
        ...state,
        selectedReportFields: fieldsClone
      };
    }
    case fromDataViewFieldsActions.UPDATE_DISPLAY_NAME: {
      const reportFieldStateObjClone: AsyncStateObj<Field[]> = cloneDeep(state.reportFieldsAsync);
      FieldsHelper.updateFieldDisplayName(reportFieldStateObjClone.obj, action.payload.field, action.payload.displayName);

      const fieldsClone = cloneDeep(state.selectedReportFields);
      FieldsHelper.updateFieldDisplayName(fieldsClone, action.payload.field, action.payload.displayName);
      return {
        ...state,
        reportFieldsAsync: reportFieldStateObjClone,
        selectedReportFields: fieldsClone
      };
    }
    case fromDataViewFieldsActions.ADD_NEW_FORMULA_FIELD: {
      const reportFieldStateObjClone: AsyncStateObj<Field[]> = cloneDeep(state.reportFieldsAsync);
      reportFieldStateObjClone.obj.push(action.payload);
      return {
        ...state,
        reportFieldsAsync: reportFieldStateObjClone
      };
    }
    case fromDataViewFieldsActions.SET_FORMAT_ON_SELECTED_FIELD:
    case fromDataViewFieldsActions.CLEAR_FORMATING: {
      const fieldsClone = cloneDeep(state.selectedReportFields);
      const fieldToUpdate = FieldsHelper.findField(fieldsClone, action.payload);
      if (fieldToUpdate) {
        fieldToUpdate.FieldFormat = action.payload.FieldFormat;
      }
      return {
        ...state,
        selectedReportFields: fieldsClone
      };
    }
    case fromDataViewFieldsActions.SAVE_UPDATED_FORMULA_FIELD: {
      const reportFieldStateObjClone: AsyncStateObj<Field[]> = cloneDeep(state.reportFieldsAsync);
      FieldsHelper.updateFormulaField(reportFieldStateObjClone.obj, action.payload);

      const fieldsClone = cloneDeep(state.selectedReportFields);
      FieldsHelper.updateFormulaField(fieldsClone, action.payload);
      return {
        ...state,
        reportFieldsAsync: reportFieldStateObjClone,
        selectedReportFields: fieldsClone
      };
    }
    case fromDataViewFieldsActions.REMOVE_FORMULA_FIELD: {
      const reportFieldStateObjClone: AsyncStateObj<Field[]> = cloneDeep(state.reportFieldsAsync);
      reportFieldStateObjClone.obj = reportFieldStateObjClone.obj.filter(x => x !== FieldsHelper.findField(reportFieldStateObjClone.obj, action.payload));
      return {
        ...state,
        reportFieldsAsync: reportFieldStateObjClone
      };
    }
    case fromDataViewFieldsActions.SORT_FIELD: {
      let fieldsClone = cloneDeep(state.selectedReportFields);
      fieldsClone = fieldsClone.map(f => {
        f.SortOrder = null;
        f.SortDirection = null;
        return f;
      });
      if (!!action.payload.field && !!action.payload.sortDirection) {
        const fieldToUpdate = FieldsHelper.findField(fieldsClone, action.payload.field);
        if (fieldToUpdate) {
          fieldToUpdate.SortOrder = 0;
          fieldToUpdate.SortDirection = action.payload.sortDirection;
        }
      }
      return {
        ...state,
        selectedReportFields: fieldsClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getReportFieldsAsync = (state: State) => state.reportFieldsAsync;
export const getSelectedFields = (state: State) => state.selectedReportFields;
export const getUnselectedFields = (state: State) => {
  if (state.reportFieldsAsync.obj) {
    return state.reportFieldsAsync.obj.filter((f: Field) => f.IsSelected === false
      && !FieldsHelper.fieldExists(state.selectedReportFields, f));
  }
};
export const getUserFormulas = (state: State) => {
  if (state.reportFieldsAsync.obj) {
    const formulaFields = state.reportFieldsAsync.obj.filter((f: Field) => f.FieldType === FieldType.Formula && f.IsEditable === true);
    return orderBy(formulaFields, [(x: Field) => x.FormulaName.toLowerCase()], 'asc');
  }
};
export const getFormulaFieldSuggestions = (state: State) => {
  if (state.reportFieldsAsync.obj) {
    return state.reportFieldsAsync.obj
    .filter((f) => f.FieldType === FieldType.DataElement)
    .map(f => {
      const isUDF: boolean = f.SourceName.startsWith('UDF_');
      const suggestion: Suggestion = {
        displayText: isUDF
          ? `[${f.Entity}.${f.DisplayName} (${f.SourceName})]`
          : `[${f.Entity}.${f.SourceName}]`,
        text: `[${f.Entity}.${f.SourceName}]`
      };
      return suggestion;
    });
  }
};

function hasAccessToFormulaField(field: Field): boolean {
  return field.IsPublic || (!field.IsPublic && field.AccessLevel === DataViewAccessLevel.Owner);
}
