import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { PfValidators } from 'libs/forms/validators/index';
import { CardSelectorComponent } from 'libs/ui/common/content/cards/card-selector/card-selector.component';
import { ExchangeRequestTypeEnum } from 'libs/models/peer/index';

import { ExchangeJobRequestCandidate } from '../../../models';
import * as fromPeerManagementReducer from '../../../reducers/index';
import * as fromSharedPeerReducer from '../../../../shared/reducers/index';
import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';

@Component({
  selector: 'pf-payfactors-job-selection-form',
  templateUrl: './pf-job-selection-form.component.html',
  styleUrls: ['./pf-job-selection-form.component.scss']
})

export class PayfactorsJobSelectionFormComponent implements OnInit, OnDestroy {
  @ViewChild(CardSelectorComponent, { static: true }) cardSelector;
  @Input() exchangeName: string;
  @Input() exchangeJobRequestForm: FormGroup;

  exchangeRequestModalOpen$: Observable<boolean>;
  exchangeRequestModalOpenSubscription: Subscription;
  payfactorsJobs$: Observable<ExchangeJobRequestCandidate[]>;
  payfactorsJobsLoading$: Observable<boolean>;
  payfactorsJobsLoadingError$: Observable<boolean>;
  payfactorsJobRequesting$: Observable<boolean>;
  noResultsMessage = 'Please change your search criteria to search again or click \'New Job\' to create a custom Exchange Job.';
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
    this.exchangeRequestModalOpen$ = this.store.select(fromPeerManagementReducer.getPfJobsExchangeRequestModalOpen);
    this.payfactorsJobs$ = this.store.select(fromPeerManagementReducer.getPfJobsExchangeRequestCandidates);
    this.payfactorsJobsLoading$ = this.store.select(fromPeerManagementReducer.getPfJobsExchangeRequestCandidatesLoading);
    this.payfactorsJobsLoadingError$ = this.store.select(fromPeerManagementReducer.getPfJobsExchangeRequestCandidatesLoadingError);
    this.payfactorsJobRequesting$ = this.store.select(fromPeerManagementReducer.getPfJobsExchangeRequestRequesting);
  }

  get reasonPlaceholder(): string {
    return `Please tell us why you would like ${this.cardSelection ? this.cardSelection.JobTitle : ''} to be part ` +
      `of the ${this.exchangeName} exchange...`;
  }
  get payfactorsJobSelectionForm(): FormGroup { return this.exchangeJobRequestForm.get('jobSelectionForm') as FormGroup; }
  get reasonControl() { return this.payfactorsJobSelectionForm.get('reason'); }
  get jobSelection() { return this.payfactorsJobSelectionForm.get('payfactorsJobSelection'); }
  get cardSelection(): ExchangeJobRequestCandidate { return this.cardSelector ? this.cardSelector.selectedCard : null; }

  applyJobSelectionForm(): void {
    this.exchangeJobRequestForm.addControl('jobSelectionForm', this.fb.group({
      'reason': [this.reason, [PfValidators.required]],
      'payfactorsJobSelection': [this.cardSelection, [Validators.required]]
    }));
  }

  handleReloadCardsEvent(): void {
    this.store.dispatch(new fromExchangeRequestActions.LoadCandidates(ExchangeRequestTypeEnum.PayfactorsJob));
  }

  handleCardSelectionEvent(): void {
    this.exchangeRequestModalOpen$.pipe(take(1)).subscribe(open =>  {
      if (open) {
        this.jobSelection.setValue(this.cardSelection);
        this.reasonControl.reset();
      }
    });
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

  ngOnInit(): void {
    this.applyJobSelectionForm();
    this.exchangeRequestModalOpenSubscription = this.exchangeRequestModalOpen$.subscribe(o => {
      if (!o) {
        this.jobTitleSearchTerm = '';
        this.jobDescriptionSearchTerm = '';
        this.jobDescriptionHighlightFilter = '';
      }
    });
  }

  ngOnDestroy() {
    this.exchangeRequestModalOpenSubscription.unsubscribe();
  }
}
