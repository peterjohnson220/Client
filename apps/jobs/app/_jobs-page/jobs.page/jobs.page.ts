import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { SortDescriptor } from '@progress/kendo-data-query';

import * as cloneDeep from 'lodash.clonedeep';

import { ViewField, AddToProjectRequest, ChangeJobStatusRequest } from 'libs/models/payfactors-api';
import { Permissions } from 'libs/constants';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';

import { PageViewIds } from '../constants';
import * as fromJobsPageActions from '../actions';
import * as fromJobsPageReducer from '../reducers';
import { AsyncStateObj } from 'libs/models';

@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.html'
})

export class JobsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  permissions = Permissions;
  pageViewId = PageViewIds.Jobs;
  selectedJobIds: number[];
  selectedPricingIds: number[];

  jobStatusField: ViewField;
  peerField: ViewField;
  payMarketField: ViewField;
  selectedPayMarket: any;

  peerFilterOptions = [{
    display: '',
    value: null
  }, {
    display: 'Yes',
    value: 'Yes'
  }, {
    display: 'No',
    value: 'No'
  }];

  selectedKeysSubscription: Subscription;
  selectedPricingIdSubscription: Subscription;
  gridFieldSubscription: Subscription;
  companyPayMarketsSubscription: Subscription;
  company$: Observable<string>;

  showAddToProjectModal$: Observable<boolean>;
  addingToProject$: Observable<AsyncStateObj<boolean>>;

  showJobStatusModal$: Observable<boolean>;
  changingJobStatus$: Observable<AsyncStateObj<boolean>>;

  addingNewJob = false;

  colTemplates = {};
  filterTemplates = {};
  globalFilterTemplates = {};

  filters = [{
    SourceName: 'JobStatus',
    Operator: '=',
    Value: 'true'
  }];

  @ViewChild('jobStatusColumn', { static: false }) jobStatusColumn: ElementRef;
  @ViewChild('hasPeerDataColumn', { static: false }) hasPeerDataColumn: ElementRef;
  @ViewChild('peerFilter', { static: false }) peerFilter: ElementRef;
  @ViewChild('payMarketFilter', { static: false }) payMarketFilter: ElementRef;
  @ViewChild('jobStatusFilter', { static: false }) jobStatusFilter: ElementRef;

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyJobs_Job_Title'
  }];

  constructor(private store: Store<fromJobsPageReducer.State>) {

    this.company$ = this.store.select(fromJobsPageReducer.getCompany);
    this.showAddToProjectModal$ = this.store.select(fromJobsPageReducer.getShowAddToProjectModal);
    this.addingToProject$ = this.store.select(fromJobsPageReducer.getAddingToProject);
    this.showJobStatusModal$ = this.store.select(fromJobsPageReducer.getShowJobStatusModal);
    this.changingJobStatus$ = this.store.select(fromJobsPageReducer.getChangingJobStatus);

    this.companyPayMarketsSubscription = store.select(fromJobsPageReducer.getCompanyPayMarkets)
      .subscribe(o => {
        this.filteredPayMarketOptions = o;
        this.payMarketOptions = o;
      });
    this.selectedKeysSubscription = this.store.select(fromPfDataGridReducer.getSelectedKeys, this.pageViewId).subscribe(sk => {
      this.selectedJobIds = sk || [];
    });
    this.selectedPricingIdSubscription = this.store.select(fromPfDataGridReducer.getSelectedKeys, PageViewIds.PricingDetails).subscribe(pid => {
      this.selectedPricingIds = pid || [];
    });
    this.gridFieldSubscription = this.store.select(fromPfDataGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.jobStatusField = fields.find(f => f.SourceName === 'JobStatus');
        this.peerField = fields.find(f => f.SourceName === 'Exchange_ID');
        this.payMarketField = fields.find(f => f.SourceName === 'PayMarket');
        this.selectedPayMarket = this.payMarketField.FilterValue !== null ?
          { Value: this.payMarketField.FilterValue, Id: this.payMarketField.FilterValue } : null;
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(new fromJobsPageActions.SetJobsPageId(this.pageViewId));
    this.store.dispatch(new fromJobsPageActions.LoadCompany());
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'JobStatus': { Template: this.jobStatusColumn },
      'Exchange_ID': { Template: this.hasPeerDataColumn }
    };

    this.filterTemplates = {
      'Exchange_ID': { Template: this.peerFilter },
      'PayMarket': { Template: this.payMarketFilter }
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
  }

  toggleAddToProjectModal(state: boolean) {
    this.store.dispatch(new fromJobsPageActions.ShowAddToProjectModal(state));
  }

  addToProject() {
    const payload: AddToProjectRequest = {
      JobIds: this.selectedJobIds,
      PricingIds: this.selectedPricingIds
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

  getPageTitle(companyName: string) {
    return companyName ? `${companyName} Jobs` : '';
  }

  ngOnDestroy() {
    this.selectedKeysSubscription.unsubscribe();
    this.selectedPricingIdSubscription.unsubscribe();
    this.gridFieldSubscription.unsubscribe();
    this.companyPayMarketsSubscription.unsubscribe();
  }

  closeSplitView() {
    this.store.dispatch(new fromPfDataGridActions.UpdateSelectedRecordId(this.pageViewId, null, null, null));
  }

  handlePeerFilterChanged(value: any) {
    const field = cloneDeep(this.peerField);
    field.FilterValue = value;
    this.updateField(field);
  }

  handlePayMarketFilterChanged(value: any) {
    const field = cloneDeep(this.payMarketField);
    field.FilterValue = value.Id;
    field.FilterOperator = '=';
    this.updateField(field);
  }

  handleJobStatusFilterChanged(field: ViewField, value: any) {
    const newField =  {...field};
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

  handleFilter(value) {
    this.filteredPayMarketOptions = this.payMarketOptions.filter((s) => s.Id.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  isActiveJobs() {
    return this.jobStatusField ? this.jobStatusField.FilterValue : false;
  }
}
