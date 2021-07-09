import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import * as fromSearchReducer from 'libs/features/search/search/reducers';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import { getSearchFilters } from 'libs/features/surveys/survey-search/data';
import * as fromMultiMatchPageActions from 'libs/features/pricings/multi-match/actions/multi-match-page.actions';
import * as fromJobsToPriceActions from 'libs/features/pricings/multi-match/actions/jobs-to-price.actions';
import * as fromAddSurveyDataActions from 'libs/features/pricings/add-data/actions/add-data.actions';
import { AbstractFeatureFlagService, FeatureFlags } from './feature-flags';
import * as fromContextActions from 'libs/features/surveys/survey-search/actions/context.actions';
import * as fromUserFilterActions from 'libs/features/users/user-filter/actions/user-filter.actions';


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

  SetAddDataModalContext(jobContext: any, searchContext: any) {
    this.store.dispatch(new fromSearchFiltersActions.RemoveFilters());
    this.store.dispatch(new fromUserFilterActions.Reset());

    this.store.dispatch(new fromSearchFiltersActions.AddFilters(getSearchFilters(this.matchMode)));
    this.store.dispatch(new fromContextActions.SetProjectSearchContext(searchContext));
    this.store.dispatch(new fromContextActions.SetJobContext(jobContext));
    this.store.dispatch(new fromAddSurveyDataActions.ResetAddData());
    this.store.dispatch(new fromAddSurveyDataActions.SetAddDataModalStatus(true));
  }
}
