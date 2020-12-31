import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { skip, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { SearchBaseDirective } from 'libs/features/search/containers/search-base';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';
import { SearchFeatureIds } from 'libs/features/search/enums/search-feature-ids';
import { UpsertPeerDataCutComponent } from 'libs/features/upsert-peer-data-cut/upsert-peer-data-cut';
import { cleanupDatacutsDragging, enableDatacutsDragging, PayfactorsSurveySearchApiModelMapper } from 'libs/features/survey-search/helpers';
import { getSearchFilters, SurveySearchFilterMappingDataObj, SurveySearchUserFilterType } from 'libs/features/survey-search/data';
import { TempExchangeDataCutDetails } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { ExchangeJobDataCut } from 'libs/features/survey-search/models';
import * as fromSearchFeatureActions from 'libs/features/search/actions/search-feature.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSurveySearchResultsActions from 'libs/features/survey-search/actions/survey-search-results.actions';
import * as fromDataCutValidationActions from 'libs/features/peer/actions/data-cut-validation.actions';
import * as fromSurveySearchReducer from 'libs/features/survey-search/reducers';
import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromMultiMatchPageActions from '../actions/multi-match-page.actions';
import * as fromJobsToPriceActions from '../actions/jobs-to-price.actions';
import * as fromModifyPricingsActions from '../actions/modify-pricings.actions';
import * as fromMultiMatchReducer from '../reducers';
import { JobToPrice } from '../models';
import { LEGACY_PROJECTS, MODIFY_PRICINGS } from '../constants';

@Component({
  selector: 'pf-multi-match-component',
  templateUrl: './multi-match.component.html',
  styleUrls: ['./multi-match.component.scss']
})
export class MultiMatchComponent extends SearchBaseDirective implements OnInit, OnDestroy {
  @ViewChild(UpsertPeerDataCutComponent) upsertPeerDataCutComponent: UpsertPeerDataCutComponent;

  @Input() display: 'component' | 'modal' = 'component';
  @Input() featureImplementation = LEGACY_PROJECTS;
  @Output() afterSaveChanges = new EventEmitter<boolean>();

  customizeScopeInMultimatchModalFlag: RealTimeFlag = { key: FeatureFlags.CustomizeScopeInMultimatchModal, value: false };
  changesToSave: boolean;
  saveChangesStarted = false;
  hasError: boolean;
  matchMode: boolean;
  refiningExchangeJobId: number;

  // Observables
  showMultiMatchModal = new BehaviorSubject<boolean>(false);
  showMultiMatchModal$ = this.showMultiMatchModal.asObservable();
  unsubscribe$ = new Subject<void>();
  jobsToPrice$: Observable<JobToPrice[]>;
  savingChanges$: Observable<boolean>;
  pageShown$: Observable<boolean>;
  loadingResults$: Observable<boolean>;
  loadingMoreResults$: Observable<boolean>;
  searchError$: Observable<boolean>;
  refiningPeerCut$: Observable<boolean>;
  refiningExchangeJobId$: Observable<number>;

  constructor(
    store: Store<fromSearchReducer.State>,
    private dragulaService: DragulaService,
    private actionsSubject: ActionsSubject,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    super(store, SurveySearchFilterMappingDataObj, SearchFeatureIds.MultiMatch, SurveySearchUserFilterType);
    this.matchMode = this.featureFlagService.enabled(FeatureFlags.SurveySearchLightningMode, false);
    this.store.select(fromMultiMatchReducer.getHasError).pipe(takeUntil(this.unsubscribe$)).subscribe(v => this.hasError = v);
    this.store.select(fromMultiMatchReducer.getIsSaving).pipe(takeUntil(this.unsubscribe$))
      .subscribe(v => {
      if (!v &&  v !== this.saveChangesStarted) {
        this.saveChangesStarted = v;
        if (!this.hasError) {
          this.afterSaveChanges.emit(true);
          this.showMultiMatchModal.next(false);
          super.resetActions();
        }
      }
      if (!!v) {
        this.saveChangesStarted = true;
      }
    });

    enableDatacutsDragging(dragulaService);
    this.pageShown$ = this.store.select(fromSearchReducer.getPageShown);
    this.jobsToPrice$ = this.store.select(fromMultiMatchReducer.getJobsToPrice);
    switch (this.featureImplementation) {
      case MODIFY_PRICINGS:
        this.savingChanges$ = this.store.select(fromMultiMatchReducer.getIsSaving);
        break;
      default:
        this.savingChanges$ = this.store.select(fromMultiMatchReducer.getSavingJobMatchUpdates);
        break;
    }
    this.loadingResults$ = this.store.select(fromSearchReducer.getLoadingResults);
    this.loadingMoreResults$ = this.store.select(fromSearchReducer.getLoadingMoreResults);
    this.searchError$ = this.store.select(fromSearchReducer.getSearchResultsError);
    this.refiningPeerCut$ = this.store.select(fromSurveySearchReducer.getRefining);
    this.refiningExchangeJobId$ = this.store.select(fromSurveySearchReducer.getRefiningJobId);
    this.actionsSubject
      .pipe(ofType(fromModifyPricingsActions.GET_PRICINGS_TO_MODIFY_SUCCESS), takeUntil(this.unsubscribe$))
      .subscribe(p => {
        this.showMultiMatchModal.next(true);
      });

    this.featureFlagService.bindEnabled(this.customizeScopeInMultimatchModalFlag, this.unsubscribe$);
  }

  ngOnInit(): void {
    this.jobsToPrice$.pipe(takeUntil(this.unsubscribe$)).subscribe((jobsToPrice) => {
      this.changesToSave = jobsToPrice.some(job => this.jobHasChangesToSave(job));
    });
    this.refiningExchangeJobId$.pipe(takeUntil(this.unsubscribe$)).subscribe((exchangeJobId) => this.refiningExchangeJobId = exchangeJobId);
    this.refiningPeerCut$.pipe(skip(1), takeUntil(this.unsubscribe$)).subscribe((refining) => {
      if (!refining) {
        this.store.dispatch(new fromSearchFeatureActions.SetSearchFeatureId(SearchFeatureIds.MultiMatch));
      } else {
        this.store.dispatch(new fromSearchFeatureActions.ResetSearchFeatureId(SearchFeatureIds.ExchangeExplorer));
        this.store.dispatch(new fromSearchFeatureActions.SetSearchFeatureId(SearchFeatureIds.ExchangeExplorer));
        this.upsertPeerDataCutComponent.refineExchangeJob(this.refiningExchangeJobId);
      }
    });
  }

  onSetContext(payload: any) {
    if (!!this.upsertPeerDataCutComponent) {
      this.upsertPeerDataCutComponent.resetExchangeExplorer();
    }
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(getSearchFilters(this.matchMode)));
    this.store.dispatch(new fromMultiMatchPageActions.SetProjectContext(payload));
    this.store.dispatch(new fromMultiMatchPageActions.GetProjectSearchContext(payload));
    this.store.dispatch(new fromJobsToPriceActions.GetJobsToPrice(payload));
  }

  onResetApp() {
    this.store.dispatch(new fromSurveySearchResultsActions.ClearDataCutSelections());
    this.store.dispatch(new fromJobsToPriceActions.ClearAllJobs());
    this.store.dispatch(new fromSurveySearchResultsActions.RefineExchangeJobResultComplete());
    this.store.dispatch(new fromSurveySearchResultsActions.ClearTempDataCutDictionary());
  }

  handleSaveClicked() {
    switch (this.featureImplementation) {
      case MODIFY_PRICINGS:
        this.store.dispatch(new fromModifyPricingsActions.ModifyPricings());
        break;
      default:
        this.store.dispatch(new fromMultiMatchPageActions.SaveJobMatchUpdates());
        break;
    }

  }

  handleCancelClicked() {
    switch (this.featureImplementation) {
      case MODIFY_PRICINGS:
        this.showMultiMatchModal.next(false);
        this.hasError = false;
        super.resetApp();
        break;
      default:
        super.resetApp();
        super.handleCancelClicked();
        break;
    }
  }

  handleExchangeDataCutRefined(tempExchangeDataCutDetails: TempExchangeDataCutDetails): void {
    const dataCut = tempExchangeDataCutDetails.TempExchangeJobDataCut;
    const refinedCut: ExchangeJobDataCut = {
      ExchangeJobId: dataCut.ExchangeJobId,
      DataCut: PayfactorsSurveySearchApiModelMapper.mapCustomExchangeJobDataCutToDataCut(dataCut),
      ExchangeDataSearchRequest: tempExchangeDataCutDetails.ExchangeDataSearchRequest
    };

    this.store.dispatch(new fromSurveySearchResultsActions.GetExchangeDataResults({exchangeJobId: dataCut.ExchangeJobId}));
    this.store.dispatch(new fromSurveySearchResultsActions.AddRefinedExchangeDataCut(refinedCut));
    this.store.dispatch(new fromDataCutValidationActions.AddTempDataCutValidation(dataCut.DataCutValidationInfo));
    this.store.dispatch(new fromSurveySearchResultsActions.RefineExchangeJobResultComplete());
  }

  handleLoadRefiningValidationDetails(): void {
    this.store.dispatch(new fromDataCutValidationActions.LoadTempDataCutValidation({hasProjectContext: this.featureImplementation !== MODIFY_PRICINGS}));
  }

  handleRefineCancelled(): void {
    this.store.dispatch(new fromSurveySearchResultsActions.GetExchangeDataResults({exchangeJobId: this.refiningExchangeJobId}));
    this.store.dispatch(new fromSurveySearchResultsActions.RefineExchangeJobResultComplete());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    cleanupDatacutsDragging(this.dragulaService);
  }

  private jobHasChangesToSave(job: JobToPrice): boolean {
    return (!!job.DataCutsToAdd && job.DataCutsToAdd.length > 0) || (!!job.DeletedJobMatchCutIds && job.DeletedJobMatchCutIds.length > 0);
  }
}
