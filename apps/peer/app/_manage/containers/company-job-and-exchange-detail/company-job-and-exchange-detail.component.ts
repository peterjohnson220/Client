import { Component, OnInit, OnDestroy } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UpsertExchangeJobMapRequest } from 'libs/models/peer/requests/upsert-exchange-job-map.request.model';
import { CompanyJob } from 'libs/features/peer/job-association/models/company-job.model';
import { ExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';

import * as companyJobsActions from '../../actions/company-jobs.actions';
import * as peerManagementReducer from '../../reducers';

@Component({
  selector: 'pf-company-job-and-exchange-detail',
  templateUrl: './company-job-and-exchange-detail.component.html',
  styleUrls: ['./company-job-and-exchange-detail.component.scss']
})
export class CompanyJobAndExchangeDetailComponent implements OnInit, OnDestroy {
  selectedCompanyJob$: Observable<CompanyJob>;
  savingAssociation$: Observable<boolean>;
  savingAssociationError$: Observable<boolean>;

  mappedExchangeJobsLoading$: Observable<boolean>;
  mappedExchangeJobsLoadingSuccess$: Observable<boolean>;
  mappedExchangeJobsLoadingError$: Observable<boolean>;
  mappedExchangeJob$: Observable<ExchangeJob>;

  jdmDescriptionIds$: Observable<number[]>;
  jdmDescriptionLoading$: Observable<boolean>;
  jdmDescriptionLoadingError$: Observable<boolean>;

  exchangeId: number;
  selectedCompanyJob: CompanyJob;

  allSubscriptions = new Subscription();

  constructor(private store: Store<peerManagementReducer.State>) { }

  ngOnInit() {
    this.selectedCompanyJob$ = this.store.pipe(select(peerManagementReducer.getCompanyJobsSelectedCompanyJob));

    this.savingAssociation$ =  this.store.pipe(select(peerManagementReducer.getCompanyJobsSavingAssociation));
    this.savingAssociationError$ =  this.store.pipe(select(peerManagementReducer.getCompanyJobsSavingAssociationError));

    this.mappedExchangeJobsLoading$ = this.store.pipe(select(peerManagementReducer.getCompanyJobsMappedExchangeJobsLoading));
    this.mappedExchangeJobsLoadingSuccess$ = this.store.pipe(select(peerManagementReducer.getCompanyJobsMappedExchangeJobsLoadingSuccess));
    this.mappedExchangeJobsLoadingError$ = this.store.pipe(select(peerManagementReducer.getCompanyJobsMappedExchangeJobsLoadingError));
    this.mappedExchangeJob$ = this.store.pipe(select(peerManagementReducer.getCompanyJobsMappedExchangeJob));

    this.jdmDescriptionIds$ = this.store.pipe(select(peerManagementReducer.getCompanyJobsJdmDescriptionIds));
    this.jdmDescriptionLoading$ = this.store.pipe(select(peerManagementReducer.getCompanyJobsDownloadingJdmDescription));
    this.jdmDescriptionLoadingError$ = this.store.pipe(select(peerManagementReducer.getCompanyJobsDownloadingJdmDescriptionError));

    this.allSubscriptions.add(this.selectedCompanyJob$.subscribe(selectedCompanyJob => this.selectedCompanyJob = selectedCompanyJob));
    this.allSubscriptions.add(this.store.pipe(select(peerManagementReducer.getCompanyJobsExchangeId)).subscribe((exchangeId: number) => {
      this.exchangeId = exchangeId;
    }));
  }

  ngOnDestroy() {
    this.allSubscriptions.unsubscribe();
  }

  handleCloseClick() {
    // reset the scroll to index so clicking on the same row after closing the detail kicks off the scroller
    this.store.dispatch(new companyJobsActions.UpdatePageRowIndexToScrollTo(null));
    this.store.dispatch(new companyJobsActions.SetSelectedCompanyJob(null));
  }

  handleViewJdmDescriptionClick() {
    this.store.dispatch(new companyJobsActions.DownloadJdmDescription());
  }

  handleApprovePendingMatchClick(exchangeJob: ExchangeJob) {
    this.store.dispatch(new companyJobsActions.ApprovePendingMatch(this.getPendingAssociationRequest(exchangeJob)));
  }

  handleRejectPendingMatchClick(exchangeJob: ExchangeJob) {
    this.store.dispatch(new companyJobsActions.Unmatch(this.getPendingAssociationRequest(exchangeJob)));
  }

  handleUnmatchClick() {
    this.store.dispatch(new companyJobsActions.ConfirmUnmatch());
  }

  handleCreateProjectClick() {
    this.store.dispatch(new companyJobsActions.ConfirmCreateProject());
  }

  getPendingAssociationRequest(exchangeJob: ExchangeJob): UpsertExchangeJobMapRequest {
    return {
      ExchangeId: this.exchangeId,
      ExchangeJobId: exchangeJob.ExchangeJobId,
      CompanyJobId: this.selectedCompanyJob.CompanyJobId
    };
  }
}
