import * as cloneDeep from 'lodash.clonedeep';
import { orderBy } from 'lodash';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromDataViewFieldsActions from '../actions/fields.actions';
import { Field, FieldType } from '../models';
import { FieldsHelper } from '../helpers';

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
    case fromDataViewFieldsActions.GET_REPORT_FIELDS: {
      const asyncStateObjClone = cloneDeep(state.reportFieldsAsync);

      asyncStateObjClone.loading = true;
      asyncStateObjClone.loadingError = false;
      asyncStateObjClone.obj = [];
      return {
        ...state,
        reportFieldsAsync: asyncStateObjClone
      };
    }
    case fromDataViewFieldsActions.GET_REPORT_FIELDS_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.reportFieldsAsync);
      asyncStateObjClone.loading = false;
      asyncStateObjClone.obj = action.payload;

      return {
        ...state,
        reportFieldsAsync: asyncStateObjClone
      };
    }
    case fromDataViewFieldsActions.GET_REPORT_FIELDS_ERROR: {
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
      const fieldsClone = cloneDeep(state.selectedReportFields);
      const fieldToUpdate = FieldsHelper.findField(fieldsClone, action.payload.field);
      if (fieldToUpdate) {
        fieldToUpdate.DisplayName = action.payload.displayName;
      }
      return {
        ...state,
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
    case fromDataViewFieldsActions.SET_NUMBER_FORMAT_ON_SELECTED_FIELD: {
      const fieldsClone = cloneDeep(state.selectedReportFields);
      const fieldToUpdate = FieldsHelper.findField(fieldsClone, action.payload.field);
      if (fieldToUpdate) {
        fieldToUpdate.Format = action.payload.numberFormat;
      }
      return {
        ...state,
        selectedReportFields: fieldsClone
      };
    }
    case fromDataViewFieldsActions.SAVE_UPDATED_FORMULA_FIELD: {
      const reportFieldStateObjClone: AsyncStateObj<Field[]> = cloneDeep(state.reportFieldsAsync);
      const fieldToUpdate = FieldsHelper.findField(reportFieldStateObjClone.obj, action.payload);
      if (fieldToUpdate) {
        fieldToUpdate.FormulaName = action.payload.FormulaName;
        fieldToUpdate.Formula = action.payload.Formula;
      }
      const fieldsClone = cloneDeep(state.selectedReportFields);
      const selectedFieldToUpdate = FieldsHelper.findField(fieldsClone, action.payload);
      if (selectedFieldToUpdate) {
        selectedFieldToUpdate.FormulaName = action.payload.FormulaName;
        selectedFieldToUpdate.Formula = action.payload.Formula;
      }
      return {
        ...state,
        reportFieldsAsync: reportFieldStateObjClone,
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
export const getFormulaFieldSuggestions = (state: State) => {
  if (state.reportFieldsAsync.obj) {
    return state.reportFieldsAsync.obj
    .filter((f) => f.FieldType === FieldType.DataElement)
    .map(f => `${f.Entity}.${f.SourceName}`);
  }
};
