import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeAccessRequest } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeAccessRequestsActions from '../../actions/exchange-access-requests.actions';

@Component({
  selector: 'pf-exchange-access-requests',
  templateUrl: './exchange-access-requests.component.html',
  styleUrls: ['./exchange-access-requests.component.scss']
})

export class ExchangeAccessRequestsComponent {
  exchangeAccessRequestsLoading$: Observable<boolean>;
  exchangeAccessRequestsLoadingError$: Observable<boolean>;
  exchangeAccessRequestsGrid$: Observable<GridDataResult>;
  selectedAccessRequest: ExchangeAccessRequest;
  exchangeId: number;
  collapse = false;
  pageRowIndex: number = null;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute
  ) {
    this.exchangeAccessRequestsLoading$ = this.store.select(fromPeerAdminReducer.getExchangeAccessRequestsLoading);
    this.exchangeAccessRequestsLoadingError$ = this.store.select(fromPeerAdminReducer.getExchangeAccessRequestsLoadingError);
    this.exchangeAccessRequestsGrid$ = this.store.select(fromPeerAdminReducer.getExchangeAccessRequestsGrid);

    this.exchangeId = this.route.snapshot.parent.params.id;
  }

  // Events
  handleExchangeAccessRequestsGridReload() {
    this.store.dispatch(new fromExchangeAccessRequestsActions.LoadExchangeAccessRequests(this.exchangeId));
  }

  handleCellClick(event: any) {
    if (!this.collapse) { this.collapse = true; }
    this.selectedAccessRequest = event.dataItem;
    this.pageRowIndex = event.rowIndex;
  }

  handleCloseAccessRequestInfo() {
    this.collapse = false;
    this.pageRowIndex = null;
  }
}
