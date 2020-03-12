import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';

import { AsyncStateObj } from 'libs/models';

import {Provider, TransferMethod, AuthenticationType} from '../../../models';
import * as fromDataManagementMainReducer from '../../../reducers';
import * as fromProviderListActions from '../../../actions/provider-list.actions';

@Component({
  selector: 'pf-inbound-providers',
  templateUrl: './inbound-providers.page.html',
  styleUrls: ['./inbound-providers.page.scss']
})
export class InboundProvidersPageComponent implements OnInit, OnDestroy {
  selectedProvider: Provider;

  providers$: Observable<AsyncStateObj<Provider[]>>;
  transferMethods$: Observable<AsyncStateObj<TransferMethod[]>>;
  selectedProvider$: Observable<Provider>;

  selectedProviderSub: Subscription;

  constructor(
    private store: Store<fromDataManagementMainReducer.State>,
    private router: Router
  ) {
    this.transferMethods$ = this.store.select(fromDataManagementMainReducer.getTransferMethods);
    this.providers$ = this.store.select(fromDataManagementMainReducer.getProviders);
    this.selectedProvider$ = this.store.select(fromDataManagementMainReducer.getSelectedProvider);

    this.selectedProviderSub =
      this.selectedProvider$.subscribe(sp => this.selectedProvider = sp);
  }

  ngOnInit() {
    this.store.dispatch(new fromProviderListActions.InitProviderList());
  }

  ngOnDestroy() {
    this.selectedProviderSub.unsubscribe();
  }

  cancel() {
    this.router.navigate(['/']);
  }

  setSelectedProvider(provider: Provider) {
    this.store.dispatch(new fromProviderListActions.SetSelectedProvider(provider));
  }

  next() {
    this.router.navigate(['transfer-data/inbound/entity-selection']);
  }

  setSelectedTransferMethod(transferMethodId: number) {
    this.store.dispatch(new fromProviderListActions.SetSelectedTransferMethod(transferMethodId));
  }
}
