import { Component, OnInit, OnDestroy } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { CreateProjectRequest } from 'libs/models/payfactors-api';
import { CompanyJob } from 'libs/features/peer/job-association/models/company-job.model';
import { ExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';

import * as companyJobsActions from '../../actions/company-jobs.actions';
import * as peerManagementReducer from '../../reducers';

@Component({
  selector: 'pf-confirm-create-project-modal',
  templateUrl: './confirm-create-project-modal.component.html',
  styleUrls: ['./confirm-create-project-modal.component.scss']
})
export class ConfirmCreateProjectModalComponent implements OnInit, OnDestroy {
  showModal$: Observable<boolean>;
  selectedCompanyJob$: Observable<CompanyJob>;
  mappedExchangeJob$: Observable<ExchangeJob>;
  savingAssociation$: Observable<boolean>;
  creatingProject$: Observable<boolean>;
  createProjectError$: Observable<boolean>;

  selectedCompanyJob: CompanyJob;
  mappedExchangeJob: ExchangeJob;

  allSubscriptions = new Subscription();

  constructor(private store: Store<peerManagementReducer.State>) { }

  ngOnInit() {
    this.showModal$ = this.store.pipe(select(peerManagementReducer.getCompanyJobsShowConfirmCreateProjectModal));
    this.selectedCompanyJob$ = this.store.pipe(select(peerManagementReducer.getCompanyJobsSelectedCompanyJob));
    this.mappedExchangeJob$ = this.store.pipe(select(peerManagementReducer.getCompanyJobsMappedExchangeJob));
    this.creatingProject$ = this.store.select(peerManagementReducer.getCompanyJobsCreatingProject);
    this.createProjectError$ = this.store.select(peerManagementReducer.getCompanyJobsShowCreatingProjectError);

    this.allSubscriptions.add(this.selectedCompanyJob$.subscribe(companyJob => this.selectedCompanyJob = companyJob));
    this.allSubscriptions.add(this.mappedExchangeJob$.subscribe(exchangeJob => this.mappedExchangeJob = exchangeJob));
  }

  ngOnDestroy() {
    this.allSubscriptions.unsubscribe();
  }

  handleCreateProjectConfirmed() {
    const payload: CreateProjectRequest = {
      JobIds: [this.selectedCompanyJob.CompanyJobId],
      PricingIds: [],
      JobPayMarketSelections: []
    };
    this.store.dispatch(new companyJobsActions.CreateProject(payload));
  }

  handleCreateProjectCanceled() {
    this.store.dispatch(new companyJobsActions.CancelCreateProject());
  }
}
