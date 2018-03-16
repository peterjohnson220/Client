import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AutoCompleteComponent } from '@progress/kendo-angular-dropdowns';

import { AvailableExchangeItem, ExchangeRequestTypeEnum, RequestExchangeRequest } from 'libs/models/peer';
import { PfValidators } from 'libs/forms/validators';
import { CompanyOption, PfConstants } from 'libs/models/common';

import * as fromPeerMainReducer from '../../reducers/index';
import * as fromExchangeAccessActions from '../../actions/exchange-access/exchange-access.actions';
import * as fromAvailableExchangesActions from '../../actions/exchange-access/available-exchanges.actions';
import * as fromPeerParticipantsActions from '../../actions/exchange-access/peer-participants.actions';

@Component({
  selector: 'pf-request-exchange-access-modal',
  templateUrl: './request-exchange-access-modal.component.html',
  styleUrls: ['./request-exchange-access-modal.component.scss']
})

export class RequestExchangeAccessModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('list') list: AutoCompleteComponent;

  filterChangeSubscription: Subscription;
  exchangeSelectionSubscription: Subscription;
  availableExchanges$: Observable<AvailableExchangeItem[]>;
  exchangeSelection$: Observable<AvailableExchangeItem>;
  peerParticipants$: Observable<CompanyOption[]>;
  availableExchangesLoading$: Observable<boolean>;
  peerParticipantsLoading$: Observable<boolean>;
  exchangeAccessRequesting$: Observable<boolean>;
  exchangeAccessModalOpen$: Observable<boolean>;
  exchangeAccessRequestingError$: Observable<boolean>;
  availableExchangesLoadingError$: Observable<boolean>;
  exchangeSelection: AvailableExchangeItem;
  exchangeSelectionsForm: FormGroup;
  reason = '';
  searchTerm = '';
  companyNameFilter = '';
  attemptedSubmit = false;
  subTitle = `Search for and select an Exchange you would like access to. Please provide a reason for the access
              request and the Exchange administrator will review your eligibility.`;

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
    this.peerParticipantsLoading$ = this.store.select(fromPeerMainReducer.getPeerParticipantsLoading);
    this.exchangeSelection$ = this.store.select(fromPeerMainReducer.getAvailableExchangeSelection);

    this.createForm();
  }

  get reasonPlaceholder(): string {
    return 'Please tell us why you would like access to the ' + this.exchangeSelection.ExchangeName + ' exchange...';
  }

  createForm(): void {
    this.exchangeSelectionsForm = this.fb.group({
      'reason': [this.reason, [PfValidators.required]],
      'exchangeSelection': [this.exchangeSelection, [Validators.required]]
    });
  }

  handleSelectedCompanyChangeEvent(selectedCompanyName: string): void {
    this.companyNameFilter = selectedCompanyName;
    // Kendo auto complete doesn't support supplying a textField so we have to use the company name for the value. [JP]
    this.peerParticipants$.take(1).subscribe(peers => {
      const selectedCompany: CompanyOption = peers.find(p => p.Name === selectedCompanyName);
      const selectedCompanyId = selectedCompany ? selectedCompany.CompanyId : null;
      this.store.dispatch(new fromAvailableExchangesActions.UpdateCompanyFilter(selectedCompanyId));
    });
  }

  handleAvailableExchangeSelectionEvent(exchange: AvailableExchangeItem): void {
    this.store.dispatch(new fromAvailableExchangesActions.SelectAvailableExchange(exchange));
  }

  updateSearchFilter(newSearchTerm: string): void {
    this.store.dispatch(new fromAvailableExchangesActions.UpdateSearchTerm(newSearchTerm));
  }

  loadAvailableExchanges(): void {
    this.store.dispatch(new fromAvailableExchangesActions.LoadAvailableExchanges);
  }

  // Modal events
  handleFormSubmit(): void {
    this.attemptedSubmit = true;
    const requestAccessModel: RequestExchangeRequest = {
      ExchangeId: this.exchangeSelection.ExchangeId,
      Reason: this.reason,
      Type: ExchangeRequestTypeEnum.Access,
      TypeData: null
    };
    this.store.dispatch(new fromExchangeAccessActions.ExchangeAccessRequest(requestAccessModel));
  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.searchTerm = '';
    this.companyNameFilter = '';
    this.list.reset();
    this.store.dispatch(new fromExchangeAccessActions.CloseExchangeAccessModal);
  }

  // Lifecycle Events
  ngOnInit(): void {
    this.exchangeSelectionSubscription = this.exchangeSelection$.subscribe(selection => {
      this.exchangeSelection = selection;
      this.reason = '';
    });
  }

  ngOnDestroy(): void {
    this.filterChangeSubscription.unsubscribe();
    this.exchangeSelectionSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.filterChangeSubscription = this.list.filterChange.asObservable().debounceTime(PfConstants.DEBOUNCE_DELAY).distinctUntilChanged()
      .subscribe(searchTerm => {
      this.store.dispatch(new fromPeerParticipantsActions.LoadPeerParticipants(searchTerm));
    });
  }
}
