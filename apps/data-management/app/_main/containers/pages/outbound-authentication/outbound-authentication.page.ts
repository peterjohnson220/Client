import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { isObject } from 'lodash';
import { asapScheduler, Observable, Subject } from 'rxjs';
import { filter, takeUntil, map } from 'rxjs/operators';

import { TransferMethodTypes } from 'libs/constants';
import { CredentialsPackage } from 'libs/models';

import * as fromDataManagementMainReducer from '../../../reducers';
import { TransferDataWorkflowStep } from '../../../data';
import { ConnectionSummary } from '../../../models';
import * as fromTransferDataPageActions from '../../../actions/transfer-data-page.actions';
import * as fromOutboundJdmActions from '../../../actions/outbound-jdm.actions';

@Component({
  selector: 'pf-outbound-authentication',
  templateUrl: './outbound-authentication.page.html',
  styleUrls: ['./outbound-authentication.page.scss']
})
export class OutboundAuthenticationPageComponent implements OnInit, OnDestroy {
  connectionSummary$: Observable<ConnectionSummary>;
  currentWorkflowStep$: Observable<TransferDataWorkflowStep>;
  private unsubscribe$ = new Subject();

  outboundJdmTransferMethod = TransferMethodTypes.HRIS_OUTBOUND_JDM_INTEGRATION;
  workflowStep = TransferDataWorkflowStep;

  constructor(
    private store: Store<fromDataManagementMainReducer.State>,
    private router: Router,
  ) {
    this.connectionSummary$ = this.store.select(fromDataManagementMainReducer.getJdmConnectionSummaryObj).pipe(
      map(summaryObj => summaryObj.obj),
      filter(isObject),
      takeUntil(this.unsubscribe$),
    );
    this.currentWorkflowStep$ = this.store.select(fromDataManagementMainReducer.getWorkflowStep);
  }

  ngOnInit() {
    asapScheduler.schedule(() => {
      this.store.dispatch(new fromTransferDataPageActions.UpdateWorkflowstep(TransferDataWorkflowStep.Authentication));
      this.store.dispatch(new fromOutboundJdmActions.LoadConnectionSummary());

      this.connectionSummary$.subscribe(connectionSummary => {
        if (!isObject(connectionSummary.provider)) {
          this.cancel();
        }
      });
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  back() {
    this.store.dispatch(new fromTransferDataPageActions.UpdateOutboundWorkflowstep(TransferDataWorkflowStep.OutboundSelectJdmViews));
    this.router.navigate(['/transfer-data/outbound/vendor']);
  }

  cancel() {
    this.store.dispatch(new fromTransferDataPageActions.ResetTransferDataPageWorkflow());
    this.store.dispatch(new fromOutboundJdmActions.ResetConnectionSummary());
    this.router.navigate(['/']);
  }

  next(creds: CredentialsPackage) {
    this.store.dispatch(new fromOutboundJdmActions.SaveCredentials(creds));
    this.router.navigate(['/transfer-data/outbound/jdm-view-selection']);
  }

  validateCredentials(creds: CredentialsPackage) {
    this.store.dispatch(new fromTransferDataPageActions.OutboundJdmValidate(creds));
  }
}
