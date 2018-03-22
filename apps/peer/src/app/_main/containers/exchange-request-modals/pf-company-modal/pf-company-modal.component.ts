import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { PfValidators } from 'libs/forms/validators/index';
import { CardSelectorComponent } from 'libs/ui/common/content/cards/card-selector/card-selector.component';
import { Exchange, ExchangeRequestTypeEnum, ExistingCompany, RequestExchangeRequest } from 'libs/models/peer/index';

import * as fromPeerMainReducer from '../../../reducers/index';
import * as fromExchangeRequestActions from '../../../actions/exchange-request.actions';

@Component({
  selector: 'pf-invite-payfactors-company-modal',
  templateUrl: './pf-company-modal.component.html',
  styleUrls: ['./pf-company-modal.component.scss']
})

export class PayfactorsCompanyModalComponent implements OnInit, OnDestroy {
  @ViewChild(CardSelectorComponent) cardSelector;

  exchange$: Observable<Exchange>;
  existingCompanies$: Observable<ExistingCompany[]>;
  existingCompaniesLoading$: Observable<boolean>;
  existingCompaniesLoadingError$: Observable<boolean>;
  exchangeAccessRequesting$: Observable<boolean>;
  existingCompaniesExchangeRequestModalOpen$: Observable<boolean>;

  exchangeRequestModalOpenSubscription: Subscription;
  exchangeSubscription: Subscription;

  exchange: Exchange;
  attemptedSubmit = false;
  exchangeSelectionsForm: FormGroup;
  reason = '';
  searchTerm = '';

  companyIdentifier = (company: ExistingCompany) => company ? company.CompanyId : 0;
  companyCardDisabled = (company: ExistingCompany) => company ? (company.InExchange || company.PendingInvitation) : false;

  constructor(
    private store: Store<fromPeerMainReducer.State>,
    private fb: FormBuilder
  ) {
    this.exchange$ = this.store.select(fromPeerMainReducer.getExchange);
    this.existingCompanies$ = this.store.select(fromPeerMainReducer.getPfCompaniesExchangeRequestCandidates);
    this.existingCompaniesLoading$ = this.store.select(fromPeerMainReducer.getPfCompaniesExchangeRequestCandidatesLoading);
    this.existingCompaniesLoadingError$ = this.store.select(fromPeerMainReducer.getPfCompaniesExchangeRequestCandidatesLoadingError);
    this.exchangeAccessRequesting$ = this.store.select(fromPeerMainReducer.getPfCompaniesExchangeRequestRequesting);
    this.existingCompaniesExchangeRequestModalOpen$ = this.store.select(
      fromPeerMainReducer.getPfCompaniesExchangeRequestModalOpen
    );
    this.createForm();
  }

  get reasonPlaceholder(): string {
    return `Please tell us why you would like ${this.cardSelection ? this.cardSelection.CompanyName : ''} to be part ` +
           `of the ${this.exchange ? this.exchange.ExchangeName : ''} exchange...`;
  }
  get modalSubTitle(): string {
    return `Search for, select and invite a company to the ${this.exchange ? this.exchange.ExchangeName : ''} exchange.
            The exchange administrator will review the invitation for eligibility before approving admission.`;
  }
  get reasonControl() { return this.exchangeSelectionsForm.get('reason'); }
  get cardSelection(): ExistingCompany { return this.cardSelector ? this.cardSelector.selectedCard : null; }

  createForm(): void {
    this.exchangeSelectionsForm = this.fb.group({
      'reason': [this.reason, [PfValidators.required]],
      'companySelection': [this.cardSelection, [Validators.required]]
    });
  }

  handleReloadCardsEvent(): void {
    this.store.dispatch(new fromExchangeRequestActions.LoadCandidates(ExchangeRequestTypeEnum.ReferPayfactorsCompany));
  }

  handleCardSelectionEvent(): void {
    this.reasonControl.setValue('');
  }

  updateSearchFilter(newSearchTerm: string): void {
    this.store.dispatch(new fromExchangeRequestActions.UpdateSearchTerm(ExchangeRequestTypeEnum.ReferPayfactorsCompany, newSearchTerm));
  }

  // Modal events
  handleFormSubmit(): void {
    this.attemptedSubmit = true;
    const requestAccessModel: RequestExchangeRequest = {
      ExchangeId: this.exchange ? this.exchange.ExchangeId : 0,
      Reason: this.reason,
      Type: ExchangeRequestTypeEnum.ReferPayfactorsCompany,
      TypeData: {
        CompanyId: this.cardSelection ? this.cardSelection.CompanyId : null
      }
    };

    this.store.dispatch(new fromExchangeRequestActions.CreateExchangeRequest(
      ExchangeRequestTypeEnum.ReferPayfactorsCompany,
      requestAccessModel
    ));
  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.store.dispatch(new fromExchangeRequestActions.CloseExchangeRequestModal(ExchangeRequestTypeEnum.ReferPayfactorsCompany));
  }

  // Lifecycle Events
  ngOnInit(): void {
    this.exchangeRequestModalOpenSubscription = this.existingCompaniesExchangeRequestModalOpen$.subscribe(open => {
      if (!open) {
        this.cardSelector.selectedCard = null;
        this.searchTerm = '';
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
