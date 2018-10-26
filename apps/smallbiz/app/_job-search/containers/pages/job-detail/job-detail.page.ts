import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromJobSearch from '../../../reducers';
import * as fromJobDetailActions from '../../../actions/job-detail.actions';
import * as fromRelatedJobsActions from '../../../../_job-search/actions/related-jobs.actions';

import { Job } from '../../../models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'pf-job-detail',
  templateUrl: './job-detail.page.html',
  styleUrls: ['./job-detail.page.scss']
})
export class JobDetailPageComponent implements OnInit {

  job$: Observable<Job>;
  relatedJobs$: Observable<Job[]>;

  constructor(private store: Store<fromJobSearch.State>, private route: ActivatedRoute, private titleService: Title) {
    this.job$ = store.select(fromJobSearch.selectJob).pipe(
      map((job: Job) => !!job ? job : {} as Job)
    );
    this.job$.subscribe((job: Job) => {
      if (job && job.title) {
        titleService.setTitle(`${job.title} - National Data`);
      }
    });
    this.relatedJobs$ = store.select(fromJobSearch.selectRelatedJobs);
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new fromJobDetailActions.LoadJob({ id }));
    this.store.dispatch(new fromRelatedJobsActions.LoadRelatedJobs({ jobId: id }));
  }

  handleRelatedJobClick(relatedJob: Job) {
    this.store.dispatch(new fromJobDetailActions.LoadJobSuccess({ job: relatedJob }));
    this.store.dispatch(new fromRelatedJobsActions.LoadRelatedJobs({ jobId: relatedJob.id }));

    // we're potentially scrolled deep in the page here, so scroll back up to show newly selected job
    if (window && typeof window.scroll === 'function') {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
  }
}
