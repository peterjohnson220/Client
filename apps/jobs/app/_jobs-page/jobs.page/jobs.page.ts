import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { SortDescriptor } from '@progress/kendo-data-query';

import * as cloneDeep from 'lodash.clonedeep';

import { ViewField } from 'libs/models/payfactors-api';
import { Permissions } from 'libs/constants';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import {RemoteDataSourceService} from 'libs/core/services';

import { PageViewIds } from '../constants';
import { AddToProjectRequest } from '../models';
import * as fromJobsPageActions from '../actions';
import * as fromJobsPageReducer from '../reducers';

@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.html'
})

export class JobsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  permissions = Permissions;
  pageViewIds = PageViewIds;
  pageViewId = this.pageViewIds.JOBS_PAGE;
  selectedJobIds: number[];
  selectedPricingIds: number[];
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
  addingToProject$: Observable<boolean>;
  showAddToProjectSummary$: Observable<boolean>;

  addingNewJob = false;

  colTemplates = {};
  filterTemplates = {};

  @ViewChild('jobStatusColumn', { static: false }) jobStatusColumn: ElementRef;
  @ViewChild('hasPeerDataColumn', { static: false }) hasPeerDataColumn: ElementRef;
  @ViewChild('peerFilter', {static: false}) peerFilter: ElementRef;
  @ViewChild('payMarketFilter', {static: false}) payMarketFilter: ElementRef;

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyJobs_Job_Title'
  }];

  constructor(private store: Store<fromJobsPageReducer.State>) {

    this.company$ = this.store.select(fromJobsPageReducer.getCompany);
    this.addingToProject$ = this.store.select(fromJobsPageReducer.getAddToProjectButtonState);
    this.companyPayMarketsSubscription = store.select(fromJobsPageReducer.getCompanyPayMarkets)
      .subscribe(o => {
        this.filteredPayMarketOptions = o;
        this.payMarketOptions = o;
      });
    this.selectedKeysSubscription = this.store.select(fromPfGridReducer.getSelectedKeys, this.pageViewId).subscribe(sk => {
      this.selectedJobIds = sk || [];
    });
    this.selectedPricingIdSubscription = this.store.select(fromPfGridReducer.getSelectedKeys, this.pageViewIds.PRICING_DETAILS).subscribe(pid => {
      this.selectedPricingIds = pid || [];
    });
    this.gridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.peerField = fields.find(f => f.SourceName === 'Exchange_ID');
        this.payMarketField = fields.find(f => f.SourceName === 'PayMarket');
        this.selectedPayMarket = this.payMarketField.FilterValue !== null ?
          {Value : this.payMarketField.FilterValue, Id : this.payMarketField.FilterValue} : null;
      }
    });
    this.showAddToProjectSummary$ = this.store.select(fromJobsPageReducer.getShowAddToProjectSummaryModal);
  }

  ngOnInit() {
    this.store.dispatch(new fromJobsPageActions.SetJobsPageId(this.pageViewId));
    this.store.dispatch(new fromJobsPageActions.LoadCompany());
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'JobStatus': { Template: this.jobStatusColumn },
      'Exchange_ID': {Template: this.hasPeerDataColumn}
    };

    this.filterTemplates = {
      'Exchange_ID': { Template: this.peerFilter },
      'PayMarket': { Template: this.payMarketFilter }
    };
  }

  showAddToProjectSummary() {
    this.store.dispatch(new fromJobsPageActions.AddToProjectSummary(this.getAddToProjectSummary()));
  }

  addToProject() {
    this.store.dispatch(new fromJobsPageActions.AddToProject(this.getAddToProjectSummary()));
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
    this.store.dispatch(new fromPfGridActions.UpdateSelectedRecordId(this.pageViewId, null, null, null));
  }

  handlePeerFilterChanged(value: any) {
    const field = cloneDeep(this.peerField);
    field.FilterValue = value;
    this.updateField(field);
  }

  splitViewTabChange(tabPageViewId: string) {
    this.store.dispatch(new fromPfGridActions.ClearAllFilters(tabPageViewId));
  }

  handlePayMarketFilterChanged(value: any) {
    const field = cloneDeep(this.payMarketField);
    field.FilterValue = value.Id;
    field.FilterOperator = '=';
    this.updateField(field);
  }

  updateField(field) {
    if (field.FilterValue) {
      this.store.dispatch(new fromPfGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfGridActions.ClearFilter(this.pageViewId, field));
    }
  }

  handleFilter(value) {
    this.filteredPayMarketOptions = this.payMarketOptions.filter((s) => s.Id.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  dismissAddToProjectSummaryModal() {
    this.store.dispatch(new fromJobsPageActions.CancelAddToProjectSummary());
  }

  getAddToProjectSummary(): AddToProjectRequest {
    const summary: AddToProjectRequest = {
      JobIds: this.selectedJobIds,
      PricingIds: this.selectedPricingIds
    };
    return summary;
  }
}
