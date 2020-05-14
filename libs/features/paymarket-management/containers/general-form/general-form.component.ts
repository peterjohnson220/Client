import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DropDownFilterSettings, ComboBoxComponent, DropDownListComponent } from '@progress/kendo-angular-dropdowns';

import { AsyncStateObj } from 'libs/models/state';
import { PfValidators } from 'libs/forms/validators';
import { KendoTypedDropDownItem } from 'libs/models/kendo';
import { PayMarket } from 'libs/models';

import * as fromPayMarketManagementReducer from '../../reducers';
import * as fromGeneralFormActions from '../../actions/general-form.actions';

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

  countries$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  currencies$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  linkedPayMarkets$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;

  countriesSubscription: Subscription;
  currenciesSubscription: Subscription;

  payMarketForm: FormGroup;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };
  payMarket: PayMarket;
  countries: KendoTypedDropDownItem[];
  currencies: KendoTypedDropDownItem[];
  hasLinkedPayMarket: boolean;

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
    this.store.dispatch(new fromGeneralFormActions.GetCountries());
    this.store.dispatch(new fromGeneralFormActions.GetCurrencies());
    this.loadLinkedPayMarkets();
  }

  ngOnDestroy(): void {
    this.countriesSubscription.unsubscribe();
    this.currenciesSubscription.unsubscribe();
  }

  handleCountryChange(countryCode: string): void {
    const country = this.countries.find(c => c.Value === countryCode);
    if (country) {
      const parsedCountryCurrency: string[] = country.Name.split('-');
      if (parsedCountryCurrency && parsedCountryCurrency.length === 2) {
        this.updateCurrencyCode(parsedCountryCurrency[1].trim());
      }
    }
  }

  handleLinkedPayMarketChange(payMarketId: number): void {
    this.hasLinkedPayMarket = !!payMarketId;
    if (!payMarketId) {
      this.payMarketForm.controls['ShowInLinkedStructure'].setValue(false);
    }
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
    let selectedValue = this.DEFAULT_COUNTRY;
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

  private loadLinkedPayMarkets(): void {
    const payMarketId = this.payMarket ? this.payMarket.CompanyPayMarketId : 0;
    this.store.dispatch(new fromGeneralFormActions.GetLinkedPayMarkets({ payMarketId }));
  }
}
