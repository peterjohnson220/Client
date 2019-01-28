import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromComphubMainReducer from '../../../reducers';
import * as fromPaymarketsPageActions from '../../../actions/markets-page.actions';
import { PricingPaymarket } from '../../../models';

@Component({
  selector: 'pf-markets-page',
  templateUrl: './markets.page.component.html',
  styleUrls: ['./markets.page.component.scss']
})
export class MarketsPageComponent implements OnInit {
  visiblePaymarkets$: Observable<PricingPaymarket[]>;
  loadingPaymarkets$: Observable<boolean>;
  loadingPaymarketsError$: Observable<boolean>;
  selectedPaymarketId$: Observable<number>;
  paymarkets$: Observable<PricingPaymarket[]>;

  searchTerm: string;

  constructor(
    private store: Store<fromComphubMainReducer.State>
  ) {
    this.visiblePaymarkets$ = this.store.select(fromComphubMainReducer.getVisiblePaymarkets);
    this.paymarkets$ = this.store.select(fromComphubMainReducer.getPaymarkets);
    this.loadingPaymarkets$ = this.store.select(fromComphubMainReducer.getLoadingPaymarkets);
    this.loadingPaymarketsError$ = this.store.select(fromComphubMainReducer.getLoadingPaymarketsError);
    this.selectedPaymarketId$ = this.store.select(fromComphubMainReducer.getSelectedPaymarket);
  }

  ngOnInit() {
    this.store.dispatch(new fromPaymarketsPageActions.GetPaymarkets());
  }

  handleSearchChanged(searchTerm: string) {
    this.store.dispatch(new fromPaymarketsPageActions.SetPaymarketFilter(searchTerm));
  }

  handlePaymarketChecked(checkedPaymarketId: number) {
    this.store.dispatch(new fromPaymarketsPageActions.SetSelectedPaymarket(checkedPaymarketId));
  }

  clearSearchValue() {
    this.searchTerm = '';
    this.handleSearchChanged(this.searchTerm);
  }
}
