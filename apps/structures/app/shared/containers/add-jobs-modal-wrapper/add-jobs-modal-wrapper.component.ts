import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { SearchBaseDirective } from 'libs/features/search/search/containers/search-base';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import * as fromAddJobsPageActions from 'libs/features/jobs/add-jobs/actions/add-jobs-page.actions';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromPaymarketActions from 'libs/features/jobs/add-jobs/actions/paymarkets.actions';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import * as fromAddJobsSearchResultsActions from 'libs/features/jobs/add-jobs/actions/search-results.actions';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import { GradeRangeGroupDetails } from 'libs/features/structures/add-jobs-to-range/models';
import { RangeType } from 'libs/constants/structures/range-type';

import {
  StructuresJobSearchUserFilterType,
  staticFilters,
  JobBasedSearchFilterMappingDataObj,
  GradeBasedSearchFilterMappingDataObj
} from '../../data';

@Component({
  selector: 'pf-add-jobs-modal-wrapper',
  templateUrl: './add-jobs-modal-wrapper.component.html',
  styleUrls: ['./add-jobs-modal-wrapper.component.scss']
})
export class AddJobsModalWrapperComponent extends SearchBaseDirective implements OnInit {
  @Input() rangeTypeId: number;
  @Input() controlPoint: string;
  @Input() rate: string;
  @Input() gradeRangeGroupDetails: GradeRangeGroupDetails;
  // Observables
  pageShown$: Observable<boolean>;

  // Constants
  MODAL_NAME = 'Add Jobs';
  isJobRange: boolean;

  constructor(
    store: Store<fromSearchReducer.State>
  ) {
    super(store, JobBasedSearchFilterMappingDataObj, SearchFeatureIds.AddJobs, StructuresJobSearchUserFilterType);
    this.pageShown$ = this.store.select(fromSearchReducer.getPageShown);
  }

  onSetContext(payload: any): void {
    this.store.dispatch(new fromAddJobsPageActions.SetContext(payload));
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(staticFilters));

    this.store.dispatch(new fromPaymarketActions.SetDefaultPaymarket(Number(payload.PayMarketId)));
    this.store.dispatch(new fromPaymarketActions.LoadPaymarkets());

    // Always get the latest company settings so we have the latest job count
    this.store.dispatch(new fromCompanySettingsActions.LoadCompanySettings());
  }

  onResetApp(): void {
    this.store.dispatch(new fromPaymarketActions.ClearPayMarkets());
    this.store.dispatch(new fromAddJobsSearchResultsActions.ClearSelectedJobs());
    this.store.dispatch(new fromAddJobsSearchResultsActions.Reset());
  }

  close() {
    this.store.dispatch(new fromSearchPageActions.CloseSearchPage());
  }

  ngOnInit(): void {
    this.isJobRange = this.rangeTypeId === RangeType.Job;
    super.searchFilterMappingDataObj = !this.isJobRange ? GradeBasedSearchFilterMappingDataObj : JobBasedSearchFilterMappingDataObj;
  }
}
