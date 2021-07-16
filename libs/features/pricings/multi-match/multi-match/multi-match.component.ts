import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { ActionsSubject, Store } from '@ngrx/store';
import { skip, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { SearchBaseDirective } from 'libs/features/search/search/containers/search-base';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import { UpsertPeerDataCutComponent } from 'libs/features/pricings/upsert-peer-data-cut/upsert-peer-data-cut';
import { cleanupDatacutsDragging, enableDatacutsDragging, PayfactorsSurveySearchApiModelMapper } from 'libs/features/surveys/survey-search/helpers';
import { SurveySearchFilterMappingDataObj, SurveySearchUserFilterType } from 'libs/features/surveys/survey-search/data';
import { TempExchangeDataCutDetails } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { DataCutSummaryEntityTypes } from 'libs/constants';
import { PricingProjectHelperService } from 'libs/core';
import { TempDataCutService } from 'libs/features/temp-data-cut/services';
import * as fromSearchFeatureActions from 'libs/features/search/search/actions/search-feature.actions';
import * as fromSurveySearchResultsActions from 'libs/features/surveys/survey-search/actions/survey-search-results.actions';
import * as fromDataCutValidationActions from 'libs/features/peer/actions/data-cut-validation.actions';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import * as fromTempDataCutActions from 'libs/features/temp-data-cut/actions/temp-data-cut.actions';

import { JobToPrice } from '../models';
import { MultiMatchFeatureImplementations } from '../constants';
import * as fromMultiMatchPageActions from '../actions/multi-match-page.actions';
import * as fromJobsToPriceActions from '../actions/jobs-to-price.actions';
import * as fromModifyPricingsActions from '../actions/modify-pricings.actions';
import * as fromMultiMatchReducer from '../reducers';

@Component({
  selector: 'pf-multi-match-component',
  templateUrl: './multi-match.component.html',
  styleUrls: ['./multi-match.component.scss']
})
export class MultiMatchComponent extends SearchBaseDirective implements OnInit, OnDestroy {

  constructor(
    store: Store<fromSearchReducer.State>,
    private dragulaService: DragulaService,
    private actionsSubject: ActionsSubject,
    private featureFlagService: AbstractFeatureFlagService,
    public tempDataCutService: TempDataCutService,
    private pricingProjectHelperService: PricingProjectHelperService
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
          this.store.dispatch(new fromMultiMatchPageActions.SetMultiMatchModalStatus(false));
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
      case MultiMatchFeatureImplementations.MODIFY_PRICINGS:
        this.savingChanges$ = this.store.select(fromMultiMatchReducer.getIsSaving);
        break;
      default:
        this.savingChanges$ = this.store.select(fromMultiMatchReducer.getSavingJobMatchUpdates);
        break;
    }
    this.loadingResults$ = this.store.select(fromSearchReducer.getLoadingResults);
    this.loadingMoreResults$ = this.store.select(fromSearchReducer.getLoadingMoreResults);
    this.searchError$ = this.store.select(fromSearchReducer.getSearchResultsError);

    this.showMultiMatchModal$ = this.store.select(fromMultiMatchReducer.getShowModal);
  }
  @ViewChild(UpsertPeerDataCutComponent) upsertPeerDataCutComponent: UpsertPeerDataCutComponent;

  @Input() display: 'component' | 'modal' = 'component';
  @Input() featureImplementation = MultiMatchFeatureImplementations.LEGACY_PROJECTS;
  @Input() customSaveLogic = true;
  @Output() afterSaveChanges = new EventEmitter<boolean>();
  @Input() modalTitle = 'Price Jobs';

  changesToSave: boolean;
  saveChangesStarted = false;
  hasError: boolean;
  matchMode: boolean;
  refiningExchangeJobId: number;

  // Observables
  showMultiMatchModal$: Observable<boolean>;
  unsubscribe$ = new Subject<void>();
  jobsToPrice$: Observable<JobToPrice[]>;
  savingChanges$: Observable<boolean>;
  pageShown$: Observable<boolean>;
  loadingResults$: Observable<boolean>;
  loadingMoreResults$: Observable<boolean>;
  searchError$: Observable<boolean>;
  _multiMatchImplementations = MultiMatchFeatureImplementations;

  private static jobHasChangesToSave(job: JobToPrice): boolean {
    return (!!job.DataCutsToAdd && job.DataCutsToAdd.length > 0) || (!!job.DeletedJobMatchCutIds && job.DeletedJobMatchCutIds.length > 0);
  }

  ngOnInit(): void {
    this.jobsToPrice$.pipe(takeUntil(this.unsubscribe$)).subscribe((jobsToPrice) => {
      this.changesToSave = jobsToPrice.some(job => MultiMatchComponent.jobHasChangesToSave(job));
    });
    this.tempDataCutService.state$.pipe(
      skip(1),
      takeUntil(this.unsubscribe$)).subscribe((tempDataCutState) => {
        if (!tempDataCutState.creating && !tempDataCutState.editing) {
          this.store.dispatch(new fromSearchFeatureActions.SetSearchFeatureId(SearchFeatureIds.MultiMatch));
          return;
        }

        this.store.dispatch(new fromSearchFeatureActions.ResetSearchFeatureId(SearchFeatureIds.ExchangeExplorer));
        this.store.dispatch(new fromSearchFeatureActions.SetSearchFeatureId(SearchFeatureIds.ExchangeExplorer));

        if (!tempDataCutState.identity) {
          return;
        }
        if (tempDataCutState.creating) {
          this.upsertPeerDataCutComponent.refineExchangeJob(tempDataCutState.identity.ExchangeJobId);
          return;
        }

        if (tempDataCutState.identity.MatchType !== DataCutSummaryEntityTypes.CustomPeerCutId) {
          this.upsertPeerDataCutComponent.editTempDataCut(tempDataCutState.identity);
          return;
        }

        this.upsertPeerDataCutComponent.editTempDataCut({
          lockedExchangeJobId: tempDataCutState.identity.ExchangeJobId,
          exchangeDataSearchRequest: tempDataCutState.identity.FilterContext
        });
    });
  }

  onSetContext(payload: any) {
    if (!!this.upsertPeerDataCutComponent) {
      this.upsertPeerDataCutComponent.resetExchangeExplorer();
    }

    this.pricingProjectHelperService.SetProjectContext(payload);
  }

  onResetApp() {
    this.store.dispatch(new fromSurveySearchResultsActions.ClearDataCutSelections());
    this.store.dispatch(new fromJobsToPriceActions.ClearAllJobs());
    this.store.dispatch(new fromSurveySearchResultsActions.RefineExchangeJobResultComplete());
    this.tempDataCutService.reset();
  }

  handleSaveClicked() {
    switch (this.featureImplementation) {
      case MultiMatchFeatureImplementations.MODIFY_PRICINGS:
        this.store.dispatch(new fromModifyPricingsActions.ModifyPricings());
        break;
      default:
        this.store.dispatch(new fromMultiMatchPageActions.SaveJobMatchUpdates());
        break;
    }

  }

  handleCancelClicked() {
    if (this.display === 'modal') {
      this.store.dispatch(new fromMultiMatchPageActions.SetMultiMatchModalStatus(false));
    }

    switch (this.featureImplementation) {
      case MultiMatchFeatureImplementations.MODIFY_PRICINGS:
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
    this.store.dispatch(new fromSurveySearchResultsActions.GetExchangeDataResults({exchangeJobId: dataCut.ExchangeJobId}));
    this.store.dispatch(new fromSurveySearchResultsActions.AddTempExchangeDataCut({
      exchangeJobId: dataCut.ExchangeJobId,
      dataCut: PayfactorsSurveySearchApiModelMapper.mapCustomExchangeJobDataCutToDataCut(dataCut)
    }));

    this.tempDataCutService.complete(tempExchangeDataCutDetails);
  }

  handleTempDataCutEdited(tempExchangeDataCutDetails: TempExchangeDataCutDetails): void {
    this.store.dispatch(new fromTempDataCutActions.ReplaceDataCutWithTemp({
      tempDataCut: PayfactorsSurveySearchApiModelMapper.mapCustomExchangeJobDataCutToDataCut(tempExchangeDataCutDetails.TempExchangeJobDataCut),
      exchangeJobId: tempExchangeDataCutDetails.TempExchangeJobDataCut?.ExchangeJobId
    }));
    this.tempDataCutService.complete(tempExchangeDataCutDetails);
  }

  handleLoadRefiningValidationDetails(): void {
    this.store.dispatch(new fromDataCutValidationActions.LoadTempDataCutValidation(
      {
          hasProjectContext: this.featureImplementation !== MultiMatchFeatureImplementations.MODIFY_PRICINGS
        }
      )
    );
  }

  handleRefineCancelled(): void {
    const creatingExchangeJobId = this.tempDataCutService.creatingExchangeJobId;
    if (!!creatingExchangeJobId) {
      this.store.dispatch(new fromSurveySearchResultsActions.GetExchangeDataResults({exchangeJobId: creatingExchangeJobId}));
    }

    this.tempDataCutService.cancel();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    cleanupDatacutsDragging(this.dragulaService);
  }
}
