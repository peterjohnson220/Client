import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromPendingExchangeAccessRequestsActions from '../../actions/pending-exchange-access-requests.actions';

@Component({
  selector: 'pf-pending-exchange-access-requests',
  templateUrl: './pending-exchange-access-requests.component.html',
  styleUrls: ['./pending-exchange-access-requests.component.scss']
})

export class PendingExchangeAccessRequestsComponent {
  pendingExchangeAccessRequestsLoading$: Observable<boolean>;
  pendingExchangeAccessRequestsLoadingError$: Observable<boolean>;
  pendingExchangeAccessRequestsGrid$: Observable<GridDataResult>;
  exchangeId: number;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute
  ) {
    this.pendingExchangeAccessRequestsLoading$ = this.store.select(fromPeerAdminReducer.getPendingExchangeAccessRequestsLoading);
    this.pendingExchangeAccessRequestsLoadingError$ = this.store.select(fromPeerAdminReducer.getPendingExchangeAccessRequestsLoadingError);
    this.pendingExchangeAccessRequestsGrid$ = this.store.select(fromPeerAdminReducer.getPendingExchangeAccessRequestsGrid);

    this.exchangeId = this.route.snapshot.parent.params.id;
  }

  // Events
  handlePendingExchangeAccessRequestsGridReload() {
    this.store.dispatch(new fromPendingExchangeAccessRequestsActions.LoadPendingExchangeAccessRequests(this.exchangeId));
  }
}
