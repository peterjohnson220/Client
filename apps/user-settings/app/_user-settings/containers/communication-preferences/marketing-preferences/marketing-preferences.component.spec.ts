import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, StoreModule } from '@ngrx/store';

import { UiPersistenceSettingsApiService } from 'libs/data/payfactors-api/settings';
import { SettingsService } from 'libs/state/app-context/services';

import { MarketingPreferencesComponent } from './marketing-preferences.component';
import * as fromUserSettingsReducer from '../../../reducers';

describe('MarketingPreferencesComponent', () => {
  let component: MarketingPreferencesComponent;
  let fixture: ComponentFixture<MarketingPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromUserSettingsReducer.reducers,
          userSettings_main: combineReducers(fromUserSettingsReducer.reducers)
        }),
        HttpClientModule
      ],
      providers: [ UiPersistenceSettingsApiService, SettingsService],
      declarations: [ MarketingPreferencesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
