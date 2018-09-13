import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ExchangeJobRequest } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-job-request-info',
  templateUrl: './exchange-job-request-info.component.html',
  styleUrls: [ './exchange-job-request-info.component.scss' ]
})

export class ExchangeJobRequestInfoComponent {
  @Input() selectedJobRequest: ExchangeJobRequest;
  @Output() closeClicked = new EventEmitter();
  @Output() approveClicked = new EventEmitter();
  @Output() denyClicked = new EventEmitter();

  approvingJobRequest$: Observable<boolean>;
  denyingJobRequest$: Observable<boolean>;
  approvingError$: Observable<boolean>;
  denyingError$: Observable<boolean>;

  constructor(
    private store: Store<fromPeerAdminReducer.State>
  ) {
    this.approvingJobRequest$ = this.store.select(fromPeerAdminReducer.getExchangeJobRequestApproving);
    this.denyingJobRequest$ = this.store.select(fromPeerAdminReducer.getExchangeJobRequestDenying);
    this.approvingError$ = this.store.select(fromPeerAdminReducer.getExchangeJobRequestApprovingError);
    this.denyingError$ = this.store.select(fromPeerAdminReducer.getExchangeJobRequestDenyingError);
  }

  close() {
    this.closeClicked.emit();
  }

  approve() {
    this.approveClicked.emit(this.selectedJobRequest);
  }

  deny() {
    this.denyClicked.emit(this.selectedJobRequest);
  }
}
