import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { PfValidators } from 'libs/forms/validators/pf-validators';
import { ExchangeScopeApiService } from 'libs/data/payfactors-api';
import { Exchange } from 'libs/models/peer';

import * as fromExchangeScopeActions from '../../actions/exchange-scope.actions';
import * as fromPeerMapReducer from '../../reducers';

@Component({
  selector: 'pf-save-exchange-scope-modal',
  templateUrl: './save-exchange-scope-modal.component.html',
  styleUrls: ['./save-exchange-scope-modal.component.scss']
})
export class SaveExchangeScopeModalComponent {
  @Input() exchange: Exchange;
  @Output() upsertExchangeScopeEvent = new EventEmitter();

  saveExchangeScopeForm: FormGroup;
  upsertingExchangeScope$: Observable<boolean>;
  upsertingExchangeScopeError$: Observable<boolean>;
  saveExchangeScopeModalOpen$: Observable<boolean>;
  validatingScopeName = false;

  constructor(
    private store: Store<fromPeerMapReducer.State>,
    private fb: FormBuilder,
    private exchangeScopeApiService: ExchangeScopeApiService) {
    this.upsertingExchangeScope$ = this.store.select(fromPeerMapReducer.getExchangeScopeUpserting);
    this.upsertingExchangeScopeError$ = this.store.select(fromPeerMapReducer.getExchangeScopeUpsertingError);
    this.saveExchangeScopeModalOpen$ = this.store.select(fromPeerMapReducer.getSaveExchangeScopeModalOpen);
    this.createForm();
  }

  get exchangeScopeNameControl() { return this.saveExchangeScopeForm.get('exchangeScopeName'); }

  createForm(): void {
    this.saveExchangeScopeForm = this.fb.group({
      'exchangeScopeName': ['', [PfValidators.required, Validators.minLength(3)], [this.exchangeScopeNameValidator()]]
    });
  }

  handleFormSubmit(): void {
    this.upsertExchangeScopeEvent.emit(this.exchangeScopeNameControl.value);
  }

  handleModalDismissed(): void {
    this.store.dispatch(new fromExchangeScopeActions.CloseSaveExchangeScopeModal);
  }

  exchangeScopeNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      const exchangeScopeName = control.value;
      const exchangeExists = !!this.exchange;
      const exchangeId = exchangeExists ? this.exchange.ExchangeId : 0;
      const exchangeName = exchangeExists ? this.exchange.ExchangeName : '';
      this.validatingScopeName = true;
      return timer(500).pipe(
        switchMap(() => {
        return this.exchangeScopeApiService
          .validateExchangeScopeName(exchangeId, exchangeScopeName).pipe(
            map(isValid => {
              this.validatingScopeName = false;
              return isValid !== true ? {
                exchangeScopeNameExists: 'The ' + exchangeName + ' exchange already has a scope by this name'
              } : null;
            }));
      }));
    };
  }
}
