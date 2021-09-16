import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';
import { ExportData } from 'libs/models/comphub';

import * as fromExportDataActions from '../actions/export-data.actions';

export interface State {
  exportDataAsyncObj: AsyncStateObj<ExportData>;
}

const initialState: State = {
  exportDataAsyncObj: generateDefaultAsyncStateObj<ExportData>(null)
};

export function reducer(state = initialState, action: fromExportDataActions.Actions): State {
  switch (action.type) {
    case fromExportDataActions.SET_EXPORT_DATA:
      return AsyncStateObjHelper.loading(state, 'exportDataAsyncObj');
    case fromExportDataActions.SET_EXPORT_DATA_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'exportDataAsyncObj', action.payload);
    case fromExportDataActions.SET_EXPORT_DATA_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'exportDataAsyncObj');
    case fromExportDataActions.SAVE_EXPORT_DATA:
      return AsyncStateObjHelper.saving(state, 'exportDataAsyncObj');
    case fromExportDataActions.SAVE_EXPORT_DATA_SUCCESS:
      return AsyncStateObjHelper.savingSuccess(state, 'exportDataAsyncObj');
    case fromExportDataActions.SAVE_EXPORT_DATA_ERROR:
      return AsyncStateObjHelper.savingError(state, 'exportDataAsyncObj');
    default: {
      return state;
    }
  }
}

export const getExportDataAsyncObj = (state: State) => state.exportDataAsyncObj;
