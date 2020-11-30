import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import * as fromSearchReducer from 'libs/features/search/reducers';
import { SearchBaseDirective } from 'libs/features/search/containers/search-base';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import { AbstractFeatureFlagService, RealTimeFlag, FeatureFlags } from 'libs/core/services/feature-flags';
import { SearchFeatureIds } from 'libs/features/search/enums/search-feature-ids';
import {UpsertPeerDataCutEntityConfigurationModel} from 'libs/features/upsert-peer-data-cut/models';
import { UpsertPeerDataCutEntities, UpsertPeerDataCutParentEntities } from 'libs/features/upsert-peer-data-cut/constants';

import { cleanupDatacutsDragging, enableDatacutsDragging } from '../../survey-search/helpers';
import * as fromSurveySearchResultsActions from '../../survey-search/actions/survey-search-results.actions';
import { getSearchFilters, SurveySearchFilterMappingDataObj, SurveySearchUserFilterType } from '../../survey-search/data';

import * as fromMultiMatchPageActions from '../actions/multi-match-page.actions';
import * as fromJobsToPriceActions from '../actions/jobs-to-price.actions';
import * as fromModifyPricingsActions from '../actions/modify-pricings.actions';
import * as fromMultiMatchReducer from '../reducers';
import { JobToPrice } from '../models';
import { ProjectContext } from '../../survey-search/models';
import { LEGACY_PROJECTS, MODIFY_PRICINGS } from '../constants';
import * as fromSurveySearchReducer from '../../survey-search/reducers';
import * as fromChildFilterActions from '../../search/actions/child-filter.actions';
import * as fromSingledActions from '../../search/actions/singled-filter.actions';
import * as fromSearchResultsActions from '../../search/actions/search-results.actions';
import * as fromSearchPageActions from '../../search/actions/search-page.actions';

@Component({
  selector: 'pf-multi-match-component',
  templateUrl: './multi-match.component.html',
  styleUrls: ['./multi-match.component.scss']
})
export class MultiMatchComponent extends SearchBaseDirective implements OnInit, OnDestroy {
  @Input() display: 'component' | 'modal' = 'component';
  @Input() featureImplementation = LEGACY_PROJECTS;
  @Output() afterSaveChanges = new EventEmitter<boolean>();

  customizeScopeInMultimatchModalFlag: RealTimeFlag = { key: FeatureFlags.CustomizeScopeInMultimatchModal, value: false };
  unsubscribe$ = new Subject<void>();

  jobsToPrice$: Observable<JobToPrice[]>;
  savingChanges$: Observable<boolean>;
  pageShown$: Observable<boolean>;
  loadingResults$: Observable<boolean>;
  loadingMoreResults$: Observable<boolean>;
  searchError$: Observable<boolean>;
  refiningPeerCut$: Observable<boolean>;
  projectContext$: Observable<ProjectContext>;
  changesToSave: boolean;
  showMultiMatchModal = new BehaviorSubject<boolean>(false);
  showMultiMatchModal$ = this.showMultiMatchModal.asObservable();
  saveChangesStarted = false;
  hasError: boolean;
  matchMode: boolean;
  projectContext: ProjectContext;
  companyPayMarketId: number;
  companyJobId: number;
  initialContext: any;

  entityConfiguration: UpsertPeerDataCutEntityConfigurationModel = {
    BaseEntity: UpsertPeerDataCutEntities.ProjectJobs,
    ParentEntity: UpsertPeerDataCutParentEntities.Projects,
    BaseEntityId: null,
    ParentEntityId: null
  };

  // Subscription
  private jobsToPriceSubscription: Subscription;
  private refiningPeerCutSubscription: Subscription;
  private pricingsToModifySubscription: Subscription;
  private isSavedSubscription: Subscription;
  private hasErrorSubscription: Subscription;
  private projectContextSubscription: Subscription;

  constructor(
    store: Store<fromSearchReducer.State>,
    private dragulaService: DragulaService,
    private actionsSubject: ActionsSubject,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    super(store, SurveySearchFilterMappingDataObj, SearchFeatureIds.MultiMatch, SurveySearchUserFilterType);
    this.matchMode = this.featureFlagService.enabled(FeatureFlags.SurveySearchLightningMode, false);
    this.hasErrorSubscription = this.store.select(fromMultiMatchReducer.getHasError).subscribe(v => this.hasError = v);
    this.isSavedSubscription = this.store.select(fromMultiMatchReducer.getIsSaving)
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
    this.pricingsToModifySubscription = this.actionsSubject
      .pipe(ofType(fromModifyPricingsActions.GET_PRICINGS_TO_MODIFY_SUCCESS))
      .subscribe(p => {
        this.showMultiMatchModal.next(true);
      });
    this.projectContext$ = this.store.select(fromMultiMatchReducer.getMultimatchProjectContext);

    this.featureFlagService.bindEnabled(this.customizeScopeInMultimatchModalFlag, this.unsubscribe$);
  }

  ngOnInit(): void {
    this.jobsToPriceSubscription = this.jobsToPrice$.subscribe((jobsToPrice) => {
      this.changesToSave = jobsToPrice.some(job => this.jobHasChangesToSave(job));
    });

    this.projectContextSubscription = this.projectContext$.subscribe((context) => {
      if (context) {
        this.projectContext = context;
        this.companyJobId = 0;
        this.companyPayMarketId = this.projectContext?.SearchContext?.PayMarketId;
        this.entityConfiguration = {
          ...this.entityConfiguration,
          BaseEntityId: 0,
          ParentEntityId: this.projectContext?.ProjectId
        };
      }
    });

    this.refiningPeerCutSubscription = this.refiningPeerCut$.subscribe((refining) => {
      if (!refining && this.initialContext) {
        this.setContext();
      } else {
        this.onResetApp();
      }
    });
  }

  onResetApp() {
    this.store.dispatch(new fromSurveySearchResultsActions.ClearDataCutSelections());
    this.store.dispatch(new fromJobsToPriceActions.ClearAllJobs());

    this.store.dispatch(new fromSingledActions.Reset());
    this.store.dispatch(new fromChildFilterActions.Reset());
    this.store.dispatch(new fromSearchResultsActions.Reset());
    this.store.dispatch(new fromSearchPageActions.Reset());
    this.store.dispatch(new fromSearchFiltersActions.Reset());
  }

  onSetContext(payload: any) {
    if (!this.initialContext) {
      this.initialContext = payload;
    }

    this.store.dispatch(new fromSearchFiltersActions.AddFilters(getSearchFilters(this.matchMode)));
    this.store.dispatch(new fromMultiMatchPageActions.SetProjectContext(this.initialContext));
    this.store.dispatch(new fromMultiMatchPageActions.GetProjectSearchContext(this.initialContext));
    this.store.dispatch(new fromJobsToPriceActions.GetJobsToPrice(payload));
  }

  setContext() {
    const setContextMessage: MessageEvent = {
      data: {
        payfactorsMessage: {
          type: 'Set Context',
          payload: this.initialContext
        }
      }
    } as MessageEvent;
    this.onMessage(setContextMessage);
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
    super.resetActions();
    switch (this.featureImplementation) {
      case MODIFY_PRICINGS:
        this.showMultiMatchModal.next(false);
        this.hasError = false;
        this.onResetApp();
        break;
      default:
        super.handleCancelClicked();
        break;
    }
  }

  ngOnDestroy(): void {
    this.jobsToPriceSubscription.unsubscribe();
    this.pricingsToModifySubscription.unsubscribe();
    this.isSavedSubscription.unsubscribe();
    this.hasErrorSubscription.unsubscribe();
    cleanupDatacutsDragging(this.dragulaService);
  }

  private jobHasChangesToSave(job: JobToPrice): boolean {
    return (!!job.DataCutsToAdd && job.DataCutsToAdd.length > 0) || (!!job.DeletedJobMatchCutIds && job.DeletedJobMatchCutIds.length > 0);
  }
}
