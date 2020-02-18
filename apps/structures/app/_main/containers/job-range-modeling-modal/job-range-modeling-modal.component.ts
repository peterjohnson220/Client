import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromAddJobsModalActions from 'libs/features/add-jobs/actions/modal.actions';
import * as fromAddJobsReducer from 'libs/features/add-jobs/reducers';

import { JobBasedRangeAddJobsModalPages } from '../../../_new/job-based-range/constants/add-jobs-modal.constants';

@Component({
  selector: 'pf-job-range-modeling-modal',
  templateUrl: './job-range-modeling-modal.component.html',
  styleUrls: ['./job-range-modeling-modal.component.scss']
})
export class JobRangeModelingModalComponent implements OnInit, OnDestroy {
  // Observables
  modalOpen$: Observable<boolean>;
  modalTitle$: Observable<string>;
  currentModalPage$: Observable<string>;

  // Subscriptions

  // Local variables
  jobRangeModelingPage = JobBasedRangeAddJobsModalPages;

  constructor(
    private store: Store<fromAddJobsReducer.State>
  ) {
    this.modalTitle$ = this.store.select(fromAddJobsReducer.getModalTitle);
    this.currentModalPage$ = this.store.select(fromAddJobsReducer.getCurrentModalPage);
    this.modalOpen$ = this.store.select(fromAddJobsReducer.getAddJobsModalIsOpen);
  }

  ngOnInit() {
  }

  close() {
    this.store.dispatch(new fromAddJobsModalActions.CloseAddJobsModal());
  }

  ngOnDestroy() {
  }
}
