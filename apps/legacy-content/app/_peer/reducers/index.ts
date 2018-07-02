import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromAddDataCutPageReducer from './add-data-cut-page.reducer';

// Feature area state
export interface AddPeerDataState {
  addDataCutPage: fromAddDataCutPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  legacy_addPeerData: AddPeerDataState;
}

// Feature area reducers
export const reducers = {
  addDataCutPage: fromAddDataCutPageReducer.reducer
};

// Select Feature Area
export const selectAddPeerDataState = createFeatureSelector<AddPeerDataState>('legacy_addPeerData');

// Feature Selectors
export const selectAddDataCutState = createSelector(selectAddPeerDataState, (state: AddPeerDataState) => state.addDataCutPage);

// Add Data Cut Selectors
export const getAddDataCutAddingDataCut = createSelector(selectAddDataCutState, fromAddDataCutPageReducer.getAddingDataCut);
export const getAddDataCutAddingDataCutError = createSelector(selectAddDataCutState, fromAddDataCutPageReducer.getAddingDataCutError);
export const getAddDataCutPageInViewInIframe = createSelector(selectAddDataCutState, fromAddDataCutPageReducer.getPageInViewInIframe);
export const getAddDataCutLoadingDataCutDetails = createSelector(selectAddDataCutState, fromAddDataCutPageReducer.getLoadingDataCutDetails);
export const getAddDataCutLoadingDataCutError = createSelector(
  selectAddDataCutState,
  fromAddDataCutPageReducer.getLoadingDataCutDetailsError
);
