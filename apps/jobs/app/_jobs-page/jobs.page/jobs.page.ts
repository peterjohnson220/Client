import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import * as fromJobsPageActions from '../actions';
import * as fromJobsPageReducer from '../reducers';

@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.html'
})

export class JobsPageComponent implements OnInit, AfterViewInit {

  company$: Observable<string>;

  @ViewChild('jobStatusColumn', { static: false }) jobStatusColumn: ElementRef;
  colTemplates = {};

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
