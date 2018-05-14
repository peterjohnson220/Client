import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Exchange, ExchangeListItem, ExchangeRequestTypeEnum } from 'libs/models/peer';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';

import * as fromExchangeSelectorActions from '../../actions/exchange-selector.actions';
import * as fromPeerDashboardReducer from '../../reducers';
import * as fromExchangeRequestActions from '../../../shared/actions/exchange-request.actions';
import * as fromSharedPeerReducer from '../../../shared/reducers';

@Component({
  selector: 'pf-exchange-selector',
  templateUrl: './exchange-selector.component.html',
  styleUrls: ['./exchange-selector.component.scss']
})

export class ExchangeSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('p') popover: NgbPopover;

  exchangeListItems$: Observable<ExchangeListItem[]>;
  exchange$: Observable<Exchange>;
  currentExchangeSub: Subscription;
  currentExchange: Exchange;

  constructor(
    private store: Store<fromPeerDashboardReducer.State>,
    private sharedStore: Store<fromSharedPeerReducer.State>,
    private router: Router
  ) {
    this.exchangeListItems$ = this.store.select(fromPeerDashboardReducer.getExchangeSelectorList);
    this.exchange$ = this.store.select(fromSharedPeerReducer.getExchange);
  }

  handleExchangeClicked(exchangeListItem: ExchangeListItem) {
      this.popover.close();
      this.store.dispatch(new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting(
        {
          FeatureArea: 'PeerDashboard',
          SettingName: 'SelectedExchangeId',
          SettingValue: exchangeListItem.ExchangeId.toString()
        }
      ));
      this.router.navigate(['/exchange', exchangeListItem.ExchangeId]);
  }

  openRequestAccessModal(): void {
    this.popover.close();
    this.store.dispatch(new fromExchangeRequestActions.OpenExchangeRequestModal(ExchangeRequestTypeEnum.Access));
  }

  // Lifecycle
  ngOnInit() {
    this.exchangeListItems$.take(1).subscribe(exchanges => {
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
