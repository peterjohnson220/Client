import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RowClassArgs } from '@progress/kendo-angular-grid';

import { ExchangeListItem } from 'libs/models/peer/index';

import * as fromPeerAdminReducer from '../../reducers';
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
  selectedExchange: ExchangeListItem;

  @Input() searchHighlight = '';
  @Output() onCellClick = new EventEmitter();

  constructor(private store: Store<fromPeerAdminReducer.State>) {
    this.exchangeListLoading$ = this.store.select(fromPeerAdminReducer.getExchangeListLoading);
    this.exchangeListLoadingError$ = this.store.select(fromPeerAdminReducer.getExchangeListLoadingError);
    this.exchangeListItems$ = this.store.select(fromPeerAdminReducer.getExchangeListItems);
  }

  // Events
  handleExchangeGridReload() {
    this.store.dispatch(new fromExchangeListActions.LoadExchanges(''));
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

  openDeleteExchangeModal(buttonClickEvent: any, exchange: ExchangeListItem): void {
    buttonClickEvent.stopPropagation();
    this.selectedExchange = exchange;
    this.store.dispatch(new fromExchangeListActions.OpenDeleteExchangeModal());
  }

  // Lifecycle events
  ngOnInit(): void {
    this.store.dispatch(new fromExchangeListActions.LoadExchanges(''));
  }
}
