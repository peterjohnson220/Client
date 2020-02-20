import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs';
import { JobRangeModelingModalPage } from '../../constants/structures.constants';
import { Store } from '@ngrx/store';
import * as fromStructuresReducer from '../../reducers';
import * as fromJobRangeModelingModalActions from '../../actions/job-range-modeling-modal.actions';

@Component({
  selector: 'pf-job-range-modeling-modal',
  templateUrl: './job-range-modeling-modal.component.html',
  styleUrls: ['./job-range-modeling-modal.component.scss']
})
export class JobRangeModelingModalComponent implements OnInit, OnDestroy {
  // Observables
  modalOpen$: Observable<boolean>;
  modalTitle$: Observable<string>;
  currentModalPage$: Observable<JobRangeModelingModalPage>;

  // Subscriptions

  // Local variables
  jobRangeModelingPage = JobRangeModelingModalPage;

  constructor(
    private store: Store<fromStructuresReducer.State>
  ) {
    this.modalTitle$ = this.store.select(fromStructuresReducer.getModalTitle);
    this.currentModalPage$ = this.store.select(fromStructuresReducer.getCurrentModalPage);
    this.modalOpen$ = this.store.select(fromStructuresReducer.getModalOpen);
  }

  ngOnInit() {
  }

  close() {
    this.store.dispatch(new fromJobRangeModelingModalActions.CloseModal());
  }

  ngOnDestroy() {
  }
}
