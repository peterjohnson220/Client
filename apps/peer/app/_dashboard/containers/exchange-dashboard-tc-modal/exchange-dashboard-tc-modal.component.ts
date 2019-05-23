import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { TermsConditionsModel, TermsConditionsSubmissionModel } from 'libs/models';

import * as fromExchangeDashboardTCReducer from '../../reducers';
import * as fromExchangeDashboardTCActions from '../../actions/exchange-dashboard-tc-modal.actions';
import * as fromUploadOrgDataActions from '../../actions/upload-org-data.actions';

@Component({
  selector: 'pf-exchange-dashboard-tc-modal',
  templateUrl: './exchange-dashboard-tc-modal.component.html',
  styleUrls: [ './exchange-dashboard-tc-modal.component.scss' ]
})
export class ExchangeDashboardTCModalComponent implements OnInit {
  tcModalOpen$: Observable<boolean>;
  tcModel$: Observable<TermsConditionsModel>;
  tcSubmittingSuccess$: Observable<boolean>;

  tcModelSubscription: Subscription;
  tcId: string;
  tcTitle: string;
  tcContent: string;
  termAndConditionsFeatureName = 'PeerOnly';
  acceptText = 'Continue';
  showClose = false;
  isPeerHardCopy = false;

  constructor(private store: Store<fromExchangeDashboardTCReducer.State>) {
    this.tcModel$ = this.store.pipe(select(fromExchangeDashboardTCReducer.getTCData));
    this.tcModalOpen$ = this.store.pipe(select(fromExchangeDashboardTCReducer.hasTCData));
    this.tcSubmittingSuccess$ = this.store.pipe(select(fromExchangeDashboardTCReducer.getTCSubmittingSuccess));
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromExchangeDashboardTCActions.LoadTermsAndConditions(this.termAndConditionsFeatureName));

    this.tcModelSubscription = this.tcModel$.subscribe(tcModel => {
      if (tcModel) {
        this.tcId = tcModel.TCId;
        this.tcTitle = tcModel.Title;
        this.tcContent = tcModel.Content;
        if (tcModel.Type === 'PeerHardCopy') {
          this.isPeerHardCopy = true;
          this.showClose = true;
        }
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

    this.store.dispatch(new fromExchangeDashboardTCActions.SubmitTermsAndConditionsResponse(termsConditionsSubmission));
    this.store.dispatch(new fromUploadOrgDataActions.OpenUploadOrgDataModal());
  }
}
