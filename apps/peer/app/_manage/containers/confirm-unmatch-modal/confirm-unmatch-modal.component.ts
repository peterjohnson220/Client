import { Component, OnInit, OnDestroy } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UpsertExchangeJobMapRequest } from 'libs/models/peer/requests/upsert-exchange-job-map.request.model';
import { CompanyJob } from 'libs/features/peer/job-association/models/company-job.model';
import { ExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';

import * as companyJobsActions from '../../actions/company-jobs.actions';
import * as peerManagementReducer from '../../reducers';

@Component({
  selector: 'pf-confirm-unmatch-modal',
  templateUrl: './confirm-unmatch-modal.component.html',
  styleUrls: ['./confirm-unmatch-modal.component.scss']
})
export class ConfirmUnmatchModalComponent implements OnInit, OnDestroy {
  showModal$: Observable<boolean>;
  selectedCompanyJob$: Observable<CompanyJob>;
  mappedExchangeJob$: Observable<ExchangeJob>;
  savingAssociation$: Observable<boolean>;

  selectedCompanyJob: CompanyJob;
  mappedExchangeJob: ExchangeJob;

  allSubscriptions = new Subscription();

  constructor(private store: Store<peerManagementReducer.State>) { }

  ngOnInit() {
    this.showModal$ = this.store.pipe(select(peerManagementReducer.getCompanyJobsShowConfirmUnmatchModal));
    this.selectedCompanyJob$ = this.store.pipe(select(peerManagementReducer.getCompanyJobsSelectedCompanyJob));
    this.mappedExchangeJob$ = this.store.pipe(select(peerManagementReducer.getCompanyJobsMappedExchangeJob));
    this.savingAssociation$ =  this.store.pipe(select(peerManagementReducer.getCompanyJobsSavingAssociation));

    this.allSubscriptions.add(this.selectedCompanyJob$.subscribe(companyJob => this.selectedCompanyJob = companyJob));
    this.allSubscriptions.add(this.mappedExchangeJob$.subscribe(exchangeJob => this.mappedExchangeJob = exchangeJob));
  }

  ngOnDestroy() {
    this.allSubscriptions.unsubscribe();
  }

  handleUnmatchConfirmed() {
    const request: UpsertExchangeJobMapRequest = {
      ExchangeId: this.mappedExchangeJob.ExchangeId,
      ExchangeJobId: this.mappedExchangeJob.ExchangeJobId,
      CompanyJobId: this.selectedCompanyJob.CompanyJobId
    };

    this.store.dispatch(new companyJobsActions.Unmatch(request));
  }

  handleUnmatchCanceled() {
    this.store.dispatch(new companyJobsActions.CancelUnmatch());
  }
}
