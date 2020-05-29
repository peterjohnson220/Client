import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs/index';

import { Store, ActionsSubject } from '@ngrx/store';

import { SortDescriptor } from '@progress/kendo-data-query';

import * as cloneDeep from 'lodash.clonedeep';

import { ViewField, CreateProjectRequest, ChangeJobStatusRequest, MatchedSurveyJob } from 'libs/models/payfactors-api';
import { Permissions } from 'libs/constants';
import { ActionBarConfig, ColumnChooserType, getDefaultGridRowActionsConfig, GridRowActionsConfig } from 'libs/features/pf-data-grid/models';
import { AsyncStateObj, UserContext } from 'libs/models';

import * as fromRootState from 'libs/state/state';

import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import { CompanyJobApiService } from 'libs/data/payfactors-api/company';

import { PageViewIds } from '../constants';
import * as fromJobsPageActions from '../actions';
import * as fromJobsPageReducer from '../reducers';
import * as fromModifyPricingsActions from '../actions';
import * as fromModifyPricingsReducer from '../reducers';
import { ofType } from '@ngrx/effects';

@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss']
})

export class JobsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  permissions = Permissions;

  pageViewId = PageViewIds.Jobs;
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  structureGradeNameOptions: any;
  filteredStructureGradeNameOptions: any;
  selectedJobIds: number[] = [];
  selectedPricingIds: number[] = [];
  selectedJobPayMarketCombos: string[];

  jobStatusField: ViewField;
  payMarketField: ViewField;
  structureGradeSearchField: ViewField;
  selectedPayMarket: any;
  selectedStructureGrade: any;

  selectedKeysSubscription: Subscription;
  selectedPricingIdSubscription: Subscription;
  selectedJobPayMarketSubscription: Subscription;
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

  disableExportPopover = true;
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

  showModifyingPricings = new BehaviorSubject<boolean>(false);
  showModifyingPricings$ = this.showModifyingPricings.asObservable();
  pricingsToModify$: Observable<AsyncStateObj<MatchedSurveyJob[]>>;

  showJobManagementModal = new BehaviorSubject<boolean>(false);
  showJobManagementModal$ = this.showJobManagementModal.asObservable();
  editingJobId: number;
  jobDescriptionsInReview: any[] = [];

  loadViewConfigSuccessSubscription = new Subscription;

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


  constructor(private store: Store<fromJobsPageReducer.State>, private actionsSubject: ActionsSubject, private companyJobApiService: CompanyJobApiService) { }

  ngOnInit() {
    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.selectedRecordId$ = this.store.select(fromPfDataGridReducer.getSelectedRecordId, this.pageViewId);
    this.creatingProject$ = this.store.select(fromJobsPageReducer.getCreatingToProject);
    this.changingJobStatus$ = this.store.select(fromJobsPageReducer.getChangingJobStatus);
    this.deletingJob$ = this.store.select(fromJobsPageReducer.getDeletingJob);
    this.navigatingToOldPage$ = this.store.select(fromJobsPageReducer.getNavigatingToOldPage);
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
    });

    this.selectedPricingIdSubscription = this.store.select(fromPfDataGridReducer.getSelectedKeys, PageViewIds.PricingDetails).subscribe(pid => {
      this.selectedPricingIds = pid || [];

      if (this.selectedPricingIds.length) {
        this.disableExportPopover = false;
      } else {
        this.disableExportPopover = !(this.selectedJobPricingCount > 0);
      }
    });

    this.selectedJobPayMarketSubscription = this.store.select(fromPfDataGridReducer.getSelectedKeys, PageViewIds.NotPricedPayMarkets)
      .subscribe(jpm => {
        this.selectedJobPayMarketCombos = jpm || [];
      });

    this.gridFieldSubscription = this.store.select(fromPfDataGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.jobStatusField = fields.find(f => f.SourceName === 'JobStatus');
        this.payMarketField = fields.find(f => f.SourceName === 'PayMarket');
        this.structureGradeSearchField = fields.find(f => f.SourceName === 'Grade_Name');
        this.selectedStructureGrade = this.structureGradeSearchField.FilterValue !== null ?
          { Value: this.structureGradeSearchField.FilterValue, Id: this.structureGradeSearchField.FilterValue } : null;
        this.selectedPayMarket = this.payMarketField.FilterValue !== null ?
          { Value: this.payMarketField.FilterValue, Id: this.payMarketField.FilterValue } : null;
      }
    });

    this.selectedJobDataSubscription = this.store.select(fromPfDataGridReducer.getSelectedData, this.pageViewId).subscribe(data => {
      if (data) {
        const pricingCount = data.map(d => d['CompanyJobs_Priced']);
        this.selectedJobPricingCount = pricingCount.reduce((a, b) => a + b, 0);

        if (this.selectedJobPricingCount > 0) {
          this.disableExportPopover = false;
        } else {
          this.disableExportPopover = !(this.selectedPricingIds.length > 0);
        }
      }
    });

    this.companySettingsSubscription = this.store.select(fromRootState.getCompanySettings).subscribe(cs => {
      if (cs) {
        const setting = cs.find(x => x.Key === 'EnableJobsPageToggle');
        this.enablePageToggle = setting && setting.Value === 'true';
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
          this.store.dispatch(new fromPfDataGridActions.ClearSelections(PageViewIds.PricingDetails));
          this.store.dispatch(new fromPfDataGridActions.ClearSelections(PageViewIds.NotPricedPayMarkets));
        }
      });

    this.actionBarConfig = {
      ShowActionBar: true,
      ShowColumnChooser: true,
      ShowFilterChooser: true,
      AllowExport: false,
      AllowSaveFilter: true,
      ExportSourceName: '',
      ColumnChooserType: ColumnChooserType.Column
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
    this.store.dispatch(new fromPfDataGridActions.ClearSelections(PageViewIds.PricingDetails));
    this.store.dispatch(new fromPfDataGridActions.ClearSelections(this.pageViewId));
    this.store.dispatch(new fromPfDataGridActions.ClearSelections(PageViewIds.NotPricedPayMarkets));
  }

  openCreateProjectModal() {
    this.showCreateProjectModal.next(true);
    this.store.dispatch(new fromJobsPageActions.ShowCreateProjectModal());
  }

  createProject() {
    const payload: CreateProjectRequest = {
      JobIds: this.selectedJobIds,
      PricingIds: this.selectedPricingIds,
      JobPayMarketSelections: this.selectedJobPayMarketCombos.map(jpm => {
        const jobId = parseInt(jpm.split('_')[0], 10);
        const payMarketId = parseInt(jpm.split('_')[1], 10);
        return {
          CompanyJobId: jobId,
          CompanyPayMarketId: payMarketId
        };
      })
    };
    this.store.dispatch(new fromJobsPageActions.CreatingProject(payload));
  }

  openJobStatusModal() {
    this.showJobStatusModal.next(true);
    this.companyJobApiService.getCompanyJobDescriptionInformation(this.selectedJobIds).subscribe(jds => {
      this.jobDescriptionsInReview = jds;
      this.store.dispatch(new fromJobsPageActions.ShowJobStatusModal());
    });
  }

  changingJobStatus() {
    const summary: ChangeJobStatusRequest = {
      CompanyJobIds: this.selectedJobIds,
      JobsInReview: this.jobDescriptionsInReview,
      StatusToSet: this.isActiveJobs() ? 0 : 1
    };

    this.store.dispatch(new fromJobsPageActions.ChangingJobStatus(summary));
  }

  openDeleteJobModal(jobId: number, jobName: string) {
    this.jobIdToDelete = jobId;
    this.jobNameToDelete = jobName;
    this.showDeleteJobModal.next(true);
    this.store.dispatch(new fromJobsPageActions.ShowDeleteJobModal());
  }

  deleteJob() {
    this.store.dispatch(new fromJobsPageActions.DeletingJob(this.jobIdToDelete));
  }

  ngOnDestroy() {
    this.selectedKeysSubscription.unsubscribe();
    this.selectedPricingIdSubscription.unsubscribe();
    this.gridFieldSubscription.unsubscribe();
    this.companyPayMarketsSubscription.unsubscribe();
    this.structureGradeNameSubscription.unsubscribe();
    this.selectedJobPayMarketSubscription.unsubscribe();
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

  isActiveJobs() {
    return this.jobStatusField ? this.jobStatusField.FilterValue : true;
  }

  toggleJobManagmentModal(toggle: boolean, jobId: number = null, event = null) {
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
    this.showModifyingPricings.next(true);
    this.store.dispatch(new fromModifyPricingsActions.GetPricingsToModify(this.selectedPricingIds));
  }
}
