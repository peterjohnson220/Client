import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

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

  constructor(private store: Store<fromJobDetail.State>, private route: ActivatedRoute, private titleService: Title) {
    this.job$ = store.select(fromJobDetail.selectJob);
    this.job$.subscribe((job: Job) => {
      if (job && job.title) {
        titleService.setTitle(`${job.title} - National Data`);
      }
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new fromJobDetailActions.LoadJob({ id }));
  }
}
