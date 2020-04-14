import * as fromPricingDetailsActions from '../actions/pricing-details.actions';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { PricingInfo } from 'libs/models/payfactors-api';
import { AsyncStateObjHelper } from 'libs/core';

export interface State {
  loading: boolean;
  newStatus: string;
  pricingInfo: AsyncStateObj<PricingInfo>;
  addingToNewProject: AsyncStateObj<boolean>;
  savingPricing: AsyncStateObj<boolean>;
}

export const initialState: State = {
  loading: true,
  newStatus: null,
  pricingInfo: generateDefaultAsyncStateObj<PricingInfo>(null),
  addingToNewProject: generateDefaultAsyncStateObj<boolean>(false),
  savingPricing: generateDefaultAsyncStateObj<boolean>(false),
};

export function reducer(state = initialState, action: fromPricingDetailsActions.Actions): State {
  switch (action.type) {
    case fromPricingDetailsActions.RESET_STATE:
      return initialState;
    case fromPricingDetailsActions.GET_PRICING_INFO:
      return AsyncStateObjHelper.loading(state, 'pricingInfo');
    case fromPricingDetailsActions.GET_PRICING_INFO_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'pricingInfo', action.payload);
    case fromPricingDetailsActions.GET_PRICING_INFO_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'pricingInfo');
    case fromPricingDetailsActions.ADDING_TO_NEW_PROJECT:
      return {
        ...AsyncStateObjHelper.loading(state, 'addingToNewProject'),
        savingPricing: { ...state.savingPricing, loadingError: false }
      };
    case fromPricingDetailsActions.ADDING_TO_NEW_PROJECT_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'addingToNewProject');
    case fromPricingDetailsActions.ADDING_TO_NEW_PROJECT_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'addingToNewProject', action.error);
    case fromPricingDetailsActions.SAVING_PRICING:
      return {
        ...AsyncStateObjHelper.loading(state, 'savingPricing'),
        addingToNewProject: { ...state.addingToNewProject, loadingError: false }
      };
    case fromPricingDetailsActions.SAVING_PRICING_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'savingPricing');
    case fromPricingDetailsActions.SAVING_PRICING_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'savingPricing', action.error);
    case fromPricingDetailsActions.STATUS_CHANGED:
      return {
        ...state,
        newStatus: action.newStatus,
        savingPricing: { ...state.savingPricing, loadingError: false },
        addingToNewProject: { ...state.addingToNewProject, loadingError: false }
      };
    default:
      return state;
  }
}

export const getState = (state: State) => state;
export const getLoading = (state: State) => state.pricingInfo.loading || state.addingToNewProject.loading || state.savingPricing.loading;
export const getNewStatus = (state: State) => state.newStatus;
export const getPricingInfo = (state: State) => state.pricingInfo;
export const getAddingToNewProject = (state: State) => state.addingToNewProject;
export const getSavingPricing = (state: State) => state.savingPricing;
