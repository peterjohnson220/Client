import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

import { Observable, Subscription, of } from 'rxjs';

import { Store } from '@ngrx/store';

import { SortDescriptor } from '@progress/kendo-data-query';

import { ViewField } from 'libs/models/payfactors-api';
import { Permissions } from 'libs/constants';

import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import {RemoteDataSourceService} from 'libs/core/services';

import * as fromJobsPageActions from '../actions';
import * as fromJobsPageReducer from '../reducers';

import * as cloneDeep from 'lodash.clonedeep';
import {ApiEndpointConstants} from '../constants/api-endpoint.constants';


@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.html'
})

export class JobsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  apiEndpointConstants = ApiEndpointConstants;
  permissions = Permissions;
  pageViewId = '705B7FE1-42AB-4B57-A414-764E52981160';
  selectedKeys: number[];
  peerField: ViewField;
  paymarketField: ViewField;
  selectedPaymarket: any;
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
  gridFieldSubscription: Subscription;
  remoteDataSourceSubscription: Subscription;
  company$: Observable<string>;
  addingToProject$: Observable<boolean>;

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

  constructor(private store: Store<fromJobsPageReducer.State>, private remoteDataSourceService: RemoteDataSourceService) {
    this.remoteDataSourceSubscription =  this.remoteDataSourceService.getDataSource(`${this.apiEndpointConstants.PAY_MARKETS}`).subscribe( s =>
    {
      this.payMarketOptions = s.map(o =>  ({Value: o.Value, Id: o.Value}));
      this.filteredPayMarketOptions = this.payMarketOptions;
    }
    );
    this.company$ = this.store.select(fromJobsPageReducer.getCompany);
    this.addingToProject$ = this.store.select(fromJobsPageReducer.getToProjectButtonState);
    this.selectedKeysSubscription = this.store.select(fromPfGridReducer.getSelectedKeys, this.pageViewId).subscribe(sk => {
      this.selectedKeys = sk;
    });
    this.gridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.peerField = fields.find(f => f.SourceName === 'Exchange_ID');
        this.paymarketField = fields.find(f => f.SourceName === 'PayMarketFilter');
        this.selectedPaymarket = this.paymarketField.FilterValue !== null ?
          {Value : this.paymarketField.FilterValue, Id : this.paymarketField.FilterValue} : null;
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
      'Exchange_ID': {Template: this.hasPeerDataColumn}
    };

    this.filterTemplates = {
      'Exchange_ID': { Template: this.peerFilter },
      'PayMarketFilter': { Template: this.payMarketFilter }
    };
  }

  addJobsToProject() {
    return this.store.dispatch(new fromJobsPageActions.AddJobsToProject(this.selectedKeys));
  }

  getPageTitle(companyName: string) {
    return companyName ? `${companyName} Jobs` : '';
  }

  ngOnDestroy() {
    this.selectedKeysSubscription.unsubscribe();
    this.gridFieldSubscription.unsubscribe();
    this.remoteDataSourceSubscription.unsubscribe();
  }
  closeSplitView() {
    this.store.dispatch(new fromPfGridActions.UpdateSelectedRecordId(this.pageViewId, null, null));
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
    const field = cloneDeep(this.paymarketField);
    field.FilterValue = value.Id;
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
}
