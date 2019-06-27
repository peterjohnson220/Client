import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';


import { PfValidators } from 'libs/forms/validators';
import { CardSelectorComponent } from 'libs/ui/common/content/cards/card-selector/card-selector.component';
import { Exchange, ExchangeRequestTypeEnum } from 'libs/models/peer';

import * as fromPeerDashboardReducer from '../../../reducers';
import { ExistingCompany } from '../../../models';
import * as fromSharedPeerReducer from '../../../../shared/reducers';
import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';

@Component({
  selector: 'pf-existing-company-selection-form',
  templateUrl: './existing-company-selection-form.component.html',
  styleUrls: ['./existing-company-selection-form.component.scss']
})

export class ExistingCompanySelectionFormComponent implements OnInit, OnDestroy {
  @ViewChild(CardSelectorComponent, { static: true }) cardSelector;
  @Input() exchange: Exchange;
  @Input() requestCompanyForm: FormGroup;
  @Input() showing: boolean;

  existingCompanies$: Observable<ExistingCompany[]>;
  existingCompaniesLoading$: Observable<boolean>;
  existingCompaniesLoadingError$: Observable<boolean>;
  existingCompaniesExchangeRequestModalOpen$: Observable<boolean>;
  exchangeRequestModalOpenSubscription: Subscription;
  noResultsMessage = 'Please change your search criteria to search again or click \'New Company\' to invite a new company.';
  reason = '';
  searchTerm = '';

  companyIdentifier = (company: ExistingCompany) => company ? company.CompanyId : 0;
  companyCardDisabled = (company: ExistingCompany) => company ? (company.InExchange || company.PendingInvitation) : false;

  constructor(
    private store: Store<fromPeerDashboardReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>,
    private fb: FormBuilder
  ) {
    this.existingCompanies$ = this.store.select(fromPeerDashboardReducer.getPfCompaniesExchangeRequestCandidates);
    this.existingCompaniesLoading$ = this.store.select(fromPeerDashboardReducer.getPfCompaniesExchangeRequestCandidatesLoading);
    this.existingCompaniesLoadingError$ = this.store.select(fromPeerDashboardReducer.getPfCompaniesExchangeRequestCandidatesLoadingError);
    this.existingCompaniesExchangeRequestModalOpen$ = this.store.select(
      fromPeerDashboardReducer.getPfCompaniesExchangeRequestModalOpen
    );
  }

  get reasonPlaceholder(): string {
    return `Please tell us why you would like ${this.cardSelection ? this.cardSelection.CompanyName : ''} to be part ` +
      `of the ${this.exchange ? this.exchange.ExchangeName : ''} exchange...`;
  }
  get companySelectionForm(): FormGroup { return this.requestCompanyForm.get('companySelectionForm') as FormGroup; }
  get reasonControl() { return this.companySelectionForm.get('reason'); }
  get companySelectionControl() { return this.companySelectionForm.get('companySelection'); }
  get cardSelection(): ExistingCompany { return this.cardSelector ? this.cardSelector.selectedCard : null; }

  applyCompanySelectionForm(): void {
    this.requestCompanyForm.addControl('companySelectionForm', this.fb.group({
      'reason': [this.reason, [PfValidators.required]],
      'companySelection': [this.cardSelection, [Validators.required]]
    }));
  }

  handleReloadCardsEvent(): void {
    this.store.dispatch(new fromExchangeRequestActions.LoadCandidates(ExchangeRequestTypeEnum.ReferPayfactorsCompany));
  }

  handleCardSelectionEvent(): void {
    this.companySelectionControl.setValue(this.cardSelection);
    this.reasonControl.reset();
  }

  updateSearchFilter(newSearchTerm: string): void {
    this.store.dispatch(new fromExchangeRequestActions.UpdateSearchTerm(ExchangeRequestTypeEnum.ReferPayfactorsCompany, newSearchTerm));
  }

  // Lifecycle Events
  ngOnInit(): void {
    this.applyCompanySelectionForm();
    this.exchangeRequestModalOpenSubscription = this.existingCompaniesExchangeRequestModalOpen$.subscribe(open => {
      if (!open) {
        this.searchTerm = '';
      }
    });
  }

  ngOnDestroy(): void {
    this.exchangeRequestModalOpenSubscription.unsubscribe();
  }
}
