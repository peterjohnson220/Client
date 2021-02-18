import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromPricingProjectPageReducer from './pricing-project-page.reducer';

export interface PricingProjectPageStateMain {
  pricingProjectPage: fromPricingProjectPageReducer.State;
}

export interface State extends fromRoot.State {
  pricingProjectPage: PricingProjectPageStateMain;
}

export const reducers = {
  pricingProjectPage: fromPricingProjectPageReducer.reducer
};

export const selectPricingProjectPageMainState =
    createFeatureSelector<PricingProjectPageStateMain>('pricingProjectPageMain');

export const selectPricingProjectPageState =
    createSelector(selectPricingProjectPageMainState, (state: PricingProjectPageStateMain) => state.pricingProjectPage);

export const getPricingProject = createSelector(selectPricingProjectPageState, fromPricingProjectPageReducer.getPricingProject);
