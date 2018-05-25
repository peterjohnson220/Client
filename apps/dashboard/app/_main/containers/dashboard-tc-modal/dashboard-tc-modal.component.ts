import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';

import { UserContext, TermsConditionsModel, TermsConditionsSubmissionModel } from 'libs/models';
import * as fromRootState from 'libs/state/state';

import * as fromDashboardTCReducer from '../../reducers';
import * as fromDashboardTCActions from '../../actions/dashboard-tc-modal.actions';

@Component({
  selector: 'pf-dashboard-tc-modal',
  templateUrl: './dashboard-tc-modal.component.html',
  styleUrls: [ './dashboard-tc-modal.component.scss' ]
})
export class DashboardTCModalComponent implements OnInit {
  tcModalOpen$: Observable<boolean>;
  userContext$: Observable<UserContext>;
  TCModel$: Observable<TermsConditionsModel>;

  tcModelSubscription: Subscription;
  tcId: string;
  tcTitle: string;
  tcContent: string;
  termAndConditionsFeatureName = 'Peer';

  constructor(private store: Store<fromDashboardTCReducer.State>) {
    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.TCModel$ = this.store.select(fromDashboardTCReducer.getTCData);
    this.tcModalOpen$ = this.store.select(fromDashboardTCReducer.hasTCData);
  }

  // Lifecycle
  ngOnInit() {
    this.loadTCIfFromLogin();

    this.tcModelSubscription = this.TCModel$.subscribe( tcModel => {
      if (tcModel) {
        this.tcId = tcModel.TCId;
        this.tcTitle = tcModel.Title;
        this.tcContent = tcModel.Content;
      }
    });
  }

  loadTCIfFromLogin() {
    if (document.referrer.indexOf('login') >= 0 || window.location.origin + '/' === document.referrer) {
      this.store.dispatch(new fromDashboardTCActions.LoadingTermsAndConditions(this.termAndConditionsFeatureName));
    }
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
