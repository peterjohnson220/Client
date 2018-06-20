import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Exchange, ExchangeRequestTypeEnum, RequestExchangeRequest } from 'libs/models/peer';

import { ExistingCompany } from '../../../models';
import * as fromPeerDashboardReducer from '../../../reducers';
import * as fromSharedPeerReducer from '../../../../shared/reducers';
import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';

@Component({
  selector: 'pf-invite-company-modal',
  templateUrl: './invite-company-modal.component.html',
  styleUrls: ['./invite-company-modal.component.scss']
})

export class InviteCompanyModalComponent implements OnInit, OnDestroy {
  exchange$: Observable<Exchange>;
  exchangeCompanyRequesting$: Observable<boolean>;
  existingCompaniesExchangeRequestModalOpen$: Observable<boolean>;
  exchangeSubscription: Subscription;
  exchange: Exchange;
  requestCompanyForm: FormGroup;
  newCompanyFormEnabled = false;

  constructor(
    private store: Store<fromPeerDashboardReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>,
    private fb: FormBuilder
  ) {
    this.exchange$ = this.sharedPeerStore.select(fromSharedPeerReducer.getExchange);
    this.exchangeCompanyRequesting$ = this.store.select(fromPeerDashboardReducer.getPfCompaniesExchangeRequestRequesting);
    this.existingCompaniesExchangeRequestModalOpen$ = this.store.select(fromPeerDashboardReducer.getPfCompaniesExchangeRequestModalOpen);
    this.createForm();
  }

  get modalSubTitle(): string {
    return `Search for and select an existing company, or invite a new company that you would like added to the
            ${this.exchange ? this.exchange.ExchangeName : ''} exchange. The exchange administrator will
            determine if the company will be added to the exchange.`;
  }

  get currentChildForm(): string {
    return this.newCompanyFormEnabled ? 'newCompanyForm' : 'companySelectionForm';
  }

  get childFormGroup(): FormGroup {
    return this.requestCompanyForm.get(this.currentChildForm) as FormGroup;
  }

  createForm(): void {
    this.requestCompanyForm = this.fb.group({});
  }

  // Modal events
  handleFormSubmit(): void {
    const childForm = this.childFormGroup;
    const exchangeRequestModel: RequestExchangeRequest = {
      ExchangeId: this.exchange ? this.exchange.ExchangeId : 0,
      Reason: childForm.get('reason').value,
      Type: ExchangeRequestTypeEnum.ReferPayfactorsCompany,
      TypeData: {}
    };

    if (this.newCompanyFormEnabled) {
      exchangeRequestModel.Type = ExchangeRequestTypeEnum.ReferNewCompany;
      exchangeRequestModel.TypeData = {
        CompanyName: childForm.get('companyName').value,
        Industry: childForm.get('industry').value,
        ContactName: childForm.get('contactName').value,
        ContactJobTitle: childForm.get('contactJobTitle').value,
        EmailAddress: childForm.get('contactEmailAddress').value,
        PhoneNumber: childForm.get('contactPhoneNumber').value
      };
    } else {
      const cardSelection: ExistingCompany = childForm.get('companySelection').value;
      exchangeRequestModel.TypeData = {
        CompanyId: cardSelection ? cardSelection.CompanyId : null
      };
    }

    this.store.dispatch(new fromExchangeRequestActions.CreateExchangeRequest(
      ExchangeRequestTypeEnum.ReferPayfactorsCompany,
      exchangeRequestModel
    ));
  }

  handleModalDismissed(): void {
    this.store.dispatch(new fromExchangeRequestActions.CloseExchangeRequestModal(ExchangeRequestTypeEnum.ReferPayfactorsCompany));
    this.newCompanyFormEnabled = false;
  }

  handleSwitchToggled(): void {
    // Clear existing form
    this.requestCompanyForm.removeControl(this.currentChildForm);

    this.newCompanyFormEnabled = !this.newCompanyFormEnabled;
    if (!this.newCompanyFormEnabled) {
      this.store.dispatch(new fromExchangeRequestActions.ResetExchangeRequest(ExchangeRequestTypeEnum.ReferPayfactorsCompany));
    }
  }

  // Lifecycle Events
  ngOnInit(): void {
    this.exchangeSubscription = this.exchange$.subscribe(e => {
      this.exchange = e;
    });
  }

  ngOnDestroy(): void {
    this.exchangeSubscription.unsubscribe();
  }
}
