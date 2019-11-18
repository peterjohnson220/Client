import {Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';
import { cloneDeep } from 'lodash';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import * as fromJobsPageActions from '../actions';
import * as fromJobsPageReducer from '../reducers';
import { SortDescriptor } from '@progress/kendo-data-query';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import { Permissions } from 'libs/constants';
import {Subscribable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

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
  @ViewChild('jobStatusColumn', { static: false }) jobStatusColumn: ElementRef;
  colTemplates = {};

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyJobs_Job_Title'
  }];

  constructor(private store: Store<fromJobsPageReducer.State>) {
    this.company$ = this.store.select(fromJobsPageReducer.getCompany);
    this.addingToProject$ = this.store.select(fromJobsPageReducer.getToProjectButtonState);
    this.selectedKeysSubscription = this.store.select(fromPfGridReducer.getSelectedKeys, this.pageViewId).subscribe(sk => {
      this.selectedKeys =  sk;
    });
  }

  ngOnInit() {
    this.store.dispatch(new fromJobsPageActions.LoadCompany());
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'JobStatus': this.jobStatusColumn
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
  }
}
