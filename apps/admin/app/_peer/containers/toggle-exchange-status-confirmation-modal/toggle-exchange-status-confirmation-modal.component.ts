import { Component, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs/index';

import { Exchange, StatusEnum } from 'libs/models';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeActions from '../../actions/exchange.actions';

@Component({
  selector: 'pf-toggle-exchange-status-confirmation-modal',
  templateUrl: './toggle-exchange-status-confirmation-modal.component.html',
  styleUrls: ['./toggle-exchange-status-confirmation-modal.component.scss']
})

export class ToggleExchangeStatusConfirmationModalComponent implements OnInit, OnDestroy {
    exchange$: Observable<Exchange>;
    exchangeStatusConfirmationModalOpen$: Observable<boolean>;
    updatingExchangeStatus$: Observable<boolean>;

    exchangeSubscription: Subscription;

    exchange: Exchange;

    constructor(private store: Store<fromPeerAdminReducer.State>) {
      this.exchange$ = this.store.pipe(select(fromPeerAdminReducer.getManageExchange));
      this.exchangeStatusConfirmationModalOpen$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeStatusConfirmationModalOpen));
      this.updatingExchangeStatus$ = this.store.pipe(select(fromPeerAdminReducer.getManageExchangeUpdating));
    }

    get isActiveExchange(): boolean {
      return this.exchange.Status === StatusEnum.Active;
    }

    get title(): string {
      return this.isActiveExchange ? 'Deactivate Exchange' : 'Activate Exchange';
    }

    get primaryButtonClass(): string {
      return this.isActiveExchange ? 'btn-danger' : 'btn-warning';
    }

    get primaryButtonText(): string {
      return this.isActiveExchange ? 'Deactivate' : 'Activate';
    }

    get primaryButtonTextSubmitting(): string {
      return this.isActiveExchange ? 'Deactivating...' : 'Activating...';
    }

    get activateBodyText(): string {
      return `You are about to activate the <strong>${this.exchange.ExchangeName}</strong> exchange. By doing so, it will be visible and
       available for use by all companies that have been added to the exchange.`;
    }

    get deactivateBodyText(): string {
      return `You are about to deactivate the <strong>${this.exchange.ExchangeName}</strong> exchange. By doing so, it will no longer
        be visible and available for use by any companies that have been added to the exchange.`;
    }

    get bodyText(): string {
      return this.isActiveExchange ? this.deactivateBodyText : this.activateBodyText;
    }

    handleToggleConfirmed() {
      const newStatus = this.isActiveExchange ? StatusEnum.Inactive : StatusEnum.Active;
      this.store.dispatch(new fromExchangeActions.UpdateExchangeStatus(this.exchange.ExchangeId, newStatus));
    }

    handleModalDismissed() {
      this.store.dispatch(new fromExchangeActions.CloseToggleExchangeStatusModal());
    }

    ngOnInit(): void {
      this.exchangeSubscription = this.exchange$.subscribe(e => {
        this.exchange = e;
      });
    }

    ngOnDestroy(): void {
      this.exchangeSubscription.unsubscribe();
    }
}
