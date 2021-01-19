import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControlName } from '@angular/forms';


import { provideMockStore, MockStore } from '@ngrx/store/testing';
import moment from 'moment';

import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';
import { generateDefaultAsyncStateObj } from 'libs/models';
import { PricedPayMarket } from 'libs/models/payfactors-api';

import * as fromActions from '../../actions';
import * as fromReducer from '../../reducers';

import { FiltersComponent } from './filters.component';

describe('Pricing History Chart Features - Filters', () => {
  let instance: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;


  let store: MockStore<fromReducer.State>;

  const initialState = {
    jobId: null,
    pricedPayMarkets: generateDefaultAsyncStateObj<PricedPayMarket[]>([]),
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
        FiltersComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersComponent);
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

  it('Should set no PM selection if default User PMs selections are passed', () => {
    instance.ngOnInit();
    const c = instance.pricingHistoryChartForm.controls;

    const userSelectedPM = makePayMarket(2222, 'Chicago', 'Annual', 'USD', '8/1/2018', '10/1/2018', false)
    instance.payMarketOptions = [
      userSelectedPM,
      makePayMarket(1111, 'Boston', 'Annual', 'USD', '10/1/2010', '8/1/2015', false)
    ];

    instance.filterPayMarketOptions();
    instance.updateSelectedPayMarkets({
      PayMarkets: [userSelectedPM, null, null, null, null],
      Rate: 'Annual',
      Currency: 'USD',
      StartDate: new Date('8/1/2018'),
      EndDate: new Date('10/1/2018')
    });

    expect(c.PayMarkets.value[0].Id).toEqual(2222);

    expect(c.StartDate.value).toEqual(new Date('8/1/2018'));
    expect(c.EndDate.value).toEqual(new Date('10/1/2018'));
  });

});

export function makePayMarket(id: number, name: string, rate: string, currency: string,
  startDate: string, endDate: string, isDefault: boolean): PricedPayMarket {

  return {
    Id: id,
    Name: name,
    Rate: rate,
    Currency: currency,
    StartDate: new Date(startDate),
    EndDate: new Date(endDate),
    IsDefault: isDefault
  };
}
