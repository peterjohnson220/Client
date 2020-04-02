import { Component, OnDestroy, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromTransferDataPageActions from '../../../../actions/transfer-data-page.actions';
import * as fromDataManagementMainReducer from '../../../../reducers';
import { TransferDataWorkflowStep } from '../../../../data';
import { AuthenticationType, Provider, TransferMethod, EntityChoice } from '../../../../models';


  @Component({
    selector: 'pf-outbound-provider-page',
    templateUrl: './outbound-provider.page.html',
    styleUrls: ['./outbound-provider.page.scss']
  })
  export class OutboundProviderSelectionPageComponent implements OnInit, OnDestroy {
    @Input() provider: Provider;
    @Output() outboundProviderSelected = new EventEmitter<Provider>();

    authenticationType: AuthenticationType;
    providerSupportedEntities: EntityChoice[];
    outboundSelectedProvider: Provider;
    outboundTransferMethods: TransferMethod[];

    currentOutboundWorkflowStep$: Observable<TransferDataWorkflowStep>;
    outboundProviders$: Observable<Provider[]>;
    outboundSelectedProvider$: Observable<Provider>;
    outboundTransferMethods$: Observable<TransferMethod[]>;

    authenticationTypeSub: Subscription;
    outboundSelectedProviderSub: Subscription;
    outboundTransferMethodsSub: Subscription;

    outboundWorkflowStep = TransferDataWorkflowStep;

    constructor(private store: Store<fromDataManagementMainReducer.State>, private router: Router) {
      this.currentOutboundWorkflowStep$ = this.store.select(fromDataManagementMainReducer.getOutboundWorkflowStep);
      this.outboundProviders$ = this.store.select(fromDataManagementMainReducer.getOutboundProviders);
      this.outboundSelectedProvider$ = this.store.select(fromDataManagementMainReducer.getOutboundSelectedProvider);
      this.outboundTransferMethods$ = this.store.select(fromDataManagementMainReducer.getOutboundTransferMethods);


      this.outboundSelectedProviderSub =
        this.outboundSelectedProvider$.subscribe(sp => this.outboundSelectedProvider = sp);
      this.outboundTransferMethodsSub =
        this.outboundTransferMethods$.subscribe(otms => this.outboundTransferMethods = otms);
    }

    ngOnInit() {
      this.store.dispatch(new fromTransferDataPageActions.OutboundInit());
    }

    ngOnDestroy() {
      this.outboundSelectedProviderSub.unsubscribe();
      this.outboundTransferMethodsSub.unsubscribe();
    }

    cancelTransferDataWorkflow() {
      this.store.dispatch(new fromTransferDataPageActions.ResetOutboundTransferDataPageWorkflow());
      this.router.navigate(['/']);
    }

    setOutboundSelectedTransferMethod(transferMethodId: number) {
      this.store.dispatch(new fromTransferDataPageActions.SetOutboundSelectedTransferMethod(transferMethodId));
    }

    setOutboundSelectedProvider(provider: Provider) {
      this.store.dispatch(new fromTransferDataPageActions.SetOutboundSelectedProvider(provider));
    }

    next() {
      // TODO: update this to the new outbound entity selection page
      this.router.navigate(['/transfer-data/outbound/authentication']);
    }

    selectProviderClick(event: any) {
      if (this.provider.Active) {
        this.outboundProviderSelected.emit(this.provider);
      }
    }
  }
