import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';

import {Observable, Subscription} from 'rxjs';
import {skip} from 'rxjs/operators';

import { TransferMethodTypes } from 'libs/constants/hris-api';

import * as fromDataManagementMainReducer from '../../../reducers';
import * as fromTransferDataPageActions from '../../../actions/transfer-data-page.actions';
import * as fromHrisConnectionActions from '../../../actions/hris-connection.actions';
import {ConnectionSummary} from '../../../models';

@Component({
  selector: 'pf-data-management-landing',
  templateUrl: './data-management-landing.page.html',
  styleUrls: ['./data-management-landing.page.scss']
})
export class DataManagementLandingPageComponent implements OnInit, OnDestroy {
  public inbound = TransferMethodTypes.HRIS_INTEGRATION;
  public outboundjdm = TransferMethodTypes.HRIS_OUTBOUND_JDM_INTEGRATION;

  private connectionSummary$: Observable<ConnectionSummary>;
  private subscription: Subscription;
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;

  connectionSummary: ConnectionSummary;

  constructor(private store: Store<fromDataManagementMainReducer.State>, private router: Router) {
    this.connectionSummary$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionSummary);
    this.loading$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionLoading);
    this.loadingError$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionLoadingError);
    this.subscription = this.connectionSummary$.pipe(skip(1)).subscribe(x => {
      this.connectionSummary = x;
    });
  }

  ngOnInit() {
    this.store.dispatch(new fromHrisConnectionActions.GetHrisConnectionSummary());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goToMappingPage($event: any) {
    this.router.navigate(['', '/field-mapping']);
  }
}
