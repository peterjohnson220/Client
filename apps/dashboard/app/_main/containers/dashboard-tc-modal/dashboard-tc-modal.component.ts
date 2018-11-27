import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';


import { TermsConditionsModel, TermsConditionsSubmissionModel } from 'libs/models';

import * as fromDashboardTCReducer from '../../reducers';
import * as fromDashboardTCActions from '../../actions/dashboard-tc-modal.actions';
import * as fromTileGridActions from '../../actions/tile-grid.actions';
import * as fromLeftSidebarActions from 'libs/ui/layout-wrapper/actions/left-sidebar.actions';


@Component({
  selector: 'pf-dashboard-tc-modal',
  templateUrl: './dashboard-tc-modal.component.html',
  styleUrls: [ './dashboard-tc-modal.component.scss' ]
})
export class DashboardTCModalComponent implements OnInit {
  tcModalOpen$: Observable<boolean>;
  tcModel$: Observable<TermsConditionsModel>;
  tcSubmittingSuccess$: Observable<boolean>;

  tcModelSubscription: Subscription;
  tcId: string;
  tcTitle: string;
  tcContent: string;
  termAndConditionsFeatureName = 'Peer';
  showClose = true;

  constructor(private store: Store<fromDashboardTCReducer.State>, private route: ActivatedRoute) {
    this.tcModel$ = this.store.select(fromDashboardTCReducer.getTCData);
    this.tcModalOpen$ = this.store.select(fromDashboardTCReducer.hasTCData);
    this.tcSubmittingSuccess$ = this.store.select(fromDashboardTCReducer.getTCSubmittingSuccess);
  }

  // Lifecycle
  ngOnInit() {
    this.loadTCIfFromLogin();

    this.tcModelSubscription = this.tcModel$.subscribe(tcModel => {
      if (tcModel) {
        this.tcId = tcModel.TCId;
        this.tcTitle = tcModel.Title;
        this.tcContent = tcModel.Content;
      }
    });
  }

  loadTCIfFromLogin() {
    this.route.queryParams.subscribe(params => {
      const fromLogin = params[ 'login' ];

      if (fromLogin === 'true') {
        this.store.dispatch(new fromDashboardTCActions.LoadingTermsAndConditions(this.termAndConditionsFeatureName));
      }
    });
  }

  acceptTC() {
    this.submitTC(true);
  }

  declineTC() {
    this.submitTC(false);
  }

  submitTC(accepted: boolean) {
    const termsConditionsSubmission = {
      TCId: this.tcId,
      Accepted: accepted
    } as TermsConditionsSubmissionModel;

    this.store.dispatch(new fromDashboardTCActions.SubmittingTermsAndConditionsResponse(termsConditionsSubmission));

  }
}
