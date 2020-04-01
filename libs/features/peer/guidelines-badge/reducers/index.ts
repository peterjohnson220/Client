import {createFeatureSelector, createSelector} from '@ngrx/store';

import * as fromRoot from '../../../../state/state';
import * as fromDataCutValidationReducer from './data-cut-validation.reducer';


export interface DataCutValidationState {
  dataCutValidation: fromDataCutValidationReducer.State;
}

export interface State extends fromRoot.State {
  dataCutValidation: fromDataCutValidationReducer.State;
}

export const reducers = {
  dataCutValidation: fromDataCutValidationReducer.reducer
};

export const selectUpsertPeerDataState =
  createFeatureSelector<DataCutValidationState>('dataCutValidation');

export const selectDataCutValidationState =
  createSelector(selectUpsertPeerDataState, (state: DataCutValidationState) => state.dataCutValidation);
export const {
  selectAll: getDataCutValidationInfo
} = fromDataCutValidationReducer.adapter.getSelectors(selectDataCutValidationState);

export const getEmployeeCheckPassed = createSelector(selectDataCutValidationState,
  fromDataCutValidationReducer.getEmployeeSimilarityPassed);


