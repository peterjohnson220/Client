import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';

import { Permissions } from 'libs/constants';
import { CompanyJobApiService } from 'libs/data/payfactors-api/company';
import { MultiMatchFeatureImplementations } from 'libs/features/pricings/multi-match/constants';
import {
  ActionBarConfig,
  getDefaultActionBarConfig,
  getDefaultGridRowActionsConfig,
  GridRowActionsConfig,
  GridConfig,
  PfDataGridCustomFilterDisplayOptions,
  PfDataGridCustomFilterOptions,
  PfDataGridFilter,
  GridConfigHelper
} from 'libs/features/grids/pf-data-grid/models';
import { AsyncStateObj, CompanySettingsEnum, GroupedListItem } from 'libs/models';
import { GetPricingsToModifyRequest } from 'libs/features/pricings/multi-match/models';
import { ChangeJobStatusRequest, CreateProjectRequest, ExportJobsRequest, MatchedSurveyJob, ModifyPricingMatchesResponse, ViewField } from 'libs/models/payfactors-api';
import { SurveySearchFilterMappingDataObj, SurveySearchUserFilterType } from 'libs/features/surveys/survey-search/data';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import { SettingsService } from 'libs/state/app-context/services';
import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common';
import { AppNotification, NotificationLevel } from 'libs/features/infrastructure/app-notifications';
import * as fromRootState from 'libs/state/state';
import * as fromModifyPricingsActions from 'libs/features/pricings/multi-match/actions';
import * as fromAddDataActions from 'libs/features/pricings/add-data/actions/add-data.actions';
import * as fromModifyPricingsReducer from 'libs/features/pricings/multi-match/reducers';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromJobManagementActions from 'libs/features/jobs/job-management/actions';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import * as fromSearchFeatureActions from 'libs/features/search/search/actions/search-feature.actions';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import * as fromLayoutWrapperReducer from 'libs/ui/layout-wrapper/reducers';
import * as fromLeftSidebarActions from 'libs/ui/layout-wrapper/actions/left-sidebar.actions';

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
  private unsubscribe$ = new Subject<void>();
  permissions = Permissions;
  readonly showingActiveJobsPipe = new ShowingActiveJobs();

  exportRequest: any;
  pageViewId = PageViewIds.Jobs;
  payMarketOptions: GroupedListItem[];
  structureGradeNameOptions: any;
  filteredStructureGradeNameOptions: any;
  selectedJobIds: number[] = [];
  selectedPricingIds: number[] = [];
  selectedPricings: any[] = [];
  selectedUnpricedPaymarkets: any[] = [];

  jobStatusField: ViewField;
  payMarketField: ViewField;
  structureGradeSearchField: ViewField;
  selectedPayMarkets: string[];
  pricingReviewedField: ViewField;

  selectedStructureGrade: any;
  selectedReviewedStatus: any;

  selectedKeysSubscription: Subscription;
  selectedPaymarketsSubscription: Subscription;
  gridFieldSubscription: Subscription;
  companyPayMarketsSubscription: Subscription;
  structureGradeNameSubscription: Subscription;
  selectedJobDataSubscription: Subscription;
  companySettingsSubscription: Subscription;
  getExportEventIdSubscription: Subscription;
  getNotificationSubscription: Subscription;
  leftSidebarOpenSubscription: Subscription;
  selectedRecordIdSubscription: Subscription;

  selectedRecordId$: Observable<number>;
  canEditJobCompanySetting$: Observable<boolean>;
  getExportEventId$: Observable<AsyncStateObj<string>>;
  getNotification$: Observable<AppNotification<any>[]>;
  exporting$: Observable<boolean>;
  leftSidebarOpen$: Observable<boolean>;

  colTemplates = {};
  filterTemplates = {};

  gridRowActionsConfig: GridRowActionsConfig = getDefaultGridRowActionsConfig();
  actionBarConfig: ActionBarConfig;

  show: boolean;
  offset: {};
  peerJobId: number;
  target: string;

  filters: PfDataGridFilter[] = [{
    SourceName: 'JobStatus',
    Operator: '=',
    Values: ['true']
  }];

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyJobs_Job_Title'
  }];

  selectedJobPricingCount = 0;
  enableFileDownloadSecurityWarning = false;

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

  multiMatchImplementation = MultiMatchFeatureImplementations.MODIFY_PRICINGS;

  gridConfig: GridConfig;

  multiMatchSaveChangesSubscription: Subscription;

  pricingReviewedDropdownDisplayOptions: PfDataGridCustomFilterDisplayOptions[] = [{
    Display: '',
    Value: null
  }, {
    Display: 'Yes',
    Value: 'Reviewed'
  }, {
    Display: 'No',
    Value: 'Not Reviewed'
  }];

  customPricingReviewedFilterOptions: PfDataGridCustomFilterOptions[] = [{
    EntitySourceName: 'CompanyJobs',
    SourceName: 'Status',
    FilterDisplayOptions: this.pricingReviewedDropdownDisplayOptions
  }];
  exportEventId: string;
  leftSidebarOpen: boolean;
  selectedRecordId: number;

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
  @ViewChild('pricingReviewedFilter') pricingReviewedFilter: ElementRef;
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;

  constructor(
    private store: Store<fromJobsPageReducer.State>,
    private actionsSubject: ActionsSubject,
    private companyJobApiService: CompanyJobApiService,
    private settingsService: SettingsService,
    private appNotificationStore: Store<fromAppNotificationsMainReducer.State>,
    private layoutWrapperStore: Store<fromLayoutWrapperReducer.State>,
  ) {
    this.gridConfig = {
      PersistColumnWidth: true,
      EnableInfiniteScroll: true,
      ScrollToTop: true,
      SelectAllPanelItemName: 'jobs',
      SplitViewColumnsWidth: GridConfigHelper.getSplitViewColumnsWidth(500, 0, true)
    };
    this.leftSidebarOpen$ = this.layoutWrapperStore.select(fromLayoutWrapperReducer.getLeftSidebarOpen);
  }

  ngOnInit() {
    this.selectedRecordId$ = this.store.select(fromPfDataGridReducer.getSelectedRecordId, this.pageViewId);
    this.creatingProject$ = this.store.select(fromJobsPageReducer.getCreatingProject);
    this.changingJobStatus$ = this.store.select(fromJobsPageReducer.getChangingJobStatus);
    this.deletingJob$ = this.store.select(fromJobsPageReducer.getDeletingJob);
    this.navigatingToOldPage$ = this.store.select(fromJobsPageReducer.getNavigatingToOldPage);
    this.updatingPricingMatch$ = this.store.select(fromJobsPageReducer.getUpdatingPricingMatch);
    this.updatingPricing$ = this.store.select(fromJobsPageReducer.getUpdatingPricing);
    this.pricingsToModify$ = this.store.select(fromModifyPricingsReducer.getPricingsToModify);
    this.canEditJobCompanySetting$ = this.settingsService.selectCompanySetting<boolean>(CompanySettingsEnum.CanEditJob);
    this.getNotification$ = this.appNotificationStore.select(fromAppNotificationsMainReducer.getNotifications);
    this.getExportEventId$ = this.store.select(fromJobsPageReducer.getExportEventId);
    this.exporting$ = this.store.select(fromJobsPageReducer.getExporting);

    this.companyPayMarketsSubscription = this.store.select(fromJobsPageReducer.getPayMarketGroupedListItems)
      .subscribe(o => this.payMarketOptions = o);

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
        this.selectedStructureGrade = this.structureGradeSearchField?.FilterValues?.length > 0 ?
          { Value: this.structureGradeSearchField.FilterValues[0], Id: this.structureGradeSearchField.FilterValues[0] } : null;
        this.selectedPayMarkets = this.payMarketField.FilterValues == null ? [] : this.payMarketField.FilterValues;
        this.pricingReviewedField = fields.find(f => f.SourceName === 'Status');
        this.selectedReviewedStatus = this.pricingReviewedField?.FilterValues?.length > 0 ?
          this.pricingReviewedDropdownDisplayOptions.find(x => x.Value === this.pricingReviewedField.FilterValues[0]) : null;
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
        this.restrictSurveySearchToPaymarketCountry = cs.find(x => x.Key === CompanySettingsEnum.RestrictSurveySearchCountryFilterToPayMarket).Value === 'true';
        this.enableFileDownloadSecurityWarning = cs.find(x => x.Key === CompanySettingsEnum.FileDownloadSecurityWarning).Value === 'true';
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

    this.multiMatchSaveChangesSubscription = this.actionsSubject
      .pipe(ofType(
        fromModifyPricingsActions.MODIFY_PRICINGS_SUCCESS,
        fromAddDataActions.ADD_PRICING_MATCHES_SUCCESS
        ))
      .subscribe((action: any) => {
        const payMarketGridAttentionGrabKeys = action.payload.map((x: ModifyPricingMatchesResponse) => {
          return `${x.CompanyJobId}_${x.PaymarketId}`;
        });

        this.store.dispatch(new fromPfDataGridActions.ClearSelections(PageViewIds.PayMarkets));
        this.store.dispatch(new fromPfDataGridActions.LoadDataAndAddFadeInKeys(PageViewIds.PayMarkets, payMarketGridAttentionGrabKeys));
      });
    this.initExportingSubscription();
    this.initLeftSidebarAndSplitViewToggleSubscription();

    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true,
      ShowFilterChooser: true
    };

    this.store.dispatch(new fromJobsPageActions.SetJobsPageId(this.pageViewId));
    this.store.dispatch(new fromJobsPageActions.LoadCompanyPayMarkets());
    this.store.dispatch(new fromJobsPageActions.LoadStructureGrades());
    this.store.dispatch(new fromJobsPageActions.LoadCustomExports());
    this.store.dispatch(new fromJobsPageActions.GetRunningExport(this.pageViewId));
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
      'Grade_Name': { Template: this.structureGradeFilter },
      'Status': { Template: this.pricingReviewedFilter }
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
    this.unsubscribe$.next();
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
    this.multiMatchSaveChangesSubscription.unsubscribe();
    this.getExportEventIdSubscription.unsubscribe();
    this.getNotificationSubscription.unsubscribe();
    this.leftSidebarOpenSubscription.unsubscribe();
    this.selectedRecordIdSubscription.unsubscribe();
  }

  closeSplitView() {
    this.store.dispatch(new fromPfDataGridActions.UpdateSelectedRecordId(this.pageViewId, null, null));
  }

  handlePayMarketFilterChanged(payMarkets: GroupedListItem[]) {
    const field: ViewField = cloneDeep(this.payMarketField);
    field.FilterValues = payMarkets?.length > 0 ? payMarkets.map(x => x.Value) : null;
    field.FilterOperator = 'in';
    this.updateField(field);
  }

  handleGradeFilterChanged(value: any) {
    const field: ViewField = cloneDeep(this.structureGradeSearchField);
    field.FilterValues = !!value?.Id ? [value.Id] : null;
    field.FilterOperator = '=';
    this.updateField(field);
  }

  handleJobStatusFilterChanged(field: ViewField, value: any) {
    const newField = cloneDeep(field);
    newField.FilterOperator = '=';
    newField.FilterValues = [value.toString()];
    this.store.dispatch(new fromPfDataGridActions.UpdateFilter(this.pageViewId, newField));
  }

  handlePricingReviewedStatusChanged(opt: any) {
    const field = cloneDeep(this.pricingReviewedField);
    field.FilterValues = opt.Value === null ? [] : [opt.Value];
    field.FilterOperator = '=';
    this.updateField(field);
  }


  updateField(field: ViewField) {
    if (field?.FilterValues?.length > 0) {
      this.store.dispatch(new fromPfDataGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfDataGridActions.ClearFilter(this.pageViewId, field));
    }
  }

  handleStructureGradeNameDropdownFilter(value: string) {
    this.filteredStructureGradeNameOptions = this.structureGradeNameOptions.filter(o => o.Id.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

  handleSecurityWarningConfirmed(isConfirmed) {
    if (isConfirmed) {
      this.exportPricings();
    }
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

  handleExportPricings(exportRequest: any) {
    this.exportRequest = exportRequest;
    if (this.enableFileDownloadSecurityWarning) {
      this.fileDownloadSecurityWarningModal.open();
    } else {
      this.exportPricings();
    }
  }

  exportPricings() {
    const request: ExportJobsRequest = {
      CompanyJobIds: this.selectedJobIds,
      PricingIds: this.selectedPricingIds,
      FileExtension: this.exportRequest.Extension,
      Endpoint: this.exportRequest.Options.Endpoint,
      Name: this.exportRequest.Options.Name,
      PageViewId: this.pageViewId
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
    this.store.dispatch(new fromSearchFeatureActions.SetSearchFeatureId(SearchFeatureIds.MultiMatch));
    this.store.dispatch(new fromSearchPageActions.SetUserFilterTypeData(SurveySearchUserFilterType));
    this.store.dispatch(new fromModifyPricingsActions.GetPricingsToModify(payload));
  }

  private initExportingSubscription(): void {
    this.getExportEventIdSubscription = this.getExportEventId$.subscribe(eventIdAsync => {
      if (!eventIdAsync?.loading && eventIdAsync.obj !== this.exportEventId) {
        this.exportEventId = eventIdAsync.obj;
      }
    });
    this.getNotificationSubscription = this.getNotification$.subscribe(notification => {
      const completeNotification = notification.find((x) =>
        (x.Level === NotificationLevel.Success || x.Level === NotificationLevel.Error) && x.NotificationId === this.exportEventId);
      if (completeNotification) {
        this.store.dispatch(new fromJobsPageActions.ExportingComplete());
      }
    });
  }

  private initLeftSidebarAndSplitViewToggleSubscription(): void {
    this.leftSidebarOpenSubscription = this.leftSidebarOpen$.subscribe(isOpen => {
      if (isOpen !== null) {
        this.leftSidebarOpen = isOpen;
        if (!!this.selectedRecordId && this.leftSidebarOpen) {
          this.closeSplitView();
        }
      }
    });

    this.selectedRecordIdSubscription = this.selectedRecordId$.subscribe(recordId => {
      if (!!recordId) {
        this.selectedRecordId = recordId;
        if (this.leftSidebarOpen) {
          this.layoutWrapperStore.dispatch(new fromLeftSidebarActions.CloseLeftSidebar());
        }
      }
    });
  }
}
