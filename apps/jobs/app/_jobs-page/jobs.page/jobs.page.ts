import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs/index';
import { SortDescriptor } from '@progress/kendo-data-query';

import { Permissions } from 'libs/constants';
import { CompanyJobApiService } from 'libs/data/payfactors-api/company';
import { MODIFY_PRICINGS } from 'libs/features/multi-match/constants';
import {
  ActionBarConfig, getDefaultActionBarConfig, getDefaultGridRowActionsConfig, GridRowActionsConfig, GridConfig
} from 'libs/features/pf-data-grid/models';
import { AsyncStateObj, UserContext } from 'libs/models';
import { GetPricingsToModifyRequest } from 'libs/features/multi-match/models';
import { ChangeJobStatusRequest, CreateProjectRequest, MatchedSurveyJob, ViewField } from 'libs/models/payfactors-api';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';
import { SurveySearchFilterMappingDataObj, SurveySearchUserFilterType } from 'libs/features/survey-search/data';
import { SearchFeatureIds } from 'libs/features/search/enums/search-feature-ids';
import * as fromRootState from 'libs/state/state';
import * as fromModifyPricingsActions from 'libs/features/multi-match/actions';
import * as fromModifyPricingsReducer from 'libs/features/multi-match/reducers';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromJobManagementActions from 'libs/features/job-management/actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';

import { PageViewIds } from '../constants';
import { ShowingActiveJobs } from '../pipes';
import * as fromJobsPageActions from '../actions';
import * as fromJobsPageReducer from '../reducers';



@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss']
})

export class JobsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  permissions = Permissions;
  readonly showingActiveJobsPipe = new ShowingActiveJobs();

  pageViewId = PageViewIds.Jobs;
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  structureGradeNameOptions: any;
  filteredStructureGradeNameOptions: any;
  selectedJobIds: number[] = [];
  selectedPricingIds: number[] = [];
  selectedPricings: any[] = [];
  selectedUnpricedPaymarkets: any[] = [];

  jobStatusField: ViewField;
  payMarketField: ViewField;
  structureGradeSearchField: ViewField;
  selectedPayMarket: any;
  selectedStructureGrade: any;

  selectedKeysSubscription: Subscription;
  selectedPaymarketsSubscription: Subscription;
  gridFieldSubscription: Subscription;
  companyPayMarketsSubscription: Subscription;
  structureGradeNameSubscription: Subscription;
  selectedJobDataSubscription: Subscription;
  companySettingsSubscription: Subscription;

  userContext$: Observable<UserContext>;
  selectedRecordId$: Observable<number>;

  colTemplates = {};
  filterTemplates = {};

  gridRowActionsConfig: GridRowActionsConfig = getDefaultGridRowActionsConfig();
  actionBarConfig: ActionBarConfig;

  show: boolean;
  offset: {};
  peerJobId: number;
  target: string;

  filters = [{
    SourceName: 'JobStatus',
    Operator: '=',
    Value: 'true'
  }];

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyJobs_Job_Title'
  }];

  selectedJobPricingCount = 0;
  enablePageToggle = false;

  navigatingToOldPage$: Observable<AsyncStateObj<boolean>>;

  showCreateProjectModal = new BehaviorSubject<boolean>(false);
  showCreateProjectModal$ = this.showCreateProjectModal.asObservable();
  creatingProject$: Observable<AsyncStateObj<boolean>>;

  showJobStatusModal = new BehaviorSubject<boolean>(false);
  showJobStatusModal$ = this.showJobStatusModal.asObservable();
  changingJobStatus$: Observable<AsyncStateObj<boolean>>;
  changingJobStatusSuccessSubscription = new Subscription;

  showDeleteJobModal = new BehaviorSubject<boolean>(false);
  showDeleteJobModal$ = this.showDeleteJobModal.asObservable();
  deletingJob$: Observable<AsyncStateObj<boolean>>;
  deletingJobSuccessSubscription = new Subscription;
  jobIdToDelete: number;
  jobNameToDelete: string;

  showSurveyParticipationModal = new BehaviorSubject<boolean>(false);
  showSurveyParticipationModal$ = this.showSurveyParticipationModal.asObservable();
  matchJobId: number;

  updatingPricingMatch$: Observable<AsyncStateObj<boolean>>;
  updatingPricing$: Observable<AsyncStateObj<boolean>>;

  showModifyingPricings = new BehaviorSubject<boolean>(false);
  showModifyingPricings$ = this.showModifyingPricings.asObservable();
  pricingsToModify$: Observable<AsyncStateObj<MatchedSurveyJob[]>>;
  restrictSurveySearchToPaymarketCountry: boolean;

  showJobManagementModal = new BehaviorSubject<boolean>(false);
  showJobManagementModal$ = this.showJobManagementModal.asObservable();
  editingJobId: number;
  jobDescriptionsInReview: any[] = [];

  loadViewConfigSuccessSubscription = new Subscription;

  multiMatchImplementation = MODIFY_PRICINGS;

  gridConfig: GridConfig;
  hasInfiniteScrollFeatureFlagEnabled: boolean;


  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;
  @ViewChild('jobTitleColumn') jobTitleColumn: ElementRef;
  @ViewChild('jobMatchCount') jobMatchCount: ElementRef;
  @ViewChild('jobStatusColumn') jobStatusColumn: ElementRef;
  @ViewChild('hasPeerDataColumn') hasPeerDataColumn: ElementRef;

  @ViewChild('peerFilter') peerFilter: ElementRef;
  @ViewChild('payMarketFilter') payMarketFilter: ElementRef;
  @ViewChild('jobStatusFilter') jobStatusFilter: ElementRef;

  @ViewChild('gridGlobalActions', { static: true }) gridGlobalActionsTemplate: ElementRef;
  @ViewChild('structureGradeFilter') structureGradeFilter: ElementRef;


  constructor(
    private store: Store<fromJobsPageReducer.State>,
    private actionsSubject: ActionsSubject,
    private companyJobApiService: CompanyJobApiService,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.hasInfiniteScrollFeatureFlagEnabled = this.featureFlagService.enabled(FeatureFlags.PfDataGridInfiniteScroll, false);
    this.gridConfig = {
      PersistColumnWidth: true,
      EnableInfiniteScroll: this.hasInfiniteScrollFeatureFlagEnabled,
      ScrollToTop: this.hasInfiniteScrollFeatureFlagEnabled,
      SelectAllPanelItemName: 'jobs'
    };
  }

  ngOnInit() {
    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.selectedRecordId$ = this.store.select(fromPfDataGridReducer.getSelectedRecordId, this.pageViewId);
    this.creatingProject$ = this.store.select(fromJobsPageReducer.getCreatingProject);
    this.changingJobStatus$ = this.store.select(fromJobsPageReducer.getChangingJobStatus);
    this.deletingJob$ = this.store.select(fromJobsPageReducer.getDeletingJob);
    this.navigatingToOldPage$ = this.store.select(fromJobsPageReducer.getNavigatingToOldPage);
    this.updatingPricingMatch$ = this.store.select(fromJobsPageReducer.getUpdatingPricingMatch);
    this.updatingPricing$ = this.store.select(fromJobsPageReducer.getUpdatingPricing);
    this.pricingsToModify$ = this.store.select(fromModifyPricingsReducer.getPricingsToModify);

    this.companyPayMarketsSubscription = this.store.select(fromJobsPageReducer.getCompanyPayMarkets)
      .subscribe(o => {
        this.filteredPayMarketOptions = o;
        this.payMarketOptions = o;
      });

    this.structureGradeNameSubscription = this.store.select(fromJobsPageReducer.getStructureGradeNames).subscribe(sgn => {
      this.structureGradeNameOptions = sgn.obj;
      this.filteredStructureGradeNameOptions = sgn.obj;
    });

    this.selectedKeysSubscription = this.store.select(fromPfDataGridReducer.getSelectedKeys, this.pageViewId).subscribe(sk => {
      this.selectedJobIds = sk || [];
      this.selectedPricings = [...this.selectedPricings.filter(f => f.PaymarketId),
        ...this.selectedJobIds.map(v => {return {
          JobId: v,
        };
        })];
    });

    this.selectedPaymarketsSubscription = this.store.select(fromPfDataGridReducer.getSelectedData, PageViewIds.PayMarkets).subscribe(data => {
      if (data) {
        this.selectedPricings = [...data.map(v => {
          return {
            PricingId: v.CompanyJobs_Pricings_CompanyJobPricing_ID,
            JobId: v.CompanyJobs_CompanyJob_ID,
            PaymarketId: v.CompanyPayMarkets_CompanyPayMarket_ID,
          };
        }),
          ...this.selectedJobIds.map(v => {
          return {
            JobId: v
          };
        })];
        this.selectedPricingIds = data
          .filter(d => d.CompanyJobs_Pricings_CompanyJobPricing_ID)
          .map(d => d.CompanyJobs_Pricings_CompanyJobPricing_ID);
        this.selectedUnpricedPaymarkets = data
          .filter(d => !d.CompanyJobs_Pricings_CompanyJobPricing_ID);
      } else {
        this.selectedPricingIds = [];
        this.selectedUnpricedPaymarkets = [];
        this.selectedPricings = [];
      }
    });

    this.gridFieldSubscription = this.store.select(fromPfDataGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.jobStatusField = fields.find(f => f.SourceName === 'JobStatus');
        this.payMarketField = fields.find(f => f.SourceName === 'PayMarket');
        this.structureGradeSearchField = fields.find(f => f.SourceName === 'Grade_Name');
        this.selectedStructureGrade = this.structureGradeSearchField?.FilterValue !== null ?
          { Value: this.structureGradeSearchField?.FilterValue, Id: this.structureGradeSearchField?.FilterValue } : null;
        this.selectedPayMarket = this.payMarketField.FilterValue !== null ?
          { Value: this.payMarketField.FilterValue, Id: this.payMarketField.FilterValue } : null;
      }
    });

    this.selectedJobDataSubscription = this.store.select(fromPfDataGridReducer.getSelectedData, this.pageViewId).subscribe(data => {
      if (data) {
        const pricingCount = data.map(d => d['CompanyJobs_Priced']);
        this.selectedJobPricingCount = pricingCount.reduce((a, b) => a + b, 0);
      }
    });

    this.companySettingsSubscription = this.store.select(fromRootState.getCompanySettings).subscribe(cs => {
      if (cs) {
        const setting = cs.find(x => x.Key === 'EnableJobsPageToggle');
        this.enablePageToggle = setting && setting.Value === 'true';
        this.restrictSurveySearchToPaymarketCountry = cs.find(x => x.Key
          === 'RestrictSurveySearchCountryFilterToPayMarket').Value === 'true';
      }
    });

    this.changingJobStatusSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromJobsPageActions.CHANGING_JOB_STATUS_SUCCESS))
      .subscribe(data => {
        this.showJobStatusModal.next(false);
      });

    this.deletingJobSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromJobsPageActions.DELETING_JOB_SUCCESS))
      .subscribe(data => {
        this.showDeleteJobModal.next(false);
      });

    // clears selections upon selecting a saved filter
    this.loadViewConfigSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromPfDataGridActions.LOAD_VIEW_CONFIG_SUCCESS))
      .subscribe((action: fromPfDataGridActions.LoadViewConfigSuccess) => {
        if (action.pageViewId === PageViewIds.Jobs) {
          this.store.dispatch(new fromPfDataGridActions.ClearSelections(PageViewIds.PayMarkets));
        }
      });

    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true,
      ShowFilterChooser: true
    };

    this.store.dispatch(new fromJobsPageActions.SetJobsPageId(this.pageViewId));
    this.store.dispatch(new fromJobsPageActions.LoadCompanyPayMarkets());
    this.store.dispatch(new fromJobsPageActions.LoadStructureGrades());
    this.store.dispatch(new fromJobsPageActions.LoadCustomExports());
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'Job_Title': { Template: this.jobTitleColumn },
      'JobStatus': { Template: this.jobStatusColumn },
      'Peer': { Template: this.hasPeerDataColumn },
      'PricingMatchesCount': { Template: this.jobMatchCount },
    };

    this.filterTemplates = {
      'PayMarket': { Template: this.payMarketFilter },
      'Grade_Name': { Template: this.structureGradeFilter }
    };

    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate,
      GlobalFiltersTemplates: {
        'JobStatus': this.jobStatusFilter
      }
    };

    this.gridRowActionsConfig = {
      ...this.gridRowActionsConfig,
      ActionsTemplate: this.gridRowActionsTemplate
    };
  }

  clearFiltersAndSelections() {
    this.clearSelections();
    this.store.dispatch(new fromPfDataGridActions.ClearAllNonGlobalFilters(this.pageViewId));
  }

  clearSelections() {
    this.store.dispatch(new fromPfDataGridActions.ClearSelections(PageViewIds.PayMarkets));
    this.store.dispatch(new fromPfDataGridActions.ClearSelections(this.pageViewId));
  }

  openCreateProjectModal() {
    this.showCreateProjectModal.next(true);
    this.store.dispatch(new fromJobsPageActions.ResetJobsPageModals());

  }

  createProject() {
    const payload: CreateProjectRequest = {
      JobIds: this.selectedJobIds,
      PricingIds: this.selectedPricingIds,
      JobPayMarketSelections: this.selectedUnpricedPaymarkets.map(data => ({
        CompanyJobId: data.CompanyJobs_CompanyJob_ID,
        CompanyPayMarketId: data.CompanyPayMarkets_CompanyPayMarket_ID
      }))
    };
    this.store.dispatch(new fromJobsPageActions.CreatingProject(payload));
    this.store.dispatch(new fromJobsPageActions.ResetJobsPageModals());
  }

  openJobStatusModal() {
    // TODO: This needs to be part of the state so we can set the loading flag show a spinner while loading the JobDescriptionInformation
    this.companyJobApiService.getCompanyJobDescriptionInformation(this.selectedJobIds).subscribe(jds => {
      this.jobDescriptionsInReview = jds;
      this.showJobStatusModal.next(true);
      this.store.dispatch(new fromJobsPageActions.ResetJobsPageModals());
    });
  }

  changingJobStatus() {
    const summary: ChangeJobStatusRequest = {
      CompanyJobIds: this.selectedJobIds,
      JobsInReview: this.jobDescriptionsInReview,
      StatusToSet: this.showingActiveJobsPipe.transform(this.jobStatusField) ? 0 : 1
    };
    this.store.dispatch(new fromJobsPageActions.ChangingJobStatus(summary));
  }

  openDeleteJobModal(jobId: number, jobName: string) {
    this.jobIdToDelete = jobId;
    this.jobNameToDelete = jobName;
    this.showDeleteJobModal.next(true);
    this.store.dispatch(new fromJobsPageActions.ResetJobsPageModals());
  }

  deleteJob() {
    this.store.dispatch(new fromJobsPageActions.DeletingJob(this.jobIdToDelete));
  }

  ngOnDestroy() {
    this.selectedKeysSubscription.unsubscribe();
    this.selectedPaymarketsSubscription.unsubscribe();
    this.gridFieldSubscription.unsubscribe();
    this.companyPayMarketsSubscription.unsubscribe();
    this.structureGradeNameSubscription.unsubscribe();
    this.selectedJobDataSubscription.unsubscribe();
    this.companySettingsSubscription.unsubscribe();
    this.changingJobStatusSuccessSubscription.unsubscribe();
    this.deletingJobSuccessSubscription.unsubscribe();
    this.loadViewConfigSuccessSubscription.unsubscribe();
  }

  closeSplitView() {
    this.store.dispatch(new fromPfDataGridActions.UpdateSelectedRecordId(this.pageViewId, null, null));
  }

  handlePayMarketFilterChanged(value: any) {
    const field = cloneDeep(this.payMarketField);
    field.FilterValue = value.Id;
    field.FilterOperator = '=';
    this.updateField(field);
  }

  handleGradeFilterChanged(value: any) {
    const field = cloneDeep(this.structureGradeSearchField);
    field.FilterValue = value.Id;
    field.FilterOperator = '=';
    this.updateField(field);
  }

  handleJobStatusFilterChanged(field: ViewField, value: any) {
    const newField = { ...field };
    newField.FilterOperator = '=';
    newField.FilterValue = value;
    this.store.dispatch(new fromPfDataGridActions.UpdateFilter(this.pageViewId, newField));
  }

  updateField(field) {
    if (field.FilterValue) {
      this.store.dispatch(new fromPfDataGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfDataGridActions.ClearFilter(this.pageViewId, field));
    }
  }

  handlePayMarketDropdownFilter(value) {
    this.filteredPayMarketOptions = this.payMarketOptions.filter((s) => s.Id.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  handleStructureGradeNameDropdownFilter(value: string) {
    this.filteredStructureGradeNameOptions = this.structureGradeNameOptions.filter(o => o.Id.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

  toggleJobManagmentModal(toggle: boolean, jobId: number = null, event = null) {
    if (jobId === null) {
      this.store.dispatch(new fromJobManagementActions.ResetState());
    }

    this.editingJobId = jobId;
    this.showJobManagementModal.next(toggle);
    if (event) {
      event.stopPropagation();
    }
  }

  exportPricings(exportRequest: any) {
    const request = {
      CompanyJobIds: this.selectedJobIds,
      PricingIds: this.selectedPricingIds,
      FileExtension: exportRequest.Extension,
      Endpoint: exportRequest.Options.Endpoint,
      Name: exportRequest.Options.Name
    };

    this.store.dispatch(new fromJobsPageActions.ExportPricings(request));
  }

  onToggle(event, jobId) {
    if (this.peerJobId !== jobId) {
      this.peerJobId = jobId;
      this.show = !this.show;
      if (this.show) {
        this.offset = { left: event.clientX, top: event.clientY };
      }
    }
  }

  jobsPageToggle() {
    this.store.dispatch(new fromJobsPageActions.ToggleJobsPage());
  }

  openSurveyParticipationModal(matchCount: number, jobId: number, event) {
    if (matchCount > 0) {
      this.matchJobId = jobId;
      this.showSurveyParticipationModal.next(true);
    }
    if (event) {
      event.stopPropagation();
    }
  }

  modifyPricings() {
    const payload: GetPricingsToModifyRequest = {
      Pricings: this.selectedPricings,
      RestrictSearchToPayMarketCountry: this.restrictSurveySearchToPaymarketCountry
    };

    this.store.dispatch(new fromSearchPageActions.SetSearchFilterMappingData(SurveySearchFilterMappingDataObj));
    this.store.dispatch(new fromSearchPageActions.SetSearchFeatureId(SearchFeatureIds.MultiMatch));
    this.store.dispatch(new fromSearchPageActions.SetUserFilterTypeData(SurveySearchUserFilterType));
    this.store.dispatch(new fromModifyPricingsActions.GetPricingsToModify(payload));
  }

  matchModalSaved() {
    this.store.dispatch(new fromPfDataGridActions.ClearSelections(PageViewIds.PayMarkets));
    this.store.dispatch(new fromPfDataGridActions.LoadData(PageViewIds.PayMarkets));
  }
}
