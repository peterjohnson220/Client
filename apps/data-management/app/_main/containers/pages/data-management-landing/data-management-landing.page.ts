import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Permissions } from 'libs/constants';
import { TransferMethodTypes } from 'libs/constants/hris-api';
import { AsyncStateObj } from 'libs/models/state';

import * as fromTransferDataPageActions from '../../../actions/transfer-data-page.actions';
import * as fromHrisConnectionActions from '../../../actions/hris-connection.actions';
import * as fromOutboundJdmActions from '../../../actions/outbound-jdm.actions';
import * as fromTransferScheduleActions from '../../../actions/transfer-schedule.actions';
import { ConnectionSummary } from '../../../models';
import { TransferDataWorkflowStep } from '../../../data';
import * as fromDataManagementMainReducer from '../../../reducers';

@Component({
  selector: 'pf-data-management-landing',
  templateUrl: './data-management-landing.page.html',
  styleUrls: ['./data-management-landing.page.scss']
})
export class DataManagementLandingPageComponent implements OnInit {
  public inbound = TransferMethodTypes.HRIS_INTEGRATION;
  public outboundjdm = TransferMethodTypes.HRIS_OUTBOUND_JDM_INTEGRATION;

  public permissions = Permissions;

  // TODO:  Turn this into an AsyncStateObj
  connectionSummary$: Observable<ConnectionSummary>;
  outboundConnectionSummary$: Observable<AsyncStateObj<ConnectionSummary>>;
  transferScheduleSummaryLoading$: Observable<boolean>;
  transferScheduleSummaryError$: Observable<boolean>;
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;


  constructor(private store: Store<fromDataManagementMainReducer.State>, private router: Router) {
    this.outboundConnectionSummary$ = this.store.select(fromDataManagementMainReducer.getJdmConnectionSummaryObj);
    this.connectionSummary$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionSummary);
    this.loading$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionLoading);
    this.loadingError$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionLoadingError);
    this.transferScheduleSummaryLoading$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummaryLoading);
    this.transferScheduleSummaryError$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummaryError);
  }

  ngOnInit() {
    this.store.dispatch(new fromHrisConnectionActions.GetHrisConnectionSummary());
    this.store.dispatch(new fromOutboundJdmActions.LoadConnectionSummary());
    this.store.dispatch(new fromTransferScheduleActions.GetTransferSummary());
  }

  goToMappingPage($event: TransferMethodTypes) {
    switch ($event) {
      case TransferMethodTypes.HRIS_INTEGRATION: {
        this.router.navigate(['transfer-data/inbound/field-mapping']);
        break;
      }
      case TransferMethodTypes.HRIS_OUTBOUND_JDM_INTEGRATION: {
        this.router.navigate(['transfer-data/outbound/field-mapping']);
        break;
      }
      default:
        break;
    }
  }

  goToTransferSchedulePage($event: TransferMethodTypes) {
    switch ($event) {
      case TransferMethodTypes.HRIS_INTEGRATION: {
        this.router.navigate(['transfer-data/inbound/transfer-schedule']);
        break;
      }
      case TransferMethodTypes.HRIS_OUTBOUND_JDM_INTEGRATION: {
        this.router.navigate(['transfer-data/outbound/transfer-schedule']);
        break;
      }
      default:
        break;
    }
  }

  goToEntitySelectionPage($event: TransferMethodTypes) {
    switch ($event) {
      case TransferMethodTypes.HRIS_INTEGRATION: {
        this.router.navigate(['transfer-data/inbound/entity-selection']);
        break;
      }
      case TransferMethodTypes.HRIS_OUTBOUND_JDM_INTEGRATION: {
        this.router.navigate(['transfer-data/outbound/jdm-view-selection']);
        break;
      }
      default:
        break;
    }
  }

  createNewIntegration($event: TransferMethodTypes) {
    switch ($event) {
      case TransferMethodTypes.HRIS_INTEGRATION: {
        this.store.dispatch(new fromTransferDataPageActions.UpdateWorkflowstep(TransferDataWorkflowStep.SelectTransferMethod));
        this.router.navigate(['/transfer-data/inbound/vendor']);
        break;
      }
      case TransferMethodTypes.HRIS_OUTBOUND_JDM_INTEGRATION: {
        this.router.navigate(['transfer-data/outbound/vendor']);
        break;
      }
      default:
        break;
    }
  }

  openReauthModal() {
    this.store.dispatch(new fromHrisConnectionActions.OpenReAuthenticationModal(true));
  }
}
