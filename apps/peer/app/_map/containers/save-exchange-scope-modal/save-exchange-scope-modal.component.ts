import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { PfValidators } from 'libs/forms/validators/pf-validators';
import { ExchangeScopeApiService } from 'libs/data/payfactors-api';
import { Exchange } from 'libs/models/peer';
import { GenericKeyValue, GenericMenuItem } from 'libs/models/common';
import * as fromExchangeExplorerReducer from 'libs/features/peer/exchange-explorer/reducers';

import * as fromSaveExchangeScopeActions from '../../actions/save-exchange-scope.actions';
import * as fromPeerMapReducer from '../../reducers';

@Component({
  selector: 'pf-save-exchange-scope-modal',
  templateUrl: './save-exchange-scope-modal.component.html',
  styleUrls: ['./save-exchange-scope-modal.component.scss']
})
export class SaveExchangeScopeModalComponent implements OnInit, OnDestroy {
  @Input() exchange: Exchange;
  @Output() upsertExchangeScopeEvent = new EventEmitter();

  upsertingExchangeScope$: Observable<boolean>;
  upsertingExchangeScopeError$: Observable<boolean>;
  saveExchangeScopeModalOpen$: Observable<boolean>;
  parentPayMarketOptionsLoading$: Observable<boolean>;
  parentPayMarketOptions$: Observable<GenericKeyValue<number, string>[]>;

  saveExchangeScopeModalOpenSub: Subscription;
  parentPayMarketOptionsSub: Subscription;

  saveExchangeScopeForm: FormGroup;
  selectedParentPayMarketOptions: GenericMenuItem[];
  parentPayMarketOptions: GenericMenuItem[];
  validatingScopeName = false;

  constructor(
    private store: Store<fromPeerMapReducer.State>,
    private fb: FormBuilder,
    private exchangeScopeApiService: ExchangeScopeApiService) {
    this.upsertingExchangeScope$ = this.store.pipe(select(fromExchangeExplorerReducer.getExchangeScopeUpserting));
    this.upsertingExchangeScopeError$ = this.store.pipe(select(fromExchangeExplorerReducer.getExchangeScopeUpsertingError));
    this.saveExchangeScopeModalOpen$ = this.store.pipe(select(fromPeerMapReducer.getSaveExchangeScopeModalOpen));
    this.parentPayMarketOptions$ = this.store.pipe(select(fromPeerMapReducer.getSaveExchangeScopeParentPayMarketOptions));
    this.parentPayMarketOptionsLoading$ = this.store.pipe(select(fromPeerMapReducer.getSaveExchangeScopeParentPayMarketOptionsLoading));
    this.createForm();
  }

  get exchangeScopeNameControl() { return this.saveExchangeScopeForm.get('exchangeScopeName'); }
  get exchangeScopeDescriptionControl() { return this.saveExchangeScopeForm.get('exchangeScopeDescription'); }
  get isDefaultScopeControl() { return this.saveExchangeScopeForm.get('isDefaultScope'); }

  get descriptionPlaceholder(): string {
    return `Add a brief description about the Exchange Scope you are creating...`;
  }

  createForm(): void {
    this.saveExchangeScopeForm = this.fb.group({
      'exchangeScopeName': ['', [PfValidators.required, Validators.minLength(3)], [this.exchangeScopeNameValidator()]],
      'exchangeScopeDescription': [''],
      'isDefaultScope': [false]
    });
  }

  handleFormSubmit(): void {
    const selectedPayMarketIds = !!this.selectedParentPayMarketOptions?.length ? this.selectedParentPayMarketOptions.map(mi => +mi.Value) : [];
    this.upsertExchangeScopeEvent.emit({
      Name: this.exchangeScopeNameControl.value,
      Description: this.exchangeScopeDescriptionControl.value,
      IsDefault: this.isDefaultScopeControl.value,
      CompanyPayMarketIdsToDefaultFor: selectedPayMarketIds
    });
  }

  handleModalDismissed(): void {
    this.store.dispatch(new fromSaveExchangeScopeActions.CloseSaveExchangeScopeModal);
    this.selectedParentPayMarketOptions = [];
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

  // Life-cycle Events
  ngOnInit(): void {
    this.saveExchangeScopeModalOpenSub = this.saveExchangeScopeModalOpen$.subscribe(open => {
      if (!!open) {
        this.store.dispatch(new fromSaveExchangeScopeActions.LoadParentPayMarkets());
      }
    });

    this.parentPayMarketOptionsSub = this.parentPayMarketOptions$.subscribe(ppmo => {
      this.parentPayMarketOptions = ppmo?.map(pm => ({DisplayName: pm.Value, Value: pm.Key.toString(), IsSelected: false}));
    });
  }

  ngOnDestroy(): void {
    this.saveExchangeScopeModalOpenSub.unsubscribe();
    this.parentPayMarketOptionsSub.unsubscribe();
  }
}
