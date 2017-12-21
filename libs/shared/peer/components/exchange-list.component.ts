import {
  Component, EventEmitter, OnDestroy, OnInit, Output
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ExchangeListItem } from '../../../models/peer';
import * as fromSharedPeerReducer from '../../peer/reducers';
import { Store } from '@ngrx/store';
import * as fromExchangeListActions from '../actions';

@Component({
  selector: 'pf-exchange-list',
  templateUrl: './exchange-list.component.html',
  styleUrls: ['./exchange-list.component.scss']
})
export class ExchangeListComponent implements OnInit, OnDestroy {
  exchangeListLoading$: Observable<boolean>;
  exchangeListLoadingError$: Observable<boolean>;
  exchangeListItems$: Observable<ExchangeListItem[]>;

  @Output() onCellClick = new EventEmitter();

  constructor(
    private store: Store<fromSharedPeerReducer.State>
  ) {
    this.exchangeListLoading$ = this.store.select(fromSharedPeerReducer.getExchangeListLoading);
    this.exchangeListLoadingError$ = this.store.select(fromSharedPeerReducer.getExchangeListLoadingError);
    this.exchangeListItems$ = this.store.select(fromSharedPeerReducer.getExchangeListItems);
  }

  // Events
  handleExchangeGridReload() {
    this.store.dispatch(new fromExchangeListActions.LoadingExchanges());
  }

  handleCellClick(cellClickEvent: any): void {
    const exchangeId = cellClickEvent.dataItem.ExchangeId;
    this.onCellClick.emit(exchangeId);
  }

  // Lifecycle events
  ngOnInit(): void {
    this.store.dispatch(new fromExchangeListActions.LoadingExchanges());
  }

  ngOnDestroy(): void {
  }
}
