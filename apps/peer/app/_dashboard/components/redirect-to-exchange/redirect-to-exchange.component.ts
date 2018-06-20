import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap, take, filter } from 'rxjs/operators';

import { ExchangeListItem } from 'libs/models/peer';
import { UiPersistenceSettingsApiService } from 'libs/data/payfactors-api';

import * as fromExchangeSelectorActions from '../../actions/exchange-selector.actions';
import * as fromPeerDashboardReducer from '../../reducers';
import { ExchangesAndLastVisted } from '../../models';

@Component({
  selector: 'pf-redirect-to-exchange',
  templateUrl: './redirect-to-exchange.component.html'
})
export class RedirectToExchangeComponent implements OnInit {
  constructor(
    private router: Router,
    private store: Store<fromPeerDashboardReducer.State>,
    private uiPersistenceSettingsApiService: UiPersistenceSettingsApiService
  ) {}

  ngOnInit() {
    this.redirectToExchange();
  }

  redirectToExchange() {
      // Always get all exchanges
      this.store.dispatch(new fromExchangeSelectorActions.LoadExchanges());

      // Subscribe to the exchange list from the store.
      this.getExchangeSelectorListLoaded().pipe(
        switchMap(() => forkJoin(this.getExchangeSelectorList(), this.getLastExchangeIdVisited())),
        map((exchangesAndLastVisted) => this.navigateToExchange({
          Exchanges: exchangesAndLastVisted[0],
          LastVisitedExchangeId: exchangesAndLastVisted[1]
        })))
        .subscribe();
  }

  getExchangeSelectorListLoaded(): Observable<boolean> {
    return this.store.select(fromPeerDashboardReducer.getExchangeSelectorListLoaded).pipe(
      filter(l => !!l),
      take(1)
    );
  }

  getExchangeSelectorList(): Observable<ExchangeListItem[]> {
    return this.store.select(fromPeerDashboardReducer.getExchangeSelectorList).pipe(
      take(1)
    );
  }

  getLastExchangeIdVisited(): Observable<any> {
    return this.uiPersistenceSettingsApiService.getUiPersistenceSetting('PeerDashboard', 'SelectedExchangeId');
  }

  navigateToExchange(exchangesAndLastVisted: ExchangesAndLastVisted): void {
    const exchanges = exchangesAndLastVisted.Exchanges;
    let lastVistedExchangeId = exchangesAndLastVisted.LastVisitedExchangeId;

    if (!exchanges || !exchanges.length) {
      this.router.navigate(['exchanges/no-exchanges']);
      return;
    }

    let exchangeIdToNavigateTo = exchanges[0].ExchangeId;
    lastVistedExchangeId = Number(lastVistedExchangeId);

    if (lastVistedExchangeId && exchanges.some(e => e.ExchangeId === lastVistedExchangeId)) {
      exchangeIdToNavigateTo = lastVistedExchangeId;
    }

    this.router.navigate(['/exchange', exchangeIdToNavigateTo]);
  }
}
