import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { SortDescriptor } from '@progress/kendo-data-query';

import * as cloneDeep from 'lodash.clonedeep';

import { ViewField } from 'libs/models/payfactors-api';
import { Permissions } from 'libs/constants';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';

import { PageViewIds } from '../constants';
import { AddToProjectRequest } from '../models';
import * as fromJobsPageActions from '../actions';
import * as fromJobsPageReducer from '../reducers';

@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.html'
})

export class JobsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  permissions = Permissions;
  pageViewIds = PageViewIds;
  pageViewId = this.pageViewIds.JOBS_PAGE;
  selectedJobIds: number[];
  selectedPricingIds: number[];
  peerField: ViewField;
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

  company$: Observable<string>;
  addingToProject$: Observable<boolean>;
  showAddToProjectSummary$: Observable<boolean>;

  addingNewJob = false;

  colTemplates = {};
  filterTemplates = {};

  @ViewChild('jobStatusColumn', { static: false }) jobStatusColumn: ElementRef;
  @ViewChild('hasPeerDataColumn', { static: false }) hasPeerDataColumn: ElementRef;
  @ViewChild('peerFilter', {static: false}) peerFilter: ElementRef;

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyJobs_Job_Title'
  }];

  constructor(private store: Store<fromJobsPageReducer.State>) {
    this.company$ = this.store.select(fromJobsPageReducer.getCompany);
    this.addingToProject$ = this.store.select(fromJobsPageReducer.getAddToProjectButtonState);
    this.selectedKeysSubscription = this.store.select(fromPfGridReducer.getSelectedKeys, this.pageViewId).subscribe(sk => {
      this.selectedJobIds = sk || [];
    });
    this.selectedPricingIdSubscription = this.store.select(fromPfGridReducer.getSelectedKeys, this.pageViewIds.PRICING_DETAILS).subscribe(pid => {
      this.selectedPricingIds = pid || [];
    });
    this.gridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.peerField = fields.find(f => f.SourceName === 'Exchange_ID');
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
      'Peer': { Template: this.peerFilter }
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
  }

  closeSplitView() {
    this.store.dispatch(new fromPfGridActions.UpdateSelectedRecordId(this.pageViewId, null, null));
  }

  handlePeerFilterChanged(value: any) {
    const field = cloneDeep(this.peerField);
    field.FilterValue = value;

    if (field.FilterValue) {
      this.store.dispatch(new fromPfGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfGridActions.ClearFilter(this.pageViewId, field));
    }
  }

  splitViewTabChange(tabPageViewId: string) {
    this.store.dispatch(new fromPfGridActions.ClearAllFilters(tabPageViewId));
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
