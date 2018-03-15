import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Exchange, RequestExchangeAccessRequest } from 'libs/models/peer';
import { PfValidators } from 'libs/forms/validators';

import * as fromPeerMainReducer from '../../reducers/index';
import * as fromExistingCompaniesActions from '../../actions/exchange-request/existing-companies.actions';
import * as fromExchangeRequestActions from '../../actions/exchange-request.actions';
import { ExistingCompany } from '../../reducers/exchange-request/existing-companies.reducer';
import { ExchangeRequestTypeEnum } from '../../actions/exchange-request.actions';
import * as fromPeerMainReducers from '../../reducers';

@Component({
  selector: 'pf-refer-company-modal',
  templateUrl: './refer-company-modal.component.html',
  styleUrls: ['./refer-company-modal.component.scss']
})

export class ReferCompanyModalComponent implements OnInit, OnDestroy {

  exchange$: Observable<Exchange>;
  existingCompanies$: Observable<ExistingCompany[]>;
  existingCompaniesLoading$: Observable<boolean>;
  existingCompaniesLoadingError$: Observable<boolean>;
  exchangeAccessRequesting$: Observable<boolean>;
  exchangeRequestModalOpen$: Observable<boolean>;
  existingCompaniesExchangeRequestModalOpen$: Observable<boolean>;

  exchangeRequestModalOpenSubscription: Subscription;
  exchangeSubscription: Subscription;

  exchange: Exchange;
  attemptedSubmit = false;
  companySelection: ExistingCompany;
  exchangeSelectionsForm: FormGroup;
  reason = '';
  searchTerm = '';

  companyIdentifier = (company: ExistingCompany) => company ? company.CompanyId : 0;
  companyCardDisabled = (company: ExistingCompany) => company ? (company.InExchange || company.PendingInvitation) : false;

  constructor(
    private store: Store<fromPeerMainReducer.State>,
    private fb: FormBuilder
  ) {
    this.exchange$ = this.store.select(fromPeerMainReducers.getExchange);
    this.existingCompanies$ = this.store.select(fromPeerMainReducer.getExistingCompanies);
    this.existingCompaniesLoading$ = this.store.select(fromPeerMainReducer.getExistingCompaniesLoading);
    this.existingCompaniesLoadingError$ = this.store.select(fromPeerMainReducer.getExistingCompaniesLoadingError);
    this.existingCompaniesExchangeRequestModalOpen$ = this.store.select(
      fromPeerMainReducer.getExistingCompaniesExchangeRequestModalOpen
    );
    this.exchangeRequestModalOpen$ = this.store.select(fromPeerMainReducer.getExistingCompaniesExchangeRequestModalOpen);
    this.createForm();
  }

  get reasonPlaceholder(): string {
    return `Please tell us why you would like ${this.companySelection ? this.companySelection.CompanyName : ''} to
    be part of the ${this.exchange ? this.exchange.ExchangeName : ''} exchange...`;
  }
  get modalSubTitle(): string {
    return `Search for, select and invite a company to the ${this.exchange ? this.exchange.ExchangeName : ''} exchange.
            The exchange administrator will review the invitation for eligibility before approving admission.`;
  }
  get reasonControl() { return this.exchangeSelectionsForm.get('reason'); }

  createForm(): void {
    this.exchangeSelectionsForm = this.fb.group({
      'reason': [this.reason, [PfValidators.required]],
      'companySelection': [this.companySelection, [Validators.required]]
    });
  }

  handleReloadCardsEvent(): void {
    this.store.dispatch(new fromExistingCompaniesActions.LoadExistingCompanies());
  }

  handleCardSelectionEvent(company: ExistingCompany): void {
    this.reasonControl.setValue('');
    this.companySelection = company;
    this.store.dispatch(new fromExchangeRequestActions.UpdateSelection(ExchangeRequestTypeEnum.ReferPayfactorsCompany, company));
  }

  updateSearchFilter(newSearchTerm: string): void {
    this.store.dispatch(new fromExchangeRequestActions.UpdateSearchTerm(ExchangeRequestTypeEnum.ReferPayfactorsCompany, newSearchTerm));
  }

  // Modal events
  handleFormSubmit(): void {
    this.attemptedSubmit = true;
    const requestAccessModel: RequestExchangeAccessRequest = {
      ExchangeId: this.exchange ? this.exchange.ExchangeId : 0,
      Reason: this.reason,
      Type: ExchangeRequestTypeEnum.ReferPayfactorsCompany,
      TypeData: {
        CompanyId: this.companySelection.CompanyId
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
    this.exchangeRequestModalOpenSubscription = this.exchangeRequestModalOpen$.subscribe(open => {
      if (!open) {
        this.companySelection = null;
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
