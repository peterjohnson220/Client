import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AvailableExchangeItem } from 'libs/models/peer';

import * as fromPeerMainReducer from '../../reducers/index';
import * as fromExchangeAccessActions from '../../actions/exchange-access/exchange-access.actions';
import * as fromAvailableExchangesActions from '../../actions/exchange-access/available-exchanges.actions';
import { PfValidators } from '../../../../../../../libs/forms/validators';
import { CompanyOption } from '../../../../../../../libs/models/common';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'pf-request-exchange-access-modal',
  templateUrl: './request-exchange-access-modal.component.html',
  styleUrls: ['./request-exchange-access-modal.component.scss']
})

export class RequestExchangeAccessModalComponent implements OnInit, OnDestroy {
  availableExchangesLoading$: Observable<boolean>;
  availableExchangesLoadingError$: Observable<boolean>;
  availableExchanges$: Observable<AvailableExchangeItem[]>;
  exchangeAccessModalOpen$: Observable<boolean>;
  exchangeAccessRequesting$: Observable<boolean>;
  exchangeAccessRequestingError$: Observable<boolean>;
  peerParticipants$: Observable<CompanyOption[]>;
  selectedCompanyId: number;

  exchangeSelectionsForm: FormGroup;
  searchTerm = '';
  attemptedSubmit = false;
  selectedExchange: AvailableExchangeItem;
  reason = '';
  subTitle = `Search for, select and submit a request to be added to a Peer Exchange. The Exchange administrator
              will review eligibility and send a communication with their decision`;

  constructor(
    private store: Store<fromPeerMainReducer.State>,
    private fb: FormBuilder
  ) {
    this.availableExchanges$ = this.store.select(fromPeerMainReducer.getAvailableExchanges);
    this.availableExchangesLoading$ = this.store.select(fromPeerMainReducer.getAvailableExchangesLoading);
    this.availableExchangesLoadingError$ = this.store.select(fromPeerMainReducer.getAvailableExchangesLoadingError);
    this.exchangeAccessModalOpen$ = this.store.select(fromPeerMainReducer.getExchangeAccessModalOpen);
    this.exchangeAccessRequesting$ = this.store.select(fromPeerMainReducer.getExchangeAccessRequesting);
    this.exchangeAccessRequestingError$ = this.store.select(fromPeerMainReducer.getExchangeAccessRequestingError);
    this.peerParticipants$ = this.store.select(fromPeerMainReducer.getPeerParticipants);
    this.createForm();
  }

  get selectedCompanies(): string {
    return this.selectedExchange ? this.selectedExchange.Companies.join(', ') : '';
  }

  createForm(): void {
    this.exchangeSelectionsForm = this.fb.group({
      'reason': [this.reason, [PfValidators.required]]
    });
  }

  handleSelectedCompanyChangeEvent(selectedCompany: CompanyOption): void {
    console.log('handleSelectedCompanyChangeEvent! - ', selectedCompany);
    const selection = selectedCompany ? selectedCompany.CompanyId : null;
    this.store.dispatch(new fromExchangeAccessActions.UpdateCompanyFilter(selection));
  }
  handleAvailableExchangeSelection(exchange: AvailableExchangeItem): void {
    console.log('handleAvailableExchangeSelection! - ', exchange);
    const selectedExchange = this.selectedExchange;
    const exchangeSelected = !!selectedExchange && selectedExchange.ExchangeId === exchange.ExchangeId;
    this.selectedExchange = exchangeSelected  ? null : exchange;
  }

  // Modal events
  handleFormSubmit(): void {
    this.attemptedSubmit = true;
    const requestAccessModel: any = {
      ExchangeId: this.selectedExchange.ExchangeId,
      Reason: this.reason
    };
    this.store.dispatch(new fromExchangeAccessActions.ExchangeAccessRequest(requestAccessModel));
  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.searchTerm = '';
    this.selectedExchange = null;
    this.store.dispatch(new fromExchangeAccessActions.CloseExchangeAccessModal);
    // TODO: Effects to clear filters and selection
    // this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.AvailableCompanies));
  }

  updateSearchFilter(newSearchTerm: string): void {
    this.store.dispatch(new fromExchangeAccessActions.UpdateSearchTerm(newSearchTerm));
  }

  loadAvailableExchanges(): void {
    const payload = {
      SearchTerm: this.searchTerm,
      CompanyId: this.selectedCompanyId
    };
    this.store.dispatch(new fromAvailableExchangesActions.LoadAvailableExchanges(payload));
  }

  // Lifecycle Events
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
