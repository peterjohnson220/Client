import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import * as fromDataViewFieldsActions from 'libs/features/formula-editor/actions/fields.actions';
import { Field, FieldType, Suggestion } from 'libs/features/formula-editor';

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
    case fromDataViewFieldsActions.GET_AVAILABLE_REPORT_FIELDS_BY_PAGE_VIEW_ID: {
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
    default: {
      return state;
    }
  }
}

export const getReportFieldsAsync = (state: State) => state.reportFieldsAsync;

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
