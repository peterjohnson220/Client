import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { PfValidators } from 'libs/forms/validators/index';
import { CardSelectorComponent } from 'libs/ui/common/content/cards/card-selector/card-selector.component';
import { Exchange, ExchangeRequestTypeEnum, RequestExchangeRequest } from 'libs/models/peer/index';

import { ExchangeJobRequestCandidate } from '../../models';
import * as fromPeerManagementReducer from '../../reducers';
import * as fromSharedPeerReducer from '../../../shared/reducers';
import * as fromExchangeRequestActions from '../../../shared/actions/exchange-request.actions';

@Component({
  selector: 'pf-request-payfactors-job-modal',
  templateUrl: './pf-job-modal.component.html',
  styleUrls: ['./pf-job-modal.component.scss']
})

export class PayfactorsJobModalComponent implements OnInit, OnDestroy {
  @ViewChild(CardSelectorComponent) cardSelector;

  exchange$: Observable<Exchange>;
  payfactorsJobs$: Observable<ExchangeJobRequestCandidate[]>;
  payfactorsJobsLoading$: Observable<boolean>;
  payfactorsJobsLoadingError$: Observable<boolean>;
  payfactorsJobRequesting$: Observable<boolean>;
  exchangeRequestModalOpen$: Observable<boolean>;

  exchangeRequestModalOpenSubscription: Subscription;
  exchangeSubscription: Subscription;

  exchange: Exchange;
  attemptedSubmit = false;
  payfactorsJobSelectionForm: FormGroup;
  reason = '';
  jobTitleSearchTerm = '';
  jobDescriptionSearchTerm = '';
  jobDescriptionHighlightFilter = '';

  jobIdentifier = (job: ExchangeJobRequestCandidate) => job ? job.MDJobsBaseId : 0;
  jobCardDisabled = (job: ExchangeJobRequestCandidate) => job ? (job.InExchange || job.PendingRequest) : false;

  constructor(
    private store: Store<fromPeerManagementReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>,
    private fb: FormBuilder
  ) {
    this.exchange$ = this.sharedPeerStore.select(fromSharedPeerReducer.getExchange);
    this.payfactorsJobs$ = this.store.select(fromPeerManagementReducer.getPfJobsExchangeRequestCandidates);
    this.payfactorsJobsLoading$ = this.store.select(fromPeerManagementReducer.getPfJobsExchangeRequestCandidatesLoading);
    this.payfactorsJobsLoadingError$ = this.store.select(fromPeerManagementReducer.getPfJobsExchangeRequestCandidatesLoadingError);
    this.payfactorsJobRequesting$ = this.store.select(fromPeerManagementReducer.getPfJobsExchangeRequestRequesting);
    this.exchangeRequestModalOpen$ = this.store.select(
      fromPeerManagementReducer.getPfJobsExchangeRequestModalOpen
    );
    this.createForm();
  }

  get reasonPlaceholder(): string {
    return `Please tell us why you would like ${this.cardSelection ? this.cardSelection.JobTitle : ''} to be part ` +
      `of the ${this.exchange ? this.exchange.ExchangeName : ''} exchange...`;
  }
  get modalSubTitle(): string {
    return `Search for and select a job you would like added to the ${this.exchange ? this.exchange.ExchangeName : ''} exchange.
            The exchange administrator will determine if the job will be added to the Exchange.`;
  }
  get reasonControl() { return this.payfactorsJobSelectionForm.get('reason'); }
  get cardSelection(): ExchangeJobRequestCandidate { return this.cardSelector ? this.cardSelector.selectedCard : null; }

  createForm(): void {
    this.payfactorsJobSelectionForm = this.fb.group({
      'reason': [this.reason, [PfValidators.required]],
      'payfactorsJobSelection': [this.cardSelection, [Validators.required]]
    });
  }

  handleReloadCardsEvent(): void {
    this.store.dispatch(new fromExchangeRequestActions.LoadCandidates(ExchangeRequestTypeEnum.PayfactorsJob));
  }

  handleCardSelectionEvent(): void {
    this.reasonControl.setValue('');
  }

  updateJobTitleSearchFilter(newSearchTerm: string): void {
    this.store.dispatch(new fromExchangeRequestActions.UpdateSearchTerm(ExchangeRequestTypeEnum.PayfactorsJob, newSearchTerm));
  }

  updateJDSearchFilter(newSearchTerm: string): void {
    this.jobDescriptionHighlightFilter = newSearchTerm;
    const filterOptions = {
      JobDescriptionQuery: newSearchTerm
    };
    this.store.dispatch(new fromExchangeRequestActions.UpdateFilterOptions(ExchangeRequestTypeEnum.PayfactorsJob, filterOptions));
  }

  // Modal events
  handleFormSubmit(): void {
    this.attemptedSubmit = true;
    const exchangeRequestModel: RequestExchangeRequest = {
      ExchangeId: this.exchange ? this.exchange.ExchangeId : 0,
      Reason: this.reason,
      Type: ExchangeRequestTypeEnum.PayfactorsJob,
      TypeData: {
        MDJobsBaseId: this.cardSelection ? this.cardSelection.MDJobsBaseId : null
      }
    };

    this.store.dispatch(new fromExchangeRequestActions.CreateExchangeRequest(
      ExchangeRequestTypeEnum.PayfactorsJob,
      exchangeRequestModel
    ));
  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.store.dispatch(new fromExchangeRequestActions.CloseExchangeRequestModal(ExchangeRequestTypeEnum.PayfactorsJob));
  }

  // Lifecycle Events
  ngOnInit(): void {
    this.exchangeRequestModalOpenSubscription = this.exchangeRequestModalOpen$.subscribe(open => {
      if (!open) {
        this.cardSelector.selectedCard = null;
        this.jobTitleSearchTerm = '';
        this.jobDescriptionSearchTerm = '';
        this.jobDescriptionHighlightFilter = '';
        this.reasonControl.setValue('');
      }
    });
    this.exchangeSubscription = this.exchange$.subscribe(e => {
      this.exchange = e;
    });
  }

  ngOnDestroy(): void {
    this.exchangeRequestModalOpenSubscription.unsubscribe();
    this.exchangeSubscription.unsubscribe();
  }
}
