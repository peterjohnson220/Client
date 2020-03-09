import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { isObject } from 'lodash';
import { asapScheduler, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { CredentialsPackage } from 'libs/models';

import * as fromDataManagementMainReducer from '../../../reducers';
import { TransferDataWorkflowStep } from '../../../data';
import { ConnectionSummary } from '../../../models';
import * as fromHrisConnectionActions from '../../../actions/hris-connection.actions';
import * as fromProviderListActions from '../../../actions/provider-list.actions';
import * as fromTransferDataPageActions from '../../../actions/transfer-data-page.actions';
import * as fromEntitySelectionActions from '../../../actions/entity-selection.actions';

@Component({
  selector: 'pf-inbound-authentication',
  templateUrl: './inbound-authentication.page.html',
  styleUrls: ['./inbound-authentication.page.scss']
})
export class InboundAuthenticationPageComponent implements OnInit, OnDestroy {
  connectionSummary$: Observable<ConnectionSummary>;
  currentWorkflowStep$: Observable<TransferDataWorkflowStep>;
  private unsubscribe$ = new Subject();

  workflowStep = TransferDataWorkflowStep;

  constructor(
    private location: Location,
    private store: Store<fromDataManagementMainReducer.State>,
    private router: Router,
  ) {
    this.connectionSummary$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionSummary).pipe(
      filter(isObject),
      takeUntil(this.unsubscribe$),
    );
    this.currentWorkflowStep$ = this.store.select(fromDataManagementMainReducer.getWorkflowStep);
  }

  ngOnInit() {
    asapScheduler.schedule(() => {
      this.store.dispatch(new fromTransferDataPageActions.UpdateWorkflowstep(TransferDataWorkflowStep.Authentication));
      this.store.dispatch(new fromHrisConnectionActions.GetHrisConnectionSummary());

      this.connectionSummary$.subscribe(connectionSummary => {
        if (!isObject(connectionSummary.provider)) {
          this.cancel();
        }

        if (connectionSummary.connectionID) {
          this.store.dispatch(new fromProviderListActions.SetSelectedProvider(connectionSummary.provider));
          this.store.dispatch(new fromEntitySelectionActions.SetEntitySelections({
            connectionId: connectionSummary.connectionID,
            selectedEntities: connectionSummary.selectedEntities
          }));
        }
      });
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  back() {
    this.store.dispatch(new fromTransferDataPageActions.UpdateWorkflowstep(TransferDataWorkflowStep.EntitySelection));
    this.router.navigate(['/transfer-data/inbound/entity-selection']);
  }

  cancel() {
    this.store.dispatch(new fromTransferDataPageActions.ResetTransferDataPageWorkflow());
    this.router.navigate(['/']);
  }

  next(creds: CredentialsPackage) {
    this.store.dispatch(new fromHrisConnectionActions.CreateConnection(creds));
    this.router.navigate(['/transfer-data/inbound/field-mapping']);
  }

  validateCredentials(creds: CredentialsPackage) {
    this.store.dispatch(new fromHrisConnectionActions.Validate(creds));
  }
}
