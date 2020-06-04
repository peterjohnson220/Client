import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DropDownFilterSettings, ComboBoxComponent, DropDownListComponent } from '@progress/kendo-angular-dropdowns';

import { AsyncStateObj } from 'libs/models/state';
import { PfValidators } from 'libs/forms/validators';
import { KendoTypedDropDownItem } from 'libs/models/kendo';
import { PayMarket, DefaultUserPayMarket } from 'libs/models';

import * as fromPayMarketManagementReducer from '../../reducers';
import * as fromGeneralFormActions from '../../actions/general-form.actions';
import { MarketDataScopeComponent } from '../market-data-scope';

@Component({
  selector: 'pf-general-form',
  templateUrl: './general-form.component.html',
  styleUrls: ['./general-form.component.scss']
})
export class GeneralFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() reset: boolean;

  @ViewChild('linkedPayMarketCombobox', { static: true }) public linkedPayMarketCombobox: ComboBoxComponent;
  @ViewChild('countryComponent', { static: true }) public countryComponent: DropDownListComponent;
  @ViewChild('currencyComponent', { static: true }) public currencyComponent: DropDownListComponent;
  @ViewChild('mdScopeComponent', { static: true }) public mdScopeComponent: MarketDataScopeComponent;

  countries$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  currencies$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  linkedPayMarkets$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  defaultPayMarket$: Observable<AsyncStateObj<DefaultUserPayMarket>>;

  countriesSubscription: Subscription;
  currenciesSubscription: Subscription;
  defaultPayMarketSubscription: Subscription;

  payMarketForm: FormGroup;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };
  payMarket: PayMarket;
  countries: KendoTypedDropDownItem[];
  currencies: KendoTypedDropDownItem[];
  hasLinkedPayMarket: boolean;
  defaultPayMarket: DefaultUserPayMarket;

  readonly DEFAULT_MAX_LENGTH = 255;
  readonly DEFAULT_COUNTRY = 'USA';
  readonly DEFAULT_CURRENCY = 'USD';

  constructor(
    private store: Store<fromPayMarketManagementReducer.State>,
    private formBuilder: FormBuilder
  ) {
    this.countries$ = this.store.select(fromPayMarketManagementReducer.getCountries);
    this.currencies$ = this.store.select(fromPayMarketManagementReducer.getCurrencies);
    this.linkedPayMarkets$ = this.store.select(fromPayMarketManagementReducer.getLinkedPayMarkets);
    this.defaultPayMarket$ = this.store.select(fromPayMarketManagementReducer.getDefaultPayMarket);
  }

  get f() { return this.payMarketForm.controls; }

  get isNotValid(): boolean {
    return !this.payMarketForm.valid || !(this.payMarketForm.dirty || this.payMarketForm.touched);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.reset && changes.reset.currentValue) {
      this.resetForm();
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.initSubscriptions();
    this.store.dispatch(new fromGeneralFormActions.GetCurrencies());
    this.loadDefaultPayMarket();
    this.loadLinkedPayMarkets();
  }

  ngOnDestroy(): void {
    this.countriesSubscription.unsubscribe();
    this.currenciesSubscription.unsubscribe();
    this.defaultPayMarketSubscription.unsubscribe();
  }

  refresh(): void {
    this.loadDefaultPayMarket();
  }

  handleCountryChange(countryCode: string): void {
    const country = this.countries.find(c => c.Value === countryCode);
    if (country) {
      const parsedCountryCurrency: string[] = country.Name.split('-');
      if (parsedCountryCurrency && parsedCountryCurrency.length === 2) {
        this.updateCurrencyCode(parsedCountryCurrency[1].trim());
      }
      this.mdScopeComponent.updateLocationsByCountryCode(countryCode);
    }
  }

  handleLinkedPayMarketChange(payMarketId: number): void {
    this.hasLinkedPayMarket = !!payMarketId;
    if (!payMarketId) {
      this.payMarketForm.controls['ShowInLinkedStructure'].setValue(false);
    }
  }

  private initSubscriptions(): void {
    this.defaultPayMarketSubscription = this.defaultPayMarket$.subscribe(asyncObj => {
      if (!!asyncObj && !asyncObj.loading && !!asyncObj.obj) {
        this.defaultPayMarket = asyncObj.obj;
        if (!this.countries || this.countries.length === 0) {
          this.loadCountries();
        } else {
          this.updateCountryControl();
          this.handleCountryChange(this.defaultPayMarket.CountryCode);
        }
      }
    });
    this.countriesSubscription = this.countries$.subscribe(results => {
      if (results && !!results.obj) {
        this.countries = results.obj;
        this.updateCountryControl();
      }
    });
    this.currenciesSubscription = this.currencies$.subscribe(results => {
      if (results && !!results.obj) {
        this.currencies = results.obj;
        this.updateCurrencyCode(this.DEFAULT_CURRENCY);
      }
    });
  }

  private createForm(): void {
    this.payMarketForm = this.formBuilder.group({
      PayMarketName: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]],
      LinkedPayMarket: null,
      LinkedPayMarketAdj: null,
      CountryCode: [null, PfValidators.required],
      CurrencyCode: [null, PfValidators.required],
      ShowInLinkedStructure: false
    });
  }

  private resetForm(): void {
    if (!this.payMarketForm) {
      return;
    }
    this.payMarketForm.reset({
      PayMarketName: '',
      LinkedPayMarket: '',
      LinkedPayMarketAdj: null,
      CountryCode: this.DEFAULT_COUNTRY,
      CurrencyCode: this.DEFAULT_CURRENCY,
      ShowInLinkedStructure: false
    });
    this.linkedPayMarketCombobox.filterChange.emit('');
    this.countryComponent.filterChange.emit('');
    this.currencyComponent.filterChange.emit('');
    this.hasLinkedPayMarket = false;
  }

  private updateCountryControl(): void {
    const countryControl = this.payMarketForm.controls['CountryCode'];
    let selectedValue = this.defaultPayMarket && !!this.defaultPayMarket.CountryCode
      ? this.defaultPayMarket.CountryCode
      : this.DEFAULT_COUNTRY;
    if (!!this.payMarket && this.payMarket.CountryCode) {
      selectedValue = this.payMarket.CountryCode;
    }
    countryControl.setValue(selectedValue);
  }

  private updateCurrencyCode(currencyCode: string): void {
    const currenciesControl = this.payMarketForm.controls['CurrencyCode'];
    let selectedValue = this.currencies.find(c => c.Value === currencyCode)
      ? currencyCode
      : this.DEFAULT_CURRENCY;
    if (!!this.payMarket && this.payMarket.CurrencyCode) {
      selectedValue = this.payMarket.CurrencyCode;
    }
    currenciesControl.setValue(selectedValue);
  }

  private loadDefaultPayMarket(): void {
    this.store.dispatch(new fromGeneralFormActions.GetDefaultUserPayMarket());
  }

  private loadCountries(): void {
    this.store.dispatch(new fromGeneralFormActions.GetCountries());
  }

  private loadLinkedPayMarkets(): void {
    const payMarketId = this.payMarket ? this.payMarket.CompanyPayMarketId : 0;
    this.store.dispatch(new fromGeneralFormActions.GetLinkedPayMarkets({ payMarketId }));
  }

}
