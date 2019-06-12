import { Component, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CompanyJob } from 'libs/models/company';
import { ExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';

import * as companyJobsActions from '../../actions/company-jobs.actions';
import * as companyJobsReducer from '../../reducers';

@Component({
  selector: 'pf-company-job-and-exchange-detail',
  templateUrl: './company-job-and-exchange-detail.component.html',
  styleUrls: ['./company-job-and-exchange-detail.component.scss']
})
export class CompanyJobAndExchangeDetailComponent implements OnInit {
  selectedCompanyJob$: Observable<CompanyJob>;

  mappedExchangeJobsLoading$: Observable<boolean>;
  mappedExchangeJobsLoadingSuccess$: Observable<boolean>;
  mappedExchangeJobsLoadingError$: Observable<boolean>;
  mappedExchangeJob$: Observable<ExchangeJob>;

  jdmDescriptionIds$: Observable<number[]>;
  jdmDescriptionLoading$: Observable<boolean>;
  jdmDescriptionLoadingError$: Observable<boolean>;

  constructor(private store: Store<companyJobsReducer.State>) { }

  ngOnInit() {
    this.selectedCompanyJob$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsSelectedCompanyJob));

    this.mappedExchangeJobsLoading$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsMappedExchangeJobsLoading));
    this.mappedExchangeJobsLoadingSuccess$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsMappedExchangeJobsLoadingSuccess));
    this.mappedExchangeJobsLoadingError$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsMappedExchangeJobsLoadingError));
    this.mappedExchangeJob$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsMappedExchangeJob));

    this.jdmDescriptionIds$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsJdmDescriptionIds));
    this.jdmDescriptionLoading$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsDownloadingJdmDescription));
    this.jdmDescriptionLoadingError$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsDownloadingJdmDescriptionError));
  }

  handleCloseClick() {
    this.store.dispatch(new companyJobsActions.SetSelectedCompanyJob(null));
  }

  handleViewJdmDescriptionClick() {
    this.store.dispatch(new companyJobsActions.DownloadJdmDescription());
  }
}
