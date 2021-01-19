import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControlName } from '@angular/forms';

import { provideMockStore } from '@ngrx/store/testing';

import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';
import { PricedPayMarket } from 'libs/models/payfactors-api';
import { generateDefaultAsyncStateObj } from 'libs/models';

import { PricingsHistoryChartComponent } from './pricings-history-chart.component';

describe('PricingsHistoryChartComponent', () => {
  let fixture: ComponentFixture<PricingsHistoryChartComponent>;

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
        PricingsHistoryChartComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('Should display component', () => {
    expect(fixture).toMatchSnapshot();
  });

});
