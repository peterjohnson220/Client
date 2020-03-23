import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

import {Observable, Subscription} from 'rxjs';
import { Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import * as cloneDeep from 'lodash.clonedeep';

import { ViewField, AddToProjectRequest, ChangeJobStatusRequest } from 'libs/models/payfactors-api';
import { Permissions } from 'libs/constants';
import { AsyncStateObj, UserContext } from 'libs/models';
import { PageViewIds } from '../constants';

import * as fromRootState from 'libs/state/state';
import * as fromJobsPageActions from '../actions';
import * as fromJobsPageReducer from '../reducers';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';

@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss']
})

export class JobsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  structureGradeNameOptions: any;
  filteredStructureGradeNameOptions: any;
  permissions = Permissions;
  pageViewId = PageViewIds.Jobs;
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
  customExportDataSubscription: Subscription;

  userContext$: Observable<UserContext>;
  selectedRecordId$: Observable<number>;

  showAddToProjectModal$: Observable<boolean>;
  addingToProject$: Observable<AsyncStateObj<boolean>>;

  showJobStatusModal$: Observable<boolean>;
  changingJobStatus$: Observable<AsyncStateObj<boolean>>;

  showDeleteJobModal$: Observable<boolean>;
  deletingJob$: Observable<AsyncStateObj<boolean>>;
  jobIdToDelete: number;
  jobNameToDelete: string;

  showJobEditModal = false;
  editingJobId: number = null;

  inlineMenuHideBorders = true;

  colTemplates = {};
  filterTemplates = {};
  globalFilterTemplates = {};

  filters = [{
    SourceName: 'JobStatus',
    Operator: '=',
    Value: 'true'
  }];

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyJobs_Job_Title'
  }];

  exportOptions = [{
    Display: 'Download Pricings',
    Name: 'DownloadPricings',
    Description: 'High Level Pricing Details including Pay Markets, Effective Dates',
    Endpoint: 'ExportPricings',
    ValidExtensions: ['xlsx'],
    Custom: false
  }, {
    Display: 'Download Job Report',
    Name: 'DownloadJobReport',
    Description: 'Report including Pricing Details and a breakdown of Pay',
    Endpoint: 'ExportJobReport',
    ValidExtensions: ['xlsx', 'pdf'],
    Custom: false
  }];

  disableExportPopover = true;
  selectedJobPricingCount = 0;

  @ViewChild('jobTitleColumn', { static: false }) jobTitleColumn: ElementRef;
  @ViewChild('jobStatusColumn', { static: false }) jobStatusColumn: ElementRef;
  @ViewChild('hasPeerDataColumn', { static: false }) hasPeerDataColumn: ElementRef;

  @ViewChild('peerFilter', { static: false }) peerFilter: ElementRef;
  @ViewChild('payMarketFilter', { static: false }) payMarketFilter: ElementRef;
  @ViewChild('jobStatusFilter', { static: false }) jobStatusFilter: ElementRef;
  @ViewChild('structureGradeFilter', { static: false }) structureGradeFilter: ElementRef;

  constructor(private store: Store<fromJobsPageReducer.State>) {

    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.selectedRecordId$ = this.store.select(fromPfDataGridReducer.getSelectedRecordId, this.pageViewId);
    this.showAddToProjectModal$ = this.store.select(fromJobsPageReducer.getShowAddToProjectModal);
    this.addingToProject$ = this.store.select(fromJobsPageReducer.getAddingToProject);
    this.showJobStatusModal$ = this.store.select(fromJobsPageReducer.getShowJobStatusModal);
    this.changingJobStatus$ = this.store.select(fromJobsPageReducer.getChangingJobStatus);
    this.showDeleteJobModal$ = this.store.select(fromJobsPageReducer.getShowDeleteJobModal);
    this.deletingJob$ = this.store.select(fromJobsPageReducer.getDeletingJob);

    this.companyPayMarketsSubscription = store.select(fromJobsPageReducer.getCompanyPayMarkets)
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

    this.customExportDataSubscription = this.store.select(fromJobsPageReducer.getCustomExportData).subscribe(exportData => {
      if (exportData && exportData.DisplayText) {
        const exportObj = {
          Display: exportData.DisplayText,
          Name: exportData.ExportName,
          Description: 'Company custom export report',
          Endpoint: 'ExportCustomJobReport',
          ValidExtensions: ['xlsx'],
          Custom: true
        };

        this.exportOptions.push(exportObj);
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(new fromJobsPageActions.SetJobsPageId(this.pageViewId));
    this.store.dispatch(new fromJobsPageActions.LoadCompanyPayMarkets());
    this.store.dispatch(new fromJobsPageActions.LoadStructureGrades());
    this.store.dispatch(new fromJobsPageActions.LoadCustomExports());
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'Job_Title': { Template: this.jobTitleColumn },
      'JobStatus': { Template: this.jobStatusColumn },
      'Exchange_ID': { Template: this.hasPeerDataColumn }
    };

    this.filterTemplates = {
      'PayMarket': { Template: this.payMarketFilter },
      'Grade_Name': { Template: this.structureGradeFilter }
    };

    this.globalFilterTemplates = {
      'JobStatus': { Template: this.jobStatusFilter }
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

  toggleAddToProjectModal(state: boolean) {
    this.store.dispatch(new fromJobsPageActions.ShowAddToProjectModal(state));
  }

  addToProject() {
    const payload: AddToProjectRequest = {
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
    this.store.dispatch(new fromJobsPageActions.AddingToProject(payload));
  }

  toggleJobStatusModal(state: boolean) {
    this.store.dispatch(new fromJobsPageActions.ShowJobStatusModal(state));
  }

  changingJobStatus() {
    const summary: ChangeJobStatusRequest = {
      CompanyJobIds: this.selectedJobIds,
      StatusToSet: this.isActiveJobs() ? 0 : 1
    };

    this.store.dispatch(new fromJobsPageActions.ChangingJobStatus(summary));
  }

  openDeleteJobModal(jobId: number, jobName: string) {
    this.jobIdToDelete = jobId;
    this.jobNameToDelete = jobName;
    this.store.dispatch(new fromJobsPageActions.ShowDeleteJobModal(true));
  }

  closeDeleteJobModal() {
    this.store.dispatch(new fromJobsPageActions.ShowDeleteJobModal(false));
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
    this.customExportDataSubscription.unsubscribe();
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

  closeJobManagmentModal() {
    this.showJobEditModal = false;
    this.editingJobId = null;
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
}
