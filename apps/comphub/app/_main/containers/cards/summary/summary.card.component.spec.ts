import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {combineReducers, Store, StoreModule} from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { SummaryCardComponent } from './summary.card.component';
import * as fromComphubMainReducer from '../../../reducers';
import * as fromSummaryCardActions from '../../../actions/summary-card.actions';
import { RateType } from '../../../data';

describe('Comphub - Main - Summary Card Component', () => {
  let instance: SummaryCardComponent;
  let fixture: ComponentFixture<SummaryCardComponent>;
  let store: Store<fromComphubMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_main: combineReducers(fromComphubMainReducer.reducers),
        })
      ],
      declarations: [ SummaryCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(SummaryCardComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should dispatch a PriceNewJob action, when handling a Price New Job click', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSummaryCardActions.PriceNewJob();

    instance.handlePriceNewJobClicked();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should return correct value when selected rate is hourly', () => {
    const value = 360100;
    const expectedValue = 173.13;
    instance.selectedRate = RateType.Hourly;

    const actualValue = Math.round(instance.calculateDataByRate(value) * 100) / 100;

    expect(actualValue).toEqual(expectedValue);
  });

  it('should return correct value when selected rate is annual', () => {
    const value = 360100;
    const expectedValue = 360100;
    instance.selectedRate = RateType.Annual;

    const actualValue = instance.calculateDataByRate(value);

    expect(actualValue).toEqual(expectedValue);
  });
});
