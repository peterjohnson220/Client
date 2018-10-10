import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromAddDataReducer from '../../reducers';
import {JobResult, JobToPrice} from '../../models';
import { Observable } from 'rxjs/index';


@Component({
  selector: 'pf-jobs-to-price',
  templateUrl: './jobs-to-price.component.html',
  styleUrls: ['./jobs-to-price.component.scss']
})
export class JobsToPriceComponent {
  // Observables
  jobsToPrice$: Observable<JobToPrice[]>;
  loadingJobs$: Observable<boolean>;
  error$: Observable<boolean>;
  spinnerType = 'GIF';
  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.jobsToPrice$ = this.store.select(fromAddDataReducer.getJobsToPrice);
    this.loadingJobs$ = this.store.select(fromAddDataReducer.getLoadingJobsToPrice);
    this.error$ = this.store.select(fromAddDataReducer.getLoadingJobsToPriceError);
  }

  trackByJobId(index, item: JobToPrice) {
    return item.Id;
  }
}

