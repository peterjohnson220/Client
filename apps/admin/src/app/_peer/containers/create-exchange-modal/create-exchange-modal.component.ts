import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { PfValidators } from 'libs/forms/validators/pf-validators';
import { UpsertExchangeRequest } from 'libs/models/peer/index';

import * as fromExchangeListActions from '../../actions/exchange-list.actions';
import * as fromPeerAdminReducer from '../../reducers';

@Component({
  selector: 'pf-create-exchange-modal',
  templateUrl: './create-exchange-modal.component.html',
  styleUrls: ['./create-exchange-modal.component.scss']
})
export class CreateExchangeModalComponent implements OnInit, OnDestroy {
  createExchangeForm: FormGroup;
  errorSubscription: Subscription;
  errorMessageSubscription: Subscription;
  errorValidationMessage: string;
  attemptedSubmit = false;
  creatingExchange$: Observable<boolean>;
  createExchangeModalOpen$: Observable<boolean>;
  private creatingExchangeError$: Observable<boolean>;
  private creatingExchangeErrorMessage$: Observable<string>;

  constructor(private store: Store<fromPeerAdminReducer.State>, private fb: FormBuilder) {
    this.creatingExchange$ = this.store.select(fromPeerAdminReducer.getExchangeListUpserting);
    this.creatingExchangeError$ = this.store.select(fromPeerAdminReducer.getExchangeListUpsertingError);
    this.creatingExchangeErrorMessage$ = this.store.select(fromPeerAdminReducer.getExchangeListUpsertingErrorMessage);
    this.createExchangeModalOpen$ = this.store.select(fromPeerAdminReducer.getExchangeListCreateExchangeModalOpen);
    this.createForm();
  }

  get name() { return this.createExchangeForm.get('name'); }

  createForm(): void {
    this.createExchangeForm = this.fb.group({
      'name': ['', [PfValidators.required]]
    });
  }

  handleFormSubmit(): void {
    this.attemptedSubmit = true;
    const newExchange: UpsertExchangeRequest = {
      ExchangeId: 0,
      ExchangeName: this.name.value,
      CompanyIds: []
    };
    this.store.dispatch(new fromExchangeListActions.UpsertingExchange(newExchange));
  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.store.dispatch(new fromExchangeListActions.CloseCreateExchangeModal);
  }

  // Lifecycle
  ngOnInit(): void {
    this.errorMessageSubscription = this.creatingExchangeErrorMessage$.subscribe(errorMessage => {
      this.errorValidationMessage = errorMessage;
    });
    this.errorSubscription = this.creatingExchangeError$.subscribe(error => {
      if (error) {
        this.name.setErrors({'error': this.errorValidationMessage});
      }
    });
  }

  ngOnDestroy(): void {
    this.errorMessageSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
