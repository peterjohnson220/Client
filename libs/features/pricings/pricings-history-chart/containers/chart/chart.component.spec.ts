import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighchartsChartModule } from 'highcharts-angular';
import { PfCommonUIModule } from 'libs/ui/common';
import { ChartComponent } from './chart.component';
import { provideMockStore } from '@ngrx/store/testing';
import { FormControlName } from '@angular/forms';
import { generateDefaultAsyncStateObj } from '../../../../../models';
import { PricedPayMarkets } from '../../../../../models/payfactors-api';

describe('ChartComponent', () => {
  let fixture: ComponentFixture<ChartComponent>;

  const initialState = {
    jobId: null,
    pricedPayMarkets: generateDefaultAsyncStateObj<PricedPayMarkets[]>([]),
    filters: null
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartComponent],
      imports: [HighchartsChartModule, PfCommonUIModule],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: FormControlName,
          useValue: jest.fn()
        }
      ],
    }).compileComponents();
  });

  it('Should display component', () => {
    expect(fixture).toMatchSnapshot();
  });
});
