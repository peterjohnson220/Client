import { Component, OnInit, OnDestroy } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UpsertExchangeJobMapRequest } from 'libs/models/peer/requests/upsert-exchange-job-map.request.model';
import { CompanyJob } from 'libs/features/peer/job-association/models/company-job.model';
import { ExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';

import * as companyJobsActions from '../../actions/company-jobs.actions';
import * as companyJobsReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-job-search',
  templateUrl: './exchange-job-search.component.html',
  styleUrls: ['./exchange-job-search.component.scss']
})
export class ExchangeJobSearchComponent implements OnInit, OnDestroy {
  loadingExchangeJobs$: Observable<boolean>;
  loadingExchangeJobsError$: Observable<boolean>;
  exchangeJobs$: Observable<ExchangeJob[]>;
  savingAssociation$: Observable<boolean>;
  savingAssociationError$: Observable<boolean>;

  titleSearchTerm: string;
  descriptionSearchTerm: string;
  exchangeId: number;
  selectedCompanyJob: CompanyJob;

  allSubscriptions: Subscription = new Subscription();

  constructor(private store: Store<companyJobsReducer.State>) { }

  ngOnInit() {
    this.exchangeJobs$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsExchangeJobsSearchResults));
    this.loadingExchangeJobs$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsSearchingExchangeJobs));
    this.loadingExchangeJobsError$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsSearchingExchangeJobsError));
    this.savingAssociation$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsSavingAssociation));
    this.savingAssociationError$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsSavingAssociationError));

    this.allSubscriptions.add(this.store.pipe(select(companyJobsReducer.getCompanyJobsExchangeId)).subscribe(
      exchangeId => this.exchangeId = exchangeId));

    this.allSubscriptions.add(this.store.pipe(select(companyJobsReducer.getCompanyJobsSelectedCompanyJob)).subscribe(
      selectedCompanyJob => this.selectedCompanyJob = selectedCompanyJob));

    this.allSubscriptions.add(this.store.pipe(select(companyJobsReducer.getCompanyJobsSelectedCompanyJob)).subscribe(
      selectedCompanyJob => this.selectedCompanyJob = selectedCompanyJob));

    this.allSubscriptions.add(this.store.pipe(select(companyJobsReducer.getCompanyJobsExchangeJobsTitleSearchTerm)).subscribe(
      titleSearchTerm => this.titleSearchTerm = titleSearchTerm));

    this.allSubscriptions.add(this.store.pipe(select(companyJobsReducer.getCompanyJobsExchangeJobsDescriptionSearchTerm)).subscribe(
      descriptionSearchTerm => this.descriptionSearchTerm = descriptionSearchTerm));
  }

  ngOnDestroy() {
    this.allSubscriptions.unsubscribe();
  }

  handleTitleSearchChanged(searchTerm: string): void {
    this.store.dispatch(new companyJobsActions.UpdateExchangeJobsTitleSearchTerm(searchTerm));
    this.store.dispatch(new companyJobsActions.SearchExchangeJobs());
  }

  handleDescriptionSearchChanged(searchTerm: string): void {
    this.store.dispatch(new companyJobsActions.UpdateExchangeJobsDescriptionSearchTerm(searchTerm));
    this.store.dispatch(new companyJobsActions.SearchExchangeJobs());
  }

  handleAssociationClick(exchangeJob: ExchangeJob): void {
    const associationRequest: UpsertExchangeJobMapRequest = {
      ExchangeId: this.exchangeId,
      ExchangeJobId: exchangeJob.ExchangeJobId,
      CompanyJobId: this.selectedCompanyJob.CompanyJobId
    };

    this.store.dispatch(new companyJobsActions.SaveAssociation(associationRequest));
  }

  handleResetSearch() {
    this.store.dispatch(new companyJobsActions.UpdateExchangeJobsTitleSearchTerm(null));
    this.store.dispatch(new companyJobsActions.UpdateExchangeJobsDescriptionSearchTerm(null));
    this.store.dispatch(new companyJobsActions.SearchExchangeJobs());
  }
}
