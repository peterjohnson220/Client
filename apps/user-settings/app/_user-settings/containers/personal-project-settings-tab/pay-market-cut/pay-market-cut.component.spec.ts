import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { generateDefaultAsyncStateObj, generateMockPayMarket, PayMarketCut, PayMarketCutHelper } from 'libs/models';

import * as fromRootState from 'libs/state/state';

import * as fromUserSettingsReducer from '../../../reducers';
import * as fromPayMarketDefaultSettingsActions from '../../../actions/paymarket-default-settings.actions';
import { PayMarketCutComponent } from './pay-market-cut.component';

describe('User Settings - Pay Market Cut Component', () => {
  let fixture: ComponentFixture<PayMarketCutComponent>;
  let instance: PayMarketCutComponent;
  let store: Store<fromUserSettingsReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          userSettings_main: combineReducers(fromUserSettingsReducer.reducers)
        })
      ],
      declarations: [ PayMarketCutComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PayMarketCutComponent);
    instance = fixture.componentInstance;
    instance.payMarket = generateMockPayMarket();
    instance.payMarketCuts$ = of(generateDefaultAsyncStateObj<PayMarketCut[]>([PayMarketCutHelper.generateMockPayMarketCut()]));

    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should dispatch GetPayMarketCuts when a pay market is selected', () => {
    spyOn(store, 'dispatch');
    const payMarket = generateMockPayMarket();
    const changes: SimpleChanges = {
      payMarket: { currentValue: payMarket, previousValue: null, firstChange: true, isFirstChange: () => true }
    };
    const expectedAction = new fromPayMarketDefaultSettingsActions.GetPayMarketCuts({ payMarketId: payMarket.CompanyPayMarketId });

    instance.ngOnChanges(changes);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch ClearPayMarketCuts when selected pay market is cleared ', () => {
    spyOn(store, 'dispatch');
    const payMarket = generateMockPayMarket();
    const changes: SimpleChanges = {
      payMarket: { currentValue: null, previousValue: payMarket, firstChange: false, isFirstChange: () => false }
    };
    const expectedAction = new fromPayMarketDefaultSettingsActions.ClearPayMarketCuts();

    instance.ngOnChanges(changes);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should reset cut value the original value when clicking Reset to default', () => {
    const defaultWeightValue = instance.defaultMarketCuts[0].Weight;
    const cutToUpdate = instance.payMarketCuts[0];
    cutToUpdate.Weight = 50;

    instance.resetToDefault();

    expect(instance.payMarketCuts[0].Weight).toEqual(defaultWeightValue);
  });

  it('should dispatch SavePayMarketCuts when clicking Save', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromPayMarketDefaultSettingsActions.SavePayMarketCuts({
      payMarketId: instance.payMarket.CompanyPayMarketId,
      dataCuts: instance.payMarketCuts
    });

    instance.handleSaveClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should create default weights correctly based on cuts count', () => {
    const payMarketCuts: PayMarketCut[] = [
      {...PayMarketCutHelper.generateMockPayMarketCut(), DisplayOrder: 0, Weight: 75, Adjustment: 10},
      {...PayMarketCutHelper.generateMockPayMarketCut(), DisplayOrder: 1, Weight: 65, Adjustment: 0},
      {...PayMarketCutHelper.generateMockPayMarketCut(), DisplayOrder: 2, Weight: 5, Adjustment: 0},
      {...PayMarketCutHelper.generateMockPayMarketCut(), DisplayOrder: 3, Weight: 5, Adjustment: 0}
    ];

    instance.payMarketCuts$ = of(generateDefaultAsyncStateObj<PayMarketCut[]>(payMarketCuts));
    instance.ngOnInit();
    fixture.detectChanges();

    expect(instance.defaultMarketCuts[0].Weight).toEqual(80);
    expect(instance.defaultMarketCuts[1].Weight).toEqual(10);
    expect(instance.defaultMarketCuts[2].Weight).toEqual(10);
    expect(instance.defaultMarketCuts[3].Weight).toEqual(0);

    expect(instance.defaultMarketCuts[0].Adjustment).toEqual(0);
  });

  it('should only set isEditingCutValue to true when value is entered to keep Save button disabled', () => {
    instance.handlePayMarketCutValueChange(null);

    expect(instance.isEditingCutValue).toEqual(false);
  });

  it('should set Weight/Adj value to 0 when user remove value and navigate away', () => {
    const payMarketCut = {...PayMarketCutHelper.generateMockPayMarketCut(), Weight: null };
    instance.onBlur(payMarketCut);

    expect(payMarketCut.Weight).toEqual(0);
  });

});
