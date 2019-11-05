import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import * as fromJobsPageActions from '../actions';
import * as fromJobsPageReducer from '../reducers';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.html'
})

export class JobsPageComponent implements OnInit, AfterViewInit {

  company$: Observable<string>;

  @ViewChild('jobStatusColumn', { static: false }) jobStatusColumn: ElementRef;
  colTemplates = {};

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyJobs_Job_Title'
  }];

  constructor(private store: Store<fromJobsPageReducer.State>) {
    this.company$ = this.store.select(fromJobsPageReducer.getCompany);
  }

  ngOnInit() {
    this.store.dispatch(new fromJobsPageActions.LoadCompany());
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'JobStatus': this.jobStatusColumn
    };
  }

  getPageTitle(companyName: string) {
    return companyName ? `${companyName} Jobs` : '';
  }
}
