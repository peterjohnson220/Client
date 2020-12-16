import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import moment from 'moment';

import { AsyncStateObj } from 'libs/models';
import { PricedPayMarkets } from 'libs/models/payfactors-api';

import * as fromPricingHistoryChartActions from '../../actions';
import * as fromPricingHistoryChartReducer from '../../reducers';

@Component({
  selector: 'pf-pricing-history-chart-filters',
  templateUrl: './pricing-history-chart-filters.component.html',
  styleUrls: ['./pricing-history-chart-filters.component.scss']
})
export class PricingHistoryChartFiltersComponent implements OnInit, OnDestroy {

  pricedPayMarkets$: Observable<AsyncStateObj<PricedPayMarkets[]>>;
  filteredPayMarketOptions: PricedPayMarkets[] = [];
  payMarketOptions: PricedPayMarkets[] = [];

  pricedPayMarketsSubscription: Subscription;
  formChangesSubscription: Subscription;
  payMarketChangesSubscription: Subscription;

  pricingHistoryChartForm: FormGroup;

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
      StartDate: null,
      EndDate: null
    }, { validator: this.validateDateRange.bind(this) });

    this.updateDateRange();

    this.pricedPayMarkets$ = this.store.select(fromPricingHistoryChartReducer.getPricedPayMarkets);

    this.pricedPayMarketsSubscription = this.store.select(fromPricingHistoryChartReducer.getPricedPayMarkets)
      .subscribe(o => {
        this.filteredPayMarketOptions = o.obj;
        this.payMarketOptions = o.obj;
        this.pricingHistoryChartForm.reset();
        this.updateDateRange();
        this.updateSelectedPayMarkets();
      });

    this.formChangesSubscription = this.pricingHistoryChartForm.valueChanges.subscribe(value => {
      this.store.dispatch(new fromPricingHistoryChartActions.UpdateFilters(value));
    });

    this.payMarketChangesSubscription = this.f.PayMarkets.valueChanges.subscribe(value => {
      this.updatePayMarketOptions();
      this.updateDateRange();
    });
  }

  ngOnDestroy() {
    this.formChangesSubscription.unsubscribe();
    this.formChangesSubscription.unsubscribe();
    this.payMarketChangesSubscription.unsubscribe();
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

  updateSelectedPayMarkets() {
    let DefaultPMs = this.filteredPayMarketOptions.filter(v => v.IsDefault);
    if (DefaultPMs.length > 0) {
      this.pricingHistoryChartForm.patchValue({
        PayMarkets: [DefaultPMs[0], null, null, null, null]
      });
    }   
  }

  updateDateRange() {
    let threeYearsAgo = moment().subtract(3, 'year').startOf('month').toDate();
    let today = moment().startOf('month').toDate();

    if (this.selectedPayMarkets.length > 0) {
      threeYearsAgo = moment.min(this.selectedPayMarkets.map(p => moment(p.StartDate))).toDate();
      today = moment.max(this.selectedPayMarkets.map(p => moment(p.EndDate))).toDate();
    }

    this.pricingHistoryChartForm.patchValue({
      StartDate: threeYearsAgo,
      EndDate: today,
    });
  }

  updatePayMarketOptions(value = '') {
    const selectedPayMarketIds = this.selectedPayMarkets.map(p => p.Id);

    this.filteredPayMarketOptions = this.payMarketOptions.filter(p =>
      p.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      && !selectedPayMarketIds.includes(p.Id));
  }
}
