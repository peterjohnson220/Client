import {  Component } from '@angular/core';
import { Observable } from 'rxjs/index';
import { Store } from '@ngrx/store';

import * as fromAddDataReducer from '../../reducers';
import { JobToPrice, ProjectSearchContext } from '../../models';
import * as fromJobsToPriceActions from '../../actions/jobs-to-price.actions';



@Component({
  selector: 'pf-jobs-to-price',
  templateUrl: './jobs-to-price.component.html',
  styleUrls: ['./jobs-to-price.component.scss']
})
export class JobsToPriceComponent {
  // Observables
  jobsToPrice$: Observable<JobToPrice[]>;
  searchContext$: Observable<ProjectSearchContext>;
  loadingJobs$: Observable<boolean>;
  error$: Observable<boolean>;
  spinnerType = 'GIF';
  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.jobsToPrice$ = this.store.select(fromAddDataReducer.getJobsToPrice);
    this.loadingJobs$ = this.store.select(fromAddDataReducer.getLoadingJobsToPrice);
    this.error$ = this.store.select(fromAddDataReducer.getLoadingJobsToPriceError);
    this.searchContext$ = this.store.select(fromAddDataReducer.getProjectSearchContext);
  }

  trackByJobId(index, item: JobToPrice) {
    return item.Id;
  }

  handleLoadDataCuts(job: JobToPrice): void {
    if (!job.TotalDataCuts || this.dataCutsLoaded(job)) {
      return;
    }
    this.store.dispatch(new fromJobsToPriceActions.GetMatchJobCuts(job));
  }

  private dataCutsLoaded(job: JobToPrice): boolean {
    return job.DataCuts && job.DataCuts.length > 0;
  }
}

