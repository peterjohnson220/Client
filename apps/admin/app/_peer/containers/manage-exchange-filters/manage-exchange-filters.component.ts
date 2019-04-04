import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { Exchange, ExchangeSearchFilterAggregate } from 'libs/models/peer';

import { GridHelperService } from '../../services';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeFiltersActions from '../../actions/exchange-filters.actions';

@Component({
  selector: 'pf-manage-exchange-filters',
  templateUrl: './manage-exchange-filters.component.html',
  styleUrls: ['./manage-exchange-filters.component.scss']
})

export class ManageExchangeFiltersComponent {
  exchange$: Observable<Exchange>;
  exchangeFiltersLoading$: Observable<boolean>;
  exchangeFiltersLoadingError$: Observable<boolean>;
  exchangeFiltersGrid$: Observable<GridDataResult>;
  exchangeId: number;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute,
    private gridHelperService: GridHelperService
  ) {
    this.exchange$ = this.store.pipe(select(fromPeerAdminReducer.getManageExchange));
    this.exchangeFiltersLoading$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeFiltersLoading));
    this.exchangeFiltersLoadingError$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeFiltersLoadingError));
    this.exchangeFiltersGrid$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeFiltersGrid));

    this.exchangeId = this.route.snapshot.parent.params.id;
  }

  // Events
  handleExchangeFiltersGridReload() {
    this.store.dispatch(new fromExchangeFiltersActions.LoadExchangeFilters({
      exchangeId: this.exchangeId,
      searchString: ''
    }));
  }

  handleSwitchToggled(exchangeFilter: ExchangeSearchFilterAggregate) {
    this.store.dispatch(new fromExchangeFiltersActions.PutFilter(exchangeFilter));
  }

  handleSearchChanged(query: string): void {
    this.gridHelperService.loadExchangeFilters(this.exchangeId, query);
  }
}
