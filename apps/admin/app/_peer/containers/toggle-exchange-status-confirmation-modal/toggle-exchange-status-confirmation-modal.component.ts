import { Component, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

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
    selectedExchangeStatus$: Observable<StatusEnum>;

    exchangeSubscription: Subscription;
    selectedExchangeStatusSubscription: Subscription;

    exchange: Exchange;
    selectedExchangeStatus: StatusEnum;


    constructor(private store: Store<fromPeerAdminReducer.State>) {
      this.exchange$ = this.store.pipe(select(fromPeerAdminReducer.getManageExchange));
      this.exchangeStatusConfirmationModalOpen$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeStatusConfirmationModalOpen));
      this.updatingExchangeStatus$ = this.store.pipe(select(fromPeerAdminReducer.getManageExchangeUpdating));
      this.selectedExchangeStatus$ = this.store.pipe(select(fromPeerAdminReducer.getSelectedExchangeStatus));
    }

    get isActiveExchange(): boolean {
      return this.exchange.Status === StatusEnum.Active;
    }

    get title(): string {

      switch (this.selectedExchangeStatus) {
        case StatusEnum.Active:
          return 'Activate Exchange';
        case StatusEnum.Inactive:
          return 'Deactivate Exchange';
        case StatusEnum.Preliminary:
          return 'Update Status to Preliminary';
        default:
          return 'Change Exchange Status';
      }
    }

    get primaryButtonClass(): string {
      return this.isActiveExchange ? 'btn-danger' : 'btn-warning';
    }

    get primaryButtonText(): string {

      switch (this.selectedExchangeStatus) {
        case StatusEnum.Active:
          return 'Activate';
        case StatusEnum.Inactive:
          return 'Deactivate';
        case StatusEnum.Preliminary:
          return 'Update';
      }
    }

    get primaryButtonTextSubmitting(): string {
      switch (this.selectedExchangeStatus) {
        case StatusEnum.Active:
          return 'Activating';
        case StatusEnum.Inactive:
          return 'Deactivating';
        case StatusEnum.Preliminary:
          return 'Updating';
      }
    }

    get activateBodyText(): string {
      return `You are about to activate the <strong>${this.exchange.ExchangeName}</strong> exchange. By doing so, it will be visible and
       available for use by all companies that have been added to the exchange.`;
    }

    get deactivateBodyText(): string {
      return `You are about to deactivate the <strong>${this.exchange.ExchangeName}</strong> exchange. By doing so, it will no longer
        be visible and available for use by any companies that have been added to the exchange.`;
    }

    get initiateBodyText(): string {
      return `You are about to update the <strong>${this.exchange.ExchangeName}</strong> exchange to <strong> Preliminary Status </strong>.
        By doing so, companies in this exchange will be limited to only matching jobs and creating scopes.`;
    }

    get bodyText(): string {
      switch (this.selectedExchangeStatus) {
        case StatusEnum.Active:
          return this.activateBodyText;
        case StatusEnum.Inactive:
          return this.deactivateBodyText;
        case StatusEnum.Preliminary:
          return this.initiateBodyText;
      }
    }

    handleToggleConfirmed() {
      this.store.dispatch(new fromExchangeActions.UpdateExchangeStatus(this.exchange.ExchangeId, this.selectedExchangeStatus));
    }

    handleModalDismissed() {
      this.store.dispatch(new fromExchangeActions.CloseToggleExchangeStatusModal());
    }

    ngOnInit(): void {
      this.exchangeSubscription = this.exchange$.subscribe(e => {
        this.exchange = e;
      });

      this.selectedExchangeStatusSubscription = this.selectedExchangeStatus$.subscribe( s => this.selectedExchangeStatus = s);
    }

    ngOnDestroy(): void {
      this.exchangeSubscription.unsubscribe();
      this.selectedExchangeStatusSubscription.unsubscribe();
    }
}
