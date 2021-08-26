import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';
import { DragulaService } from 'ng2-dragula';

import { SearchBaseDirective } from 'libs/features/search/search/containers/search-base';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';
import { DataCutDetails, JobContext } from 'libs/features/surveys/survey-search/models';
import { getSearchFilters, SurveySearchFilterMappingDataObj, SurveySearchUserFilterType } from 'libs/features/surveys/survey-search/data';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import * as fromSearchResultsActions from 'libs/features/search/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromSurveySearchReducer from 'libs/features/surveys/survey-search/reducers';
import * as fromContextActions from 'libs/features/surveys/survey-search/actions/context.actions';
import * as fromSurveySearchResultsActions from 'libs/features/surveys/survey-search/actions/survey-search-results.actions';
import * as fromContextReducer from 'libs/features/surveys/survey-search/reducers';

import * as fromAddSurveyDataActions from '../actions/add-data.actions';
import * as fromAddDataReducer from '../reducers';
import { AddDataFeatureImplementations } from '../models';

@Component({
  selector: 'pf-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent extends SearchBaseDirective implements OnInit, OnDestroy {
  @Input() display: 'component' | 'modal' = 'component';
  @Input() featureImplementation = AddDataFeatureImplementations.LEGACY_PROJECTS;
  @Input() showSubmit = false;
  selectedCuts$: Observable<DataCutDetails[]>;
  addingData$: Observable<boolean>;
  pageShown$: Observable<boolean>;
  excludeFromParticipation: boolean;
  matchMode: boolean;
  showAddModal$: Observable<boolean>;
  loadingResults$: Observable<boolean>;
  searchError$: Observable<boolean>;
  jobContext$: Observable<JobContext>;

  addDataSuccessSubscription: Subscription;

  implementations = AddDataFeatureImplementations;

  constructor(
    store: Store<fromSearchReducer.State>,
    private dragulaService: DragulaService,
    private featureFlagService: AbstractFeatureFlagService,
    private actionsSubject: ActionsSubject
  ) {
    super(store, SurveySearchFilterMappingDataObj, SearchFeatureIds.AddSurveyData, SurveySearchUserFilterType);
    this.matchMode = this.featureFlagService.enabled(FeatureFlags.SurveySearchLightningMode, false);
    this.selectedCuts$ = this.store.select(fromSurveySearchReducer.getSelectedDataCuts);
    this.addingData$ = this.store.select(fromAddDataReducer.getAddingData);
    this.pageShown$ = this.store.select(fromSearchReducer.getPageShown);
    this.excludeFromParticipation = false;
    this.loadingResults$ = this.store.select(fromSearchReducer.getLoadingResults);
    this.searchError$ = this.store.select(fromSearchReducer.getSearchResultsError);
    this.showAddModal$ = this.store.select(fromAddDataReducer.getShowModal);
    this.jobContext$ = this.store.select(fromContextReducer.getJobContext);
  }

  ngOnInit(): void {
    this.addDataSuccessSubscription = this.actionsSubject.pipe(
      ofType(fromAddSurveyDataActions.ADD_DATA_SUCCESS)
    ).subscribe((data) => this.handleCancelClicked());
  }

  ngOnDestroy(): void {
    this.addDataSuccessSubscription.unsubscribe();
  }

  onResetApp() {
    this.store.dispatch(new fromSearchResultsActions.ClearResults());
    this.store.dispatch(new fromSurveySearchResultsActions.ClearDataCutSelections());
    this.excludeFromParticipation = false;
  }

  onSetContext(payload: any) {
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(getSearchFilters(this.matchMode)));
    this.store.dispatch(new fromContextActions.SetProjectSearchContext(payload.SearchContext));
    this.store.dispatch(new fromContextActions.SetJobContext(payload.JobContext));
    this.store.dispatch(new fromAddSurveyDataActions.ResetAddData());
  }
  // Event Handling
  handleAddClicked() {
    switch (this.featureImplementation) {
      case AddDataFeatureImplementations.MODIFY_PRICINGS:
        this.store.dispatch(new fromAddSurveyDataActions.AddPricingMatches());
        break;
      default:
        this.store.dispatch(new fromAddSurveyDataActions.AddData(this.excludeFromParticipation));
        break;
    }
  }
  handleCancelClicked() {
    super.handleCancelClicked();
    super.resetApp();
    if (this.display === 'modal') {
      this.store.dispatch( new fromAddSurveyDataActions.SetAddDataModalStatus(false));
    }
  }
}
