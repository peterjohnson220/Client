import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  GridTypeEnum,
  Exchange,
  ExchangeListItem,
  ExchangeRequestTypeEnum,
  FeatureAreaConstants,
  UiPersistenceSettingConstants,
  StatusEnum
} from 'libs/models';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromExchangeSelectorActions from '../../actions/exchange-selector.actions';
import * as fromExchangeRequestActions from '../../actions/exchange-request.actions';
import * as fromSharedPeerReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-switcher',
  templateUrl: './exchange-switcher.component.html',
  styleUrls: ['./exchange-switcher.component.scss'],
  preserveWhitespaces: true
})

export class ExchangeSwitcherComponent implements OnInit, OnDestroy {
  @ViewChild('p', { static: true }) popover: NgbPopover;

  exchangeListItems$: Observable<ExchangeListItem[]>;
  exchange$: Observable<Exchange>;
  currentExchangeSub: Subscription;
  currentExchange: Exchange;
  showRequestAccessButton = false;

  constructor(
    private store: Store<fromSharedPeerReducer.State>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.exchangeListItems$ = this.store.pipe(select(fromSharedPeerReducer.getExchangeSelectorList));
    this.exchange$ = this.store.pipe(select(fromSharedPeerReducer.getExchange));
  }

  isInactive(exchangeListItem: ExchangeListItem): boolean {
    return exchangeListItem.Status === StatusEnum.Inactive;
  }

  isPreliminary(exchangeListItem: ExchangeListItem): boolean {
    return exchangeListItem.Status === StatusEnum.Preliminary;
  }

  handleExchangeClicked(exchangeListItem: ExchangeListItem) {
    this.popover.close();

    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeJobComparison));

    this.store.dispatch(new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting(
      {
        FeatureArea: FeatureAreaConstants.PeerDashboard,
        SettingName: UiPersistenceSettingConstants.SelectedExchangeId,
        SettingValue: exchangeListItem.ExchangeId.toString()
      }
    ));

    this.router.navigate(['/exchange', exchangeListItem.ExchangeId, this.route.parent.snapshot.url[0].path]);
  }

  openRequestAccessModal(): void {
    this.popover.close();
    this.store.dispatch(new fromExchangeRequestActions.OpenExchangeRequestModal(ExchangeRequestTypeEnum.Access));
  }

  // Lifecycle
  ngOnInit() {
    this.exchangeListItems$.pipe(take(1)).subscribe(exchanges => {
      if (!exchanges.length) {
        this.store.dispatch(new fromExchangeSelectorActions.LoadExchanges());
      }
    });

    this.currentExchangeSub = this.exchange$.subscribe(e => this.currentExchange = e);
  }

  ngOnDestroy() {
    this.currentExchangeSub.unsubscribe();
  }

}
