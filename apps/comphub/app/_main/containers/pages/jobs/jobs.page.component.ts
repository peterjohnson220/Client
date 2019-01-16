import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromJobsPageActions from '../../../actions/jobs-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { TrendingJob } from '../../../models/trending-job.model';

@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.component.html',
  styleUrls: ['./jobs.page.component.scss']
})
export class JobsPageComponent implements OnInit {
  trendingJobs$: Observable<TrendingJob[]>;

  constructor(
    private store: Store<fromComphubMainReducer.State>
  ) {
    this.trendingJobs$ = this.store.select(fromComphubMainReducer.getTrendingJobs);
  }

  ngOnInit() {
    this.store.dispatch(new fromJobsPageActions.GetTrendingJobs());
  }
}
