import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DropDownFilterSettings, ComboBoxComponent, DropDownListComponent } from '@progress/kendo-angular-dropdowns';

import { AsyncStateObj } from 'libs/models/state';
import { PfValidators } from 'libs/forms/validators';
import { KendoTypedDropDownItem } from 'libs/models/kendo';
import { PayMarket, PayMarketWithMdScope } from 'libs/models';

import * as fromPayMarketManagementReducer from '../../reducers';
import * as fromGeneralFormActions from '../../actions/general-form.actions';
import * as fromPayMarketModalActions from '../../actions/paymarket-modal.actions';
import { MarketDataScopeComponent } from '../market-data-scope';

@Component({
  selector: 'pf-general-form',
  templateUrl: './general-form.component.html',
  styleUrls: ['./general-form.component.scss']
})
export class GeneralFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() reset: boolean;
  @Input() companyId: number;

  @ViewChild('linkedPayMarketCombobox', { static: true }) public linkedPayMarketCombobox: ComboBoxComponent;
  @ViewChild('countryComponent', { static: true }) public countryComponent: DropDownListComponent;
  @ViewChild('currencyComponent', { static: true }) public currencyComponent: DropDownListComponent;
  @ViewChild('mdScopeComponent', { static: true }) public mdScopeComponent: MarketDataScopeComponent;

  countries$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  currencies$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  linkedPayMarkets$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  payMarket$: Observable<AsyncStateObj<PayMarketWithMdScope>>;
  payMarketErrorMessage$: Observable<string>;

  countriesSubscription: Subscription;
  currenciesSubscription: Subscription;
  linkedPayMarketsSubscription: Subscription;
  payMarketSubscription: Subscription;
  payMarketErrorMessageSubscription: Subscription;

  payMarketForm: FormGroup;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };
  payMarket: PayMarketWithMdScope;
  countries: KendoTypedDropDownItem[];
  currencies: KendoTypedDropDownItem[];
  linkedPayMarkets: KendoTypedDropDownItem[];
  hasLinkedPayMarket: boolean;
  hasError = false;

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
    this.payMarket$ = this.store.select(fromPayMarketManagementReducer.getPayMarket);
    this.payMarketErrorMessage$ = this.store.select(fromPayMarketManagementReducer.getPayMarketErrorMessage);
  }

  get f() { return this.payMarketForm.controls; }

  get isNotValid(): boolean {
    return !this.payMarketForm.valid || !(this.payMarketForm.dirty || this.payMarketForm.touched) || this.hasError;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.reset && changes.reset.currentValue) {
      this.resetForm();
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.initSubscriptions();
    this.loadCountries();
    this.loadCurrencies();
  }

  ngOnDestroy(): void {
    this.countriesSubscription.unsubscribe();
    this.currenciesSubscription.unsubscribe();
    this.payMarketSubscription.unsubscribe();
  }

  onKey() {
    if (this.hasError) {
      this.hasError = false;
      this.store.dispatch(new fromPayMarketModalActions.AddOrUpdatePayMarketError(''));
    }
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
    this.payMarketSubscription = this.payMarket$.subscribe(asyncObj => {
      if (!!asyncObj && !asyncObj.loading && !!asyncObj.obj) {
        this.payMarket = asyncObj.obj;
        this.loadLinkedPayMarkets();
      }
    });
    this.countriesSubscription = this.countries$.subscribe(results => {
      if (results && !results.loading && !!results.obj.length) {
        this.countries = results.obj;
      }
    });
    this.currenciesSubscription = this.currencies$.subscribe(results => {
      if (results && !results.loading && !!results.obj) {
        this.currencies = results.obj;
      }
    });
    this.linkedPayMarketsSubscription = this.linkedPayMarkets$.subscribe(asyncObj => {
      if (asyncObj && !asyncObj.loading && !!asyncObj.obj) {
        this.updateForm();
      }
    });
    this.payMarketErrorMessageSubscription = this.payMarketErrorMessage$.subscribe(error => {
      if (error) {
        this.hasError = true;
      }
    });
  }

  private createForm(): void {
    this.payMarketForm = this.formBuilder.group({
      PayMarketName: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]],
      LinkedPayMarketId: null,
      LinkedPayMarketAdj: null,
      CountryCode: [null, PfValidators.required],
      CurrencyCode: [null, PfValidators.required],
      ShowInLinkedStructure: false
    });
  }

  private updateForm(): void {
    if (!!this.payMarketForm && !!this.payMarket) {
      this.hasLinkedPayMarket = !!this.payMarket.LinkedPayMarketId;
      this.payMarketForm.patchValue({
        PayMarketName: this.payMarket.PayMarket,
        LinkedPayMarketId: this.payMarket.LinkedPayMarketId,
        LinkedPayMarketAdj: this.payMarket.LinkedPayMarketAdj,
        CountryCode: this.payMarket.CountryCode,
        CurrencyCode: this.payMarket.CurrencyCode,
        ShowInLinkedStructure: this.hasLinkedPayMarket ? this.payMarket.ShowInLinkedStructure : false
      });
      this.handleCountryChange(this.payMarket.CountryCode);
    }
  }

  private resetForm(): void {
    if (!this.payMarketForm) {
      return;
    }
    this.payMarketForm.reset({
      PayMarketName: '',
      LinkedPayMarketId: null,
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

  private updateCurrencyCode(currencyCode: string): void {
    const currenciesControl = this.payMarketForm.controls['CurrencyCode'];
    const selectedValue = this.currencies.some(c => c.Value === currencyCode)
      ? currencyCode
      : this.DEFAULT_CURRENCY;
    currenciesControl.setValue(selectedValue);
  }

  private loadCountries(): void {
    this.store.dispatch(new fromGeneralFormActions.GetCountries());
  }

  private loadCurrencies(): void {
    this.store.dispatch(new fromGeneralFormActions.GetCurrencies());
  }

  private loadLinkedPayMarkets(): void {
    const payMarketId = this.payMarket ? this.payMarket.CompanyPayMarketId : 0;
    this.store.dispatch(new fromGeneralFormActions.GetLinkedPayMarkets({ payMarketId }));
  }

  buildPayMarketDto(): PayMarket {
    return {
      CompanyPayMarketId: this.payMarket.CompanyPayMarketId ? this.payMarket.CompanyPayMarketId : null,
      CompanyId: this.companyId,
      PayMarket: this.f.PayMarketName.value,
      IndustryLabel: this.mdScopeComponent.selectedIndustry.Label,
      IndustryValue: this.mdScopeComponent.selectedIndustry.Value,
      SizeLabel: this.mdScopeComponent.selectedSize.Label,
      SizeValue: this.mdScopeComponent.selectedSize.Value,
      GeoLabel: this.mdScopeComponent.selectedLocation.Label,
      GeoValue: this.mdScopeComponent.selectedLocation.Value,
      CountryCode: this.f.CountryCode.value,
      CurrencyCode: this.f.CurrencyCode.value,
      LinkedPayMarket: null,
      LinkedPayMarketId: this.f.LinkedPayMarketId.value ? this.f.LinkedPayMarketId.value : null,
      LinkedPayMarketAdj: this.f.LinkedPayMarketAdj.value ? this.f.LinkedPayMarketAdj.value : null,
      ShowInLinkedStructure: this.f.ShowInLinkedStructure.value
    };
  }

}
