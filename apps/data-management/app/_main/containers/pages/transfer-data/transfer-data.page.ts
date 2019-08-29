import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromTransferDataPageActions from '../../../actions/transfer-data-page.actions';
import * as fromDataManagementMainReducer from '../../../reducers';

import { TransferMethod, Provider } from '../../../models';

@Component({
  selector: 'pf-transfer-data-page',
  templateUrl: './transfer-data.page.html',
  styleUrls: ['./transfer-data.page.scss']
})
export class TransferDataPageComponent implements OnInit, OnDestroy {

  providers: Provider[];
  transferMethods: TransferMethod[];
  selectedProvider: number;

  providers$: Observable<Provider[]>;
  transferMethods$: Observable<TransferMethod[]>;
  selectedProvider$: Observable<number>;
  transferDataPageLoading$: Observable<boolean>;
  transferDataPageLoadingError$: Observable<boolean>;

  providersSub: Subscription;
  transferMethodsSub: Subscription;
  selectedProviderSub: Subscription;

  constructor(private store: Store<fromDataManagementMainReducer.State>) {
    this.transferMethods$ = this.store.select(fromDataManagementMainReducer.getTransferMethods);
    this.providers$ = this.store.select(fromDataManagementMainReducer.getProviders);
    this.selectedProvider$ = this.store.select(fromDataManagementMainReducer.getSelectedProvider);

    this.transferDataPageLoading$ = this.store.select(fromDataManagementMainReducer.getTransferDataPageLoading);
    this.transferDataPageLoadingError$ = this.store.select(fromDataManagementMainReducer.getTransferDataPageLoadingError);
  }

  ngOnInit() {
    this.transferMethodsSub =
      this.transferMethods$.subscribe(tms => this.transferMethods = tms);
    this.providersSub =
      this.providers$.subscribe(p => this.providers = p);
    this.selectedProviderSub =
      this.selectedProvider$.subscribe(sp => this.selectedProvider = sp);

    this.store.dispatch(new fromTransferDataPageActions.Init());
  }

  ngOnDestroy() {
    this.transferMethodsSub.unsubscribe();
    this.providersSub.unsubscribe();
    this.selectedProviderSub.unsubscribe();
  }

  cancelTransferDataWorkflow() {
    this.store.dispatch(new fromTransferDataPageActions.ResetTransferDataPageWorkflow());
  }

  setSelectedTransferMethod(transferMethodId: number) {
    this.store.dispatch(new fromTransferDataPageActions.SetSelectedTransferMethod(transferMethodId));
  }

  setSelectedProvider(provider: Provider) {
    this.store.dispatch(new fromTransferDataPageActions.SetSelectedProvider(provider.ProviderId));
  }
}
