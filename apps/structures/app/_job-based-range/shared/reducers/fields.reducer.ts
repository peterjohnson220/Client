import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import * as fromDataViewFieldsActions from 'libs/features/formula-editor/actions/fields.actions';
import { Field, FieldType, Suggestion } from 'libs/features/formula-editor';

export interface FieldState {
  reportFieldsAsync: AsyncStateObj<Field[]>;
  selectedReportFields: Field[];
  savingReportFields: boolean;
  savingReportFieldsError: boolean;
}

export interface State {
  fields: { [key: string]: FieldState};
}

const initialState: State = {
  fields: {}
};

const DEFAULT_FIELD_STATE: FieldState = {
  reportFieldsAsync: generateDefaultAsyncStateObj<Field[]>([]),
  selectedReportFields: [],
  savingReportFields: false,
  savingReportFieldsError: false
};



export function reducer(state = initialState, action: fromDataViewFieldsActions.Actions): State {
  switch (action.type) {
    case fromDataViewFieldsActions.GET_AVAILABLE_FIELDS_BY_TABLE: {
      const asyncStateObjClone = cloneDeep(!!state.fields[action.payload.fieldId]?.reportFieldsAsync ?
        state.fields[action.payload.fieldId]?.reportFieldsAsync : generateDefaultAsyncStateObj<Field[]>([]));

      asyncStateObjClone.loading = true;
      asyncStateObjClone.loadingError = false;
      asyncStateObjClone.obj = [];
      return {
          ...state,
          fields: {
            ...state.fields,
            [action.payload.fieldId]: {
              ...state.fields[action.payload.fieldId],
            reportFieldsAsync: asyncStateObjClone
          }
        }
      };
    }
    case fromDataViewFieldsActions.GET_AVAILABLE_FIELDS_BY_TABLE_SUCCESS: {
      const asyncStateObjClone = cloneDeep(!!state.fields[action.payload.fieldId]?.reportFieldsAsync ?
        state.fields[action.payload.fieldId]?.reportFieldsAsync : generateDefaultAsyncStateObj<Field[]>([]));
      asyncStateObjClone.loading = false;
      asyncStateObjClone.obj = action.payload.fields;

      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.fieldId]: {
            ...state.fields[action.payload.fieldId],
            reportFieldsAsync: asyncStateObjClone
          }
        }
      };
    }
    case fromDataViewFieldsActions.GET_AVAILABLE_FIELDS_BY_TABLE_ERROR: {
      const asyncStateObjClone = cloneDeep(!!state.fields[action.payload.fieldId]?.reportFieldsAsync ?
        state.fields[action.payload.fieldId]?.reportFieldsAsync : generateDefaultAsyncStateObj<Field[]>([]));

      asyncStateObjClone.loading = false;
      asyncStateObjClone.loadingError = true;
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.fieldId]: {
            ...state.fields[action.payload.fieldId],
            reportFieldsAsync: asyncStateObjClone
          }
        }
      };
    }
    default: {
      return state;
    }
  }
}

export const getReportFieldsAsync = (state: State, fieldId: string) => state.fields[fieldId] ? state.fields[fieldId].reportFieldsAsync : null;

export const getFormulaFieldSuggestions = (state: State, fieldId: string) => {
  const reportFieldsObj = state.fields[fieldId]?.reportFieldsAsync.obj;
  if (!!reportFieldsObj) {
    return reportFieldsObj
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
