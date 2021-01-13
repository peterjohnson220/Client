import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { subYears, setDate, min, max } from 'date-fns';

import { AsyncStateObj, KendoTypedDropDownItem } from 'libs/models';
import { PricedPayMarket, PricingHistoryChartFilters } from 'libs/models/payfactors-api';

import * as fromPricingHistoryChartActions from '../../actions';
import * as fromPricingHistoryChartReducer from '../../reducers';

@Component({
  selector: 'pf-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {

  pricedPayMarkets$: Observable<AsyncStateObj<PricedPayMarket[]>>;

  filteredPayMarketOptions: PricedPayMarket[] = [];
  payMarketOptions: PricedPayMarket[] = [];

  filteredCurrencies: KendoTypedDropDownItem[] = [];
  currencies: KendoTypedDropDownItem[] = [];

  pricedPayMarketsSubscription: Subscription;
  currenciesSubscription: Subscription;
  formChangesSubscription: Subscription;
  payMarketChangesSubscription: Subscription;
  initUserDefaultFiltersSubscription: Subscription;

  pricingHistoryChartForm: FormGroup;

  rates = [
    { Name: 'Annual', Value: 'Annual' },
    { Name: 'Hourly', Value: 'Hourly' }
  ];

  // convenience getter for easy access to form fields
  get f() { return this.pricingHistoryChartForm?.controls; }

  get payMarkets(): FormArray {
    return this.f.PayMarkets as FormArray;
  }

  get selectedPayMarkets() {
    return this.f.PayMarkets.value.filter(v => !!v && !!v.Id);
  }

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<fromPricingHistoryChartReducer.State>
  ) { }

  ngOnInit(): void {

    this.pricingHistoryChartForm = this.formBuilder.group({
      PayMarkets: this.formBuilder.array([null, null, null, null, null]),
      Currency: 'USD',
      Rate: 'Annual',
      StartDate: null,
      EndDate: null
    }, { validator: this.validateDateRange.bind(this) });

    // Order matters don't put this change subscription below the ngrx selectors
    this.payMarketChangesSubscription = this.f.PayMarkets.valueChanges.subscribe(value => {
      this.filterPayMarketOptions();
      this.updateDateRange();
    });

    this.pricedPayMarketsSubscription = this.store.select(fromPricingHistoryChartReducer.getPricedPayMarkets)
      .subscribe(o => {
        this.filteredPayMarketOptions = o.obj;
        this.payMarketOptions = o.obj;
      });

    this.currenciesSubscription = this.store.select(fromPricingHistoryChartReducer.getCurrencies)
      .subscribe(o => {
        this.filteredCurrencies = o;
        this.currencies = o;
      });

    this.initUserDefaultFiltersSubscription = this.store.select(fromPricingHistoryChartReducer.getFilters)
      .subscribe((filters: PricingHistoryChartFilters) => {
        this.updateSelectedPayMarkets(filters);
        this.store.dispatch(new fromPricingHistoryChartActions.GetData());
      });

    this.formChangesSubscription = this.pricingHistoryChartForm.valueChanges.subscribe(value => {
      this.store.dispatch(new fromPricingHistoryChartActions.UpdateFilters(value));
    });

    this.pricedPayMarkets$ = this.store.select(fromPricingHistoryChartReducer.getPricedPayMarkets);

  }

  ngOnDestroy() {
    this.pricedPayMarketsSubscription.unsubscribe();
    this.currenciesSubscription.unsubscribe();
    this.formChangesSubscription.unsubscribe();
    this.payMarketChangesSubscription.unsubscribe();
    this.initUserDefaultFiltersSubscription.unsubscribe();
  }

  resetDateRangeToFirstOfMonth(): void {
    this.pricingHistoryChartForm.patchValue({
      StartDate: setDate(new Date(this.f.StartDate.value), 1),
      EndDate: setDate(new Date(this.f.EndDate.value), 1)
    });
  }

  validateDateRange(control: AbstractControl) {
    return this.f?.StartDate.value > this.f?.EndDate.value ? { dateRageError: true } : null;
  }

  updateSelectedPayMarkets(userDefaultFilters: PricingHistoryChartFilters) {
    this.pricingHistoryChartForm.patchValue({
      PayMarkets: userDefaultFilters.PayMarkets,
      Rate: userDefaultFilters.Rate,
      Currency: userDefaultFilters.Currency,
      StartDate: setDate(new Date(userDefaultFilters.StartDate), 1),
      EndDate: setDate(new Date(userDefaultFilters.EndDate), 1)
    }, {emitEvent: false});

    this.filterPayMarketOptions();
  }

  updateDateRange(emitPatchEvent = true) {
    let startDate = setDate(subYears(new Date(), 3), 1);
    let endDate = setDate(new Date(), 1);

    if (this.selectedPayMarkets.length > 0) {
      startDate = min(this.selectedPayMarkets.map(p => new Date(p.StartDate)));
      endDate = max(this.selectedPayMarkets.map(p => new Date(p.EndDate)));
    }

    this.pricingHistoryChartForm.patchValue({
      StartDate: startDate,
      EndDate: endDate,
    }, {emitEvent: emitPatchEvent});
  }

  filterPayMarketOptions(value = '') {
    const selectedPayMarketIds = this.selectedPayMarkets.map(p => p.Id);

    this.filteredPayMarketOptions = this.payMarketOptions.filter(p =>
      p.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      && !selectedPayMarketIds.includes(p.Id));
  }

  filterCurrencies(value = '') {
    this.filteredCurrencies = this.currencies.filter(c => c.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
}
