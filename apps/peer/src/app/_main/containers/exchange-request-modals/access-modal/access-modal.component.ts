import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { AutoCompleteComponent } from '@progress/kendo-angular-dropdowns';

import { CardSelectorComponent } from 'libs/ui/common/content/cards/card-selector/card-selector.component';
import {
  AvailableExchangeItem, ExchangeRequestTypeEnum, CompanyOption,
  RequestExchangeRequest, PfConstants
} from 'libs/models';
import { PfValidators } from 'libs/forms/validators';

import * as fromPeerMainReducer from '../../../reducers/index';
import * as fromExchangeRequestActions from '../../../actions/exchange-request.actions';
import * as fromPeerParticipantsActions from '../../../actions/peer-participants.actions';

@Component({
  selector: 'pf-access-exchange-request-modal',
  templateUrl: './access-modal.component.html',
  styleUrls: ['./access-modal.component.scss']
})

export class AccessModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('list') list: AutoCompleteComponent;
  @ViewChild(CardSelectorComponent) cardSelector;

  exchangeRequestCandidates$: Observable<AvailableExchangeItem[]>;
  peerParticipants$: Observable<CompanyOption[]>;

  exchangeRequestCandidatesLoading$: Observable<boolean>;
  exchangeRequestCandidatesLoadingError$: Observable<boolean>;
  accessExchangeRequestModalOpen$: Observable<boolean>;
  accessExchangeRequesting$: Observable<boolean>;
  peerParticipantsLoading$: Observable<boolean>;

  accessExchangeRequestModalOpenSubscription: Subscription;
  filterChangeSubscription: Subscription;

  exchangeSelectionsForm: FormGroup;
  attemptedSubmit = false;
  companyNameFilter = '';
  reason = '';
  searchTerm = '';
  modalSubTitle = `Search for and select an Exchange you would like access to. Please provide a reason for the access
              request and the Exchange administrator will review your eligibility.`;

  exchangeIdentifier = (e: AvailableExchangeItem) => e ? e.ExchangeId : 0;
  exchangeCardDisabled = (e: AvailableExchangeItem) => e ? (e.InExchange || e.PendingAccess) : false;

  constructor(
    private store: Store<fromPeerMainReducer.State>,
    private fb: FormBuilder
  ) {
    this.exchangeRequestCandidates$ = this.store.select(fromPeerMainReducer.getAccessExchangeRequestCandidates);
    this.exchangeRequestCandidatesLoading$ = this.store.select(fromPeerMainReducer.getAccessExchangeRequestCandidatesLoading);
    this.exchangeRequestCandidatesLoadingError$ = this.store.select(fromPeerMainReducer.getAccessExchangeRequestCandidatesLoadingError);
    this.accessExchangeRequestModalOpen$ = this.store.select(fromPeerMainReducer.getAccessExchangeRequestModalOpen);
    this.accessExchangeRequesting$ = this.store.select(fromPeerMainReducer.getAccessExchangeRequestRequesting);
    this.peerParticipants$ = this.store.select(fromPeerMainReducer.getPeerParticipants);
    this.peerParticipantsLoading$ = this.store.select(fromPeerMainReducer.getPeerParticipantsLoading);

    this.createForm();
  }

  get reasonPlaceholder(): string {
    const exchangeName = this.cardSelection ? this.cardSelection.ExchangeName : '';
    return `Please tell us why you would like access to the ${exchangeName} exchange...`;
  }
  get reasonControl() { return this.exchangeSelectionsForm.get('reason'); }
  get cardSelection(): AvailableExchangeItem { return this.cardSelector ? this.cardSelector.selectedCard : null; }

  createForm(): void {
    this.exchangeSelectionsForm = this.fb.group({
      'reason': [this.reason, [PfValidators.required]],
      'cardSelection': [this.cardSelection, [Validators.required]]
    });
  }

  handleReloadCardsEvent(): void {
    this.store.dispatch(new fromExchangeRequestActions.LoadCandidates(ExchangeRequestTypeEnum.Access));
  }

  handleSelectedCompanyChangeEvent(selectedCompanyName: string): void {
    this.companyNameFilter = selectedCompanyName;
    // Kendo auto complete doesn't support supplying a textField so we have to use the company name for the value. [JP]
    this.peerParticipants$.take(1).subscribe(peers => {
      const selectedCompany: CompanyOption = peers.find(p => p.Name === selectedCompanyName);
      const selectedCompanyId = selectedCompany ? selectedCompany.CompanyId : null;
      const filterOptions = {
        companyFilterId: selectedCompanyId
      };
      this.store.dispatch(new fromExchangeRequestActions.UpdateFilterOptions(ExchangeRequestTypeEnum.Access, filterOptions));
    });
  }

  handleCardSelectionEvent(): void {
    this.reasonControl.setValue('');
  }

  updateSearchFilter(newSearchTerm: string): void {
    this.store.dispatch(new fromExchangeRequestActions.UpdateSearchTerm(ExchangeRequestTypeEnum.Access, newSearchTerm));
  }

  // Modal events
  handleFormSubmit(): void {
    this.attemptedSubmit = true;
    const requestAccessModel: RequestExchangeRequest = {
      ExchangeId: this.cardSelection ? this.cardSelection.ExchangeId : 0,
      Reason: this.reason,
      Type: ExchangeRequestTypeEnum.Access,
      TypeData: null
    };

    this.store.dispatch(new fromExchangeRequestActions.CreateExchangeRequest(
      ExchangeRequestTypeEnum.Access,
      requestAccessModel
    ));
  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.companyNameFilter = '';
    this.list.reset();
    this.store.dispatch(new fromExchangeRequestActions.CloseExchangeRequestModal(ExchangeRequestTypeEnum.Access));
  }

  // Lifecycle Events
  ngOnInit(): void {
    this.accessExchangeRequestModalOpenSubscription = this.accessExchangeRequestModalOpen$.subscribe(open => {
      if (!open) {
        this.cardSelector.selectedCard = null;
        this.searchTerm = '';
        this.reasonControl.setValue('');
      }
    });
  }

  ngOnDestroy(): void {
    this.accessExchangeRequestModalOpenSubscription.unsubscribe();
    this.filterChangeSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.filterChangeSubscription = this.list.filterChange.asObservable().debounceTime(PfConstants.DEBOUNCE_DELAY).distinctUntilChanged()
      .subscribe(searchTerm => {
        this.store.dispatch(new fromPeerParticipantsActions.LoadPeerParticipants(searchTerm));
      });
  }
}
