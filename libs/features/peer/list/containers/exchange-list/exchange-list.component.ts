import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RowClassArgs } from '@progress/kendo-angular-grid';

import { ExchangeListItem } from '../../../../../models/peer';
import * as fromSharedPeerReducer from '../../reducers';
import * as fromExchangeListActions from '../../actions/exchange-list.actions';

@Component({
  selector: 'pf-exchange-list',
  templateUrl: './exchange-list.component.html',
  styleUrls: ['./exchange-list.component.scss']
})
export class ExchangeListComponent implements OnInit {
  exchangeListLoading$: Observable<boolean>;
  exchangeListLoadingError$: Observable<boolean>;
  exchangeListItems$: Observable<ExchangeListItem[]>;

  @Output() onCellClick = new EventEmitter();

  constructor(private store: Store<fromSharedPeerReducer.State>) {
    this.exchangeListLoading$ = this.store.select(fromSharedPeerReducer.getExchangeListLoading);
    this.exchangeListLoadingError$ = this.store.select(fromSharedPeerReducer.getExchangeListLoadingError);
    this.exchangeListItems$ = this.store.select(fromSharedPeerReducer.getExchangeListItems);
  }

  // Events
  handleExchangeGridReload() {
    this.store.dispatch(new fromExchangeListActions.LoadingExchanges());
  }

  handleCellClick(cellClickEvent: any): void {
    if (cellClickEvent.dataItem.PendingAccess) {
      return;
    }

    const exchangeId = cellClickEvent.dataItem.ExchangeId;
    this.onCellClick.emit(exchangeId);
  }

  rowClass(context: RowClassArgs): string {
    return context.dataItem.PendingAccess ? 'row-disabled' : '';
  }

  // Lifecycle events
  ngOnInit(): void {
    this.store.dispatch(new fromExchangeListActions.LoadingExchanges());
  }
}
