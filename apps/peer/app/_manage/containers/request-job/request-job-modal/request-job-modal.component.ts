import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Exchange, ExchangeRequestTypeEnum, RequestExchangeRequest } from 'libs/models/peer/index';

import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';
import * as fromSharedPeerReducer from '../../../../shared/reducers/index';
import * as fromPeerManagementReducer from '../../../reducers/index';

@Component({
  selector: 'pf-request-job-modal',
  templateUrl: './request-job-modal.component.html',
  styleUrls: ['./request-job-modal.component.scss']
})

export class RequestJobModalComponent implements OnInit, OnDestroy {
  exchange$: Observable<Exchange>;
  exchangeRequestSubmitting$: Observable<boolean>;
  exchangeRequestModalOpen$: Observable<boolean>;
  exchangeJobRequestForm: FormGroup;
  exchangeSubscription: Subscription;
  exchange: Exchange;
  newJobFormEnabled = false;

  constructor(
    private store: Store<fromPeerManagementReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>,
    private fb: FormBuilder
  ) {
    this.exchange$ = this.sharedPeerStore.select(fromSharedPeerReducer.getExchange);
    this.exchangeRequestSubmitting$ = this.store.select(fromPeerManagementReducer.getPfJobsExchangeRequestRequesting);
    this.exchangeRequestModalOpen$ = this.store.select(
      fromPeerManagementReducer.getPfJobsExchangeRequestModalOpen
    );
    this.createForm();
  }
  get modalSubTitle(): string {
    return `Search for and select an existing job, or create a new job that you would like added to the
            ${this.exchange ? this.exchange.ExchangeName : ''} exchange. The exchange administrator will
            determine if the job will be added to the exchange.`;
  }
  get currentChildForm(): string {
    return this.newJobFormEnabled ? 'newJobForm' : 'jobSelectionForm';
  }
  get childFormGroup(): FormGroup {
    return this.exchangeJobRequestForm.get(this.currentChildForm) as FormGroup;
  }
  createForm(): void {
    this.exchangeJobRequestForm = this.fb.group({});
  }
  // Modal events
  handleFormSubmit(): void {
    const childForm = this.childFormGroup;
    const exchangeRequestModel: RequestExchangeRequest = {
      ExchangeId: this.exchange ? this.exchange.ExchangeId : 0,
      Reason: childForm.get('reason').value,
      Type: ExchangeRequestTypeEnum.PayfactorsJob,
      TypeData: {}
    };
    if (this.newJobFormEnabled) {
      exchangeRequestModel.Type = ExchangeRequestTypeEnum.NewJob;
      exchangeRequestModel.TypeData = {
        JobTitle: childForm.get('jobTitle').value,
        JobFamily: childForm.get('jobFamily').value,
        JobLevel: childForm.get('jobLevel').value,
        JobDescription: childForm.get('jobDescription').value
      };
    } else {
      const cardSelection: any = childForm.get('payfactorsJobSelection').value;
      exchangeRequestModel.TypeData = {
        MDJobsBaseId: cardSelection ? cardSelection.MDJobsBaseId : null
      };
    }

    this.store.dispatch(new fromExchangeRequestActions.CreateExchangeRequest(
      ExchangeRequestTypeEnum.PayfactorsJob,
      exchangeRequestModel
    ));
  }

  handleModalDismissed(): void {
    this.store.dispatch(new fromExchangeRequestActions.CloseExchangeRequestModal(ExchangeRequestTypeEnum.PayfactorsJob));
    this.newJobFormEnabled = false;
  }

  handleSwitchToggled(): void {
    // Clear existing form
    this.exchangeJobRequestForm.removeControl(this.currentChildForm);

    this.newJobFormEnabled = !this.newJobFormEnabled;
    if (!this.newJobFormEnabled) {
      this.store.dispatch(new fromExchangeRequestActions.ResetExchangeRequest(ExchangeRequestTypeEnum.PayfactorsJob));
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
