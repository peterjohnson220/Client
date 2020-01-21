import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

import { Observable, Subscription, of } from 'rxjs';

import { Store } from '@ngrx/store';

import { SortDescriptor } from '@progress/kendo-data-query';

import { ViewField } from 'libs/models/payfactors-api';
import { Permissions } from 'libs/constants';

import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';

import * as fromJobsPageActions from '../actions';
import * as fromJobsPageReducer from '../reducers';

@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.html'
})

export class JobsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  permissions = Permissions;
  pageViewId = '705B7FE1-42AB-4B57-A414-764E52981160';
  selectedKeys: number[];

  selectedKeysSubscription: Subscription;

  company$: Observable<string>;
  addingToProject$: Observable<boolean>;

  addingNewJob = false;

  colTemplates = {};

  @ViewChild('jobStatusColumn', { static: false }) jobStatusColumn: ElementRef;

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyJobs_Job_Title'
  }];

  constructor(private store: Store<fromJobsPageReducer.State>) {
    this.company$ = this.store.select(fromJobsPageReducer.getCompany);
    this.addingToProject$ = this.store.select(fromJobsPageReducer.getToProjectButtonState);
    this.selectedKeysSubscription = this.store.select(fromPfGridReducer.getSelectedKeys, this.pageViewId).subscribe(sk => {
      this.selectedKeys = sk;
    });
  }

  ngOnInit() {
    this.store.dispatch(new fromJobsPageActions.SetJobsPageId(this.pageViewId));
    this.store.dispatch(new fromJobsPageActions.LoadCompany());
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'JobStatus': { Template: this.jobStatusColumn }
    };
  }

  ngOnDestroy() {
    this.selectedKeysSubscription.unsubscribe();
  }

  addJobsToProject() {
    return this.store.dispatch(new fromJobsPageActions.AddJobsToProject(this.selectedKeys));
  }

  getPageTitle(companyName: string) {
    return companyName ? `${companyName} Jobs` : '';
  }

  closeSplitView() {
    this.store.dispatch(new fromPfGridActions.UpdateSelectedRecordId(this.pageViewId, null, null));
  }
}
