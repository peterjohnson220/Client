import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import * as fromSearchReducer from 'libs/features/search/search/reducers';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import { getSearchFilters } from 'libs/features/surveys/survey-search/data';
import * as fromMultiMatchPageActions from 'libs/features/pricings/multi-match/actions/multi-match-page.actions';
import * as fromJobsToPriceActions from 'libs/features/pricings/multi-match/actions/jobs-to-price.actions';

import { AbstractFeatureFlagService, FeatureFlags } from './feature-flags';

@Injectable()
export class PricingProjectHelperService {
  matchMode: boolean;
  constructor(
    private store: Store<fromSearchReducer.State>,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.matchMode = this.featureFlagService.enabled(FeatureFlags.SurveySearchLightningMode, false);
  }

  SetProjectContext(context: any) {
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(getSearchFilters(this.matchMode)));
    this.store.dispatch(new fromMultiMatchPageActions.SetProjectContext(context));
    this.store.dispatch(new fromMultiMatchPageActions.GetProjectSearchContext(context));
    this.store.dispatch(new fromJobsToPriceActions.GetJobsToPrice(context));
  }
}
