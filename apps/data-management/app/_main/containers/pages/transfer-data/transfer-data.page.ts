import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as cloneDeep from 'lodash.clonedeep';

import * as fromTransferDataPageActions from '../../../actions/transfer-data-page.actions';
import * as fromDataManagementMainReducer from '../../../reducers';
import { TransferDataWorkflowStep } from '../../../data';
import { AuthenticationType, Provider, TransferMethod, EntityChoice } from '../../../models';


@Component({
  selector: 'pf-transfer-data-page',
  templateUrl: './transfer-data.page.html',
  styleUrls: ['./transfer-data.page.scss']
})
export class TransferDataPageComponent implements OnInit, OnDestroy {

  transferMethods: TransferMethod[];
  selectedProvider: Provider;
  authenticationType: AuthenticationType;
  providerSupportedEntities: EntityChoice[];

  providers$: Observable<Provider[]>;
  transferMethods$: Observable<TransferMethod[]>;
  selectedProvider$: Observable<Provider>;
  transferDataPageLoading$: Observable<boolean>;
  transferDataPageLoadingError$: Observable<boolean>;
  currentWorkflowStep$: Observable<TransferDataWorkflowStep>;
  providerSupportedEntities$: Observable<EntityChoice[]>;

  transferMethodsSub: Subscription;
  selectedProviderSub: Subscription;
  authenticationTypeSub: Subscription;
  providerSupportedEntitiesSub: Subscription;

  workflowStep = TransferDataWorkflowStep;

  constructor(private store: Store<fromDataManagementMainReducer.State>) {
    this.transferMethods$ = this.store.select(fromDataManagementMainReducer.getTransferMethods);
    this.providers$ = this.store.select(fromDataManagementMainReducer.getProviders);
    this.selectedProvider$ = this.store.select(fromDataManagementMainReducer.getSelectedProvider);
    this.currentWorkflowStep$ = this.store.select(fromDataManagementMainReducer.getWorkflowStep);
    this.providerSupportedEntities$ = this.store.select(fromDataManagementMainReducer.getProviderSupportedEntities);

    this.transferDataPageLoading$ = this.store.select(fromDataManagementMainReducer.getTransferDataPageLoading);
    this.transferDataPageLoadingError$ = this.store.select(fromDataManagementMainReducer.getTransferDataPageLoadingError);

    this.transferMethodsSub =
      this.transferMethods$.subscribe(tms => this.transferMethods = tms);
    this.selectedProviderSub =
      this.selectedProvider$.subscribe(sp => this.selectedProvider = sp);
    this.providerSupportedEntitiesSub =
      this.providerSupportedEntities$.subscribe(se => this.providerSupportedEntities = cloneDeep(se));
  }

  ngOnInit() {
    this.store.dispatch(new fromTransferDataPageActions.Init());
  }

  ngOnDestroy() {
    this.transferMethodsSub.unsubscribe();
    this.selectedProviderSub.unsubscribe();
    this.providerSupportedEntitiesSub.unsubscribe();
  }

  cancelTransferDataWorkflow() {
    this.store.dispatch(new fromTransferDataPageActions.ResetTransferDataPageWorkflow());
  }

  setSelectedTransferMethod(transferMethodId: number) {
    this.store.dispatch(new fromTransferDataPageActions.SetSelectedTransferMethod(transferMethodId));
  }

  setSelectedProvider(provider: Provider) {
    this.store.dispatch(new fromTransferDataPageActions.SetSelectedProvider(provider));
  }

  proceedToAuthentication() {
    this.store.dispatch(new fromTransferDataPageActions.ProceedToAuthentication(this.providerSupportedEntities));
  }

  proceedToEntitySelection() {
    this.store.dispatch(new fromTransferDataPageActions.LoadEntitySelection());
  }

  checkForSelectedEntity() {
    return this.providerSupportedEntities.filter(p => p.isChecked).length > 0;
  }
}
