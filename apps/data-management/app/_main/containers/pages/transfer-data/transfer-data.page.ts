import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';

import * as fromTransferDataPageActions from '../../../actions/transfer-data-page.actions';
import * as fromDataManagementMainReducer from '../../../reducers';
import {TransferDataWorkflowStep} from '../../../data';
import {AuthenticationType, Provider, TransferMethod} from '../../../models';

@Component({
  selector: 'pf-transfer-data-page',
  templateUrl: './transfer-data.page.html',
  styleUrls: ['./transfer-data.page.scss']
})
export class TransferDataPageComponent implements OnInit, OnDestroy {

  transferMethods: TransferMethod[];
  selectedProvider: Provider;
  authenticationType: AuthenticationType;

  providers$: Observable<Provider[]>;
  transferMethods$: Observable<TransferMethod[]>;
  selectedProvider$: Observable<Provider>;
  transferDataPageLoading$: Observable<boolean>;
  transferDataPageLoadingError$: Observable<boolean>;
  currentWorkflowStep$: Observable<TransferDataWorkflowStep>;

  transferMethodsSub: Subscription;
  selectedProviderSub: Subscription;
  authenticationTypeSub: Subscription;

  workflowStep = TransferDataWorkflowStep;

  constructor(
    private store: Store<fromDataManagementMainReducer.State>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.transferMethods$ = this.store.select(fromDataManagementMainReducer.getTransferMethods);
    this.providers$ = this.store.select(fromDataManagementMainReducer.getProviders);
    this.selectedProvider$ = this.store.select(fromDataManagementMainReducer.getSelectedProvider);
    this.currentWorkflowStep$ = this.store.select(fromDataManagementMainReducer.getWorkflowStep);

    this.transferDataPageLoading$ = this.store.select(fromDataManagementMainReducer.getTransferDataPageLoading);
    this.transferDataPageLoadingError$ = this.store.select(fromDataManagementMainReducer.getTransferDataPageLoadingError);

    this.transferMethodsSub =
      this.transferMethods$.subscribe(tms => this.transferMethods = tms);
    this.selectedProviderSub =
      this.selectedProvider$.subscribe(sp => this.selectedProvider = sp);
  }

  ngOnInit() {
    this.store.dispatch(new fromTransferDataPageActions.Init());
  }

  ngOnDestroy() {
    this.transferMethodsSub.unsubscribe();
    this.selectedProviderSub.unsubscribe();
  }

  cancelTransferDataWorkflow() {
    this.store.dispatch(new fromTransferDataPageActions.ResetTransferDataPageWorkflow());
    this.router.navigate(['/']);
  }

  setSelectedTransferMethod(transferMethodId: number) {
    this.store.dispatch(new fromTransferDataPageActions.SetSelectedTransferMethod(transferMethodId));
  }

  setSelectedProvider(provider: Provider) {
    this.store.dispatch(new fromTransferDataPageActions.SetSelectedProvider(provider));
  }

  proceedToEntitySelection() {
    this.store.dispatch(new fromTransferDataPageActions.UpdateWorkflowstep(TransferDataWorkflowStep.EntitySelection));
    this.router.navigate(['transfer-data/inbound/entity-selection']);
  }
}
