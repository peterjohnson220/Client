import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ExchangeCompany } from 'libs/models';

import * as fromExchangeCompaniesActions from '../../actions/exchange-companies.actions';
import * as fromPeerAdminReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-companies',
  templateUrl: './exchange-companies.component.html',
  styleUrls: ['./exchange-companies.component.scss']
})
export class ExchangeCompaniesComponent implements OnInit {
  exchangeCompaniesLoading$: Observable<boolean>;
  exchangeCompaniesLoadingError$: Observable<boolean>;
  exchangeCompanies$: Observable<ExchangeCompany[]>;
  exchangeId: number;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute
  ) {
    this.exchangeCompaniesLoading$ = this.store.select(fromPeerAdminReducer.getExchangeCompaniesLoading);
    this.exchangeCompaniesLoadingError$ = this.store.select(fromPeerAdminReducer.getExchangeCompaniesLoadingError);
    this.exchangeCompanies$ = this.store.select(fromPeerAdminReducer.getExchangeCompanies);

    this.exchangeId = this.route.snapshot.params.id;
  }

  // Events
  handleExchangeCompaniesGridReload() {
    this.store.dispatch(new fromExchangeCompaniesActions.LoadingExchangeCompanies(this.exchangeId));
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromExchangeCompaniesActions.LoadingExchangeCompanies(this.exchangeId));
  }
}
