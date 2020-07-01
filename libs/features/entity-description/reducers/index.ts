import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromEntityDescriptionReducer from './entity-description.reducer';

export interface EntityDescriptionFeatureState {
  entityDescription: fromEntityDescriptionReducer.State;
}

export interface State extends fromRoot.State {
  feature_entityDescription: EntityDescriptionFeatureState;
}

export const reducers = {
  entityDescription: fromEntityDescriptionReducer.reducer
};

export const selectFeatureAreaState = createFeatureSelector<EntityDescriptionFeatureState>('feature_entityDescription');

export const selectEntityDescriptionState = createSelector(
  selectFeatureAreaState,
  (state: EntityDescriptionFeatureState) => state.entityDescription
);

export const getEntityDescription = createSelector(selectEntityDescriptionState, fromEntityDescriptionReducer.getEntityDescription);
export const getLoadingEntityDescription = createSelector(selectEntityDescriptionState, fromEntityDescriptionReducer.getLoadingEntityDescription);
