import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ExchangeJobRequest } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeJobRequestsActions from '../../actions/exchange-job-requests.actions';

@Component({
  selector: 'pf-exchange-job-request-info',
  templateUrl: './exchange-job-request-info.component.html',
  styleUrls: [ './exchange-job-request-info.component.scss' ]
})

export class ExchangeJobRequestInfoComponent {
  @Input() selectedJobRequest: ExchangeJobRequest;
  @Output() closeClicked = new EventEmitter();
  @Output() approveClicked = new EventEmitter();

  approvingJobRequest$: Observable<boolean>;
  approvingError$: Observable<boolean>;
  denyingError$: Observable<boolean>;

  constructor(
    private store: Store<fromPeerAdminReducer.State>
  ) {
    this.approvingJobRequest$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeJobRequestApproving));
    this.approvingError$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeJobRequestApprovingError));
    this.denyingError$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeJobRequestDenyingError));
  }

  close() {
    this.closeClicked.emit();
  }

  approve() {
    this.approveClicked.emit(this.selectedJobRequest);
  }

  deny() {
    this.store.dispatch(new fromExchangeJobRequestsActions.OpenJobRequestDenyModal());
  }
}
