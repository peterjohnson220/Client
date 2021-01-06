import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import moment from 'moment';

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
      StartDate: moment(this.f.StartDate.value).startOf('month').toDate(),
      EndDate: moment(this.f.EndDate.value).startOf('month').toDate(),
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
      StartDate: moment(userDefaultFilters.StartDate).startOf('month').toDate(),
      EndDate: moment(userDefaultFilters.EndDate).startOf('month').toDate(),
    }, {emitEvent: false});
    
    this.filterPayMarketOptions();
    this.updateDateRange(false);
  }

  updateDateRange(emitPatchEvent = true) {
    let startDate = moment().subtract(3, 'year').startOf('month').toDate();
    let endDate = moment().startOf('month').toDate();

    if (this.selectedPayMarkets.length > 0) {
      startDate = moment.min(this.selectedPayMarkets.map(p => moment(p.StartDate))).toDate();
      endDate = moment.max(this.selectedPayMarkets.map(p => moment(p.EndDate))).toDate();
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
