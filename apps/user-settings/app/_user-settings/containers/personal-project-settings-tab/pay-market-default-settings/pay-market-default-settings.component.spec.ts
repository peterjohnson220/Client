import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromUserSettingsReducer from '../../../reducers';
import { PayMarketDefaultSettingsComponent } from './pay-market-default-settings.component';

describe('PayMarketDefaultSettingsComponent', () => {
  let component: PayMarketDefaultSettingsComponent;
  let fixture: ComponentFixture<PayMarketDefaultSettingsComponent>;
  let store: Store<fromUserSettingsReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          userSettings_main: combineReducers(fromUserSettingsReducer.reducers)
        })
      ],
      declarations: [ PayMarketDefaultSettingsComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PayMarketDefaultSettingsComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
