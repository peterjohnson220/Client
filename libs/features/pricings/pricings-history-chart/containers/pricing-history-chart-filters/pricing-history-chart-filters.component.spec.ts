import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControlName } from '@angular/forms';


import { provideMockStore, MockStore } from '@ngrx/store/testing';
import moment from 'moment';

import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';
import { generateDefaultAsyncStateObj } from 'libs/models';
import { PricedPayMarkets } from 'libs/models/payfactors-api';

import * as fromActions from '../../actions';
import * as fromReducer from '../../reducers';

import { PricingHistoryChartFiltersComponent } from './pricing-history-chart-filters.component';

describe('Pricing History Chart Features - Filters', () => {
  let instance: PricingHistoryChartFiltersComponent;
  let fixture: ComponentFixture<PricingHistoryChartFiltersComponent>;


  let store: MockStore<fromReducer.State>;

  const initialState = {
    jobId: null,
    pricedPayMarkets: generateDefaultAsyncStateObj<PricedPayMarkets[]>([]),
    filters: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PfFormsModule,
        PfCommonModule
      ],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: FormControlName,
          useValue: jest.fn()
        }
      ],
      declarations: [
        PricingHistoryChartFiltersComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PricingHistoryChartFiltersComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(MockStore);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

  });

  it('Should display form', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('Should dispatch the UpdateFilters action on init', () => {
    instance.ngOnInit();
    const form = instance.pricingHistoryChartForm;
    form.controls.PayMarkets.setValue([{ Id: 1111, Name: 'Test PM' }, null, null, null, null]);
    const expectedAction = new fromActions.UpdateFilters(form.value);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Form should be valid', () => {
    const form = instance.pricingHistoryChartForm;
    const c = instance.pricingHistoryChartForm.controls;

    // PayMarkets
    expect(c.PayMarkets.valid).toEqual(true);
    c.PayMarkets.setValue([null, null, null, null, null]);
    expect(c.PayMarkets.valid).toEqual(true);
    c.PayMarkets.setValue([{ Id: 1111, Name: 'Test PM' }, null, null, null, null]);
    expect(c.PayMarkets.valid).toEqual(true);
    expect(form.valid).toEqual(true);

    // Date Range
    expect(c.StartDate.valid).toEqual(true);
    c.StartDate.setValue(new Date('10/10/2010'));
    expect(c.StartDate.valid).toEqual(true);

    expect(c.EndDate.valid).toEqual(true);
    c.EndDate.setValue(new Date('10/10/2010'));
    expect(c.EndDate.valid).toEqual(true);
    expect(form.valid).toEqual(true);

    c.EndDate.setValue(new Date('10/11/2010'));
    expect(form.valid).toEqual(true);

    c.EndDate.setValue(new Date('09/10/2010'));
    expect(form.valid).toEqual(false);

  });

  it('Should reset dates to first of month', () => {
    instance.ngOnInit();
    const c = instance.pricingHistoryChartForm.controls;

    c.StartDate.setValue(new Date('10/10/2010'));
    c.EndDate.setValue(new Date('11/10/2010'));

    instance.resetDateRangeToFirstOfMonth();

    expect(c.StartDate.value).toEqual(new Date('10/1/2010'));
    expect(c.EndDate.value).toEqual(new Date('11/1/2010'));
  });

  it('Should set default PM selection', () => {
    instance.ngOnInit();
    const c = instance.pricingHistoryChartForm.controls;

    instance.payMarketOptions = [
      { Id: 1111, Name: 'Boston', StartDate: new Date('10/1/2010'), EndDate: new Date('8/1/2015'), IsDefault: true },
      { Id: 2222, Name: 'Chicago', StartDate: new Date('8/5/2018'), EndDate: new Date('10/1/2018'), IsDefault: false }
    ];

    instance.updatePayMarketOptions();
    instance.updateSelectedPayMarkets();

    expect(c.PayMarkets.value[0].Id).toEqual(1111);

    expect(c.StartDate.value).toEqual(new Date('10/1/2010'));
    expect(c.EndDate.value).toEqual(new Date('8/1/2015'));
  });

  it('Should set first PM selection if no default PM', () => {
    instance.ngOnInit();
    const c = instance.pricingHistoryChartForm.controls;

    instance.payMarketOptions = [
      { Id: 2222, Name: 'Chicago', StartDate: new Date('8/1/2018'), EndDate: new Date('10/1/2018'), IsDefault: false },
      { Id: 1111, Name: 'Boston', StartDate: new Date('10/1/2010'), EndDate: new Date('8/1/2015'), IsDefault: false }
    ];

    instance.updatePayMarketOptions();
    instance.updateSelectedPayMarkets();

    expect(c.PayMarkets.value[0].Id).toEqual(2222);

    expect(c.StartDate.value).toEqual(new Date('8/1/2018'));
    expect(c.EndDate.value).toEqual(new Date('10/1/2018'));
  });

  it('Should set no PM selection if priced PMs', () => {
    instance.ngOnInit();
    const c = instance.pricingHistoryChartForm.controls;

    instance.payMarketOptions = [];

    instance.updatePayMarketOptions();
    instance.updateSelectedPayMarkets();

    expect(c.PayMarkets.value[0]).toEqual(null);

    const threeYearsAgo = moment().subtract(3, 'year').startOf('month').toDate();
    const today = moment().startOf('month').toDate();

    expect(c.StartDate.value).toEqual(threeYearsAgo);
    expect(c.EndDate.value).toEqual(today);
  });

});
