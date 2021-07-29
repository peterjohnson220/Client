import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

import * as fromSearchReducer from 'libs/features/search/search/reducers';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import { getSearchFilters } from 'libs/features/surveys/survey-search/data';
import * as fromMultiMatchPageActions from 'libs/features/pricings/multi-match/actions/multi-match-page.actions';
import * as fromJobsToPriceActions from 'libs/features/pricings/multi-match/actions/jobs-to-price.actions';
import * as fromAddSurveyDataActions from 'libs/features/pricings/add-data/actions/add-data.actions';
import * as fromContextActions from 'libs/features/surveys/survey-search/actions/context.actions';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import * as fromAddJobsPageActions from 'libs/features/jobs/add-jobs/actions/add-jobs-page.actions';
import {JobSearchUserFilterType, SearchFilterMappingData, staticFilters} from 'libs/features/jobs/add-jobs/data';
import * as fromPaymarketActions from 'libs/features/jobs/add-jobs/actions/paymarkets.actions';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import {SearchFeatureIds} from 'libs/features/search/search/enums/search-feature-ids';

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

  SetAddDataModalContext(jobContext: any, searchContext: any) {
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(getSearchFilters(this.matchMode)));
    this.store.dispatch(new fromContextActions.SetProjectSearchContext(searchContext));
    this.store.dispatch(new fromContextActions.SetJobContext(jobContext));
    this.store.dispatch(new fromAddSurveyDataActions.ResetAddData());
    this.store.dispatch(new fromAddSurveyDataActions.SetAddDataModalStatus(true));
  }

  SetAddJobsModalContext(payload: any) {
    this.store.dispatch(new fromSearchPageActions.SetSearchFeatureId(SearchFeatureIds.AddJobs));
    this.store.dispatch(new fromSearchPageActions.SetSearchFilterMappingData(SearchFilterMappingData));
    this.store.dispatch(new fromSearchPageActions.SetUserFilterTypeData(JobSearchUserFilterType));

    this.store.dispatch(new fromAddJobsPageActions.SetContext(payload));
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(staticFilters));
    this.store.dispatch(new fromPaymarketActions.SetDefaultPaymarket(Number(payload.PayMarketId)));
    this.store.dispatch(new fromPaymarketActions.LoadPaymarkets());
    this.store.dispatch(new fromCompanySettingsActions.LoadCompanySettings());

    this.store.dispatch(new fromAddJobsPageActions.SetAddJobsModalStatus(true));
  }
}
