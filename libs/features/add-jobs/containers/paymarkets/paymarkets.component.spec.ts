import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';

import * as fromPaymarketActions from '../../actions/paymarkets.actions';

import * as fromAddJobsReducer from '../../../../../apps/project/app/_add-jobs/reducers';
import { PaymarketsComponent } from './paymarkets.component';
import { generateMockJobPayMarket } from '../../models';

describe('Project - Add Jobs - Paymarkets Component', () => {
  let fixture: ComponentFixture<PaymarketsComponent>;
  let instance: PaymarketsComponent;
  let store: Store<fromAddJobsReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_addJobs: combineReducers(fromAddJobsReducer.reducers),
        })
      ],
      declarations: [
        PaymarketsComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(PaymarketsComponent);
    instance = fixture.componentInstance;
    instance.ngOnInit();
  });

  it('should dispatch a set search term action, when search term changed', () => {
    const expectedAction = new fromPaymarketActions.SetSearchTerm('test');
    spyOn(store, 'dispatch');

    instance.handleSearchChanged('test');

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a toggle paymarket action, when paymarket toggled', () => {
    const paymarket = generateMockJobPayMarket();
    const expectedAction = new fromPaymarketActions.TogglePaymarketSelection(paymarket.CompanyPayMarketId);
    spyOn(store, 'dispatch');

    instance.togglePaymarket(paymarket);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should show default badge on default paymarket', () => {
    const paymarket = generateMockJobPayMarket();
    spyOn(store, 'dispatch');

    instance.defaultPaymarket$ = of(paymarket.CompanyPayMarketId);
    instance.paymarkets$ = of([paymarket]);
    instance.visiblePaymarkets$ = of([paymarket]);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should be checked if paymarket is selected', () => {
    const paymarket = generateMockJobPayMarket();
    paymarket.IsSelected = true;
    spyOn(store, 'dispatch');

    instance.paymarkets$ = of([paymarket]);
    instance.visiblePaymarkets$ = of([paymarket]);
    instance.selectedPaymarkets$ = of([paymarket.CompanyPayMarketId]);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not show default badge when paymarket is not default', () => {
    const paymarket = generateMockJobPayMarket();
    paymarket.CompanyPayMarketId = 1;
    spyOn(store, 'dispatch');

    instance.defaultPaymarket$ = of(1);
    instance.paymarkets$ = of([paymarket]);
    instance.visiblePaymarkets$ = of([paymarket]);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show no data message when no paymarkets match filter', () => {
    const paymarket = generateMockJobPayMarket();
    paymarket.IsHidden = true;
    spyOn(store, 'dispatch');

    instance.searchTerm$ = of('zzzzz');
    instance.paymarkets$ = of([paymarket]);
    instance.visiblePaymarkets$ = of([]);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
