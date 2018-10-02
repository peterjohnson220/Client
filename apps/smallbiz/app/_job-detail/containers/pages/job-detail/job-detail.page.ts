import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Observable, fromEventPattern } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../../../shared/state';
import * as fromJobDetail from '../../../reducers';
import * as fromJobDetailActions from '../../../actions/job-detail.actions';
import { Job } from '../../../../shared/models/job';

@Component({
  selector: 'pf-job-detail',
  templateUrl: './job-detail.page.html',
  styleUrls: ['./job-detail.page.scss']
})
export class JobDetailPageComponent implements OnInit {

  job$: Observable<Job>;

  constructor(private store: Store<fromRoot.AppState>, private route: ActivatedRoute, private titleService: Title) {
    this.job$ = store.select(fromJobDetail.selectJob);
    this.job$.subscribe((job: Job) => {
      if (job) {
        titleService.setTitle(`${job.title} - National Data`);
      }
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new fromJobDetailActions.LoadJob({ id }));
  }
}
