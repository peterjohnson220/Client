import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';

import * as fromUserSettingsReducer from '../reducers';
import { UserSettingsPageComponent } from './user-settings.page';
import { TabName } from '../models';

describe('User Settings - User Settings Page', () => {
  let instance: UserSettingsPageComponent;
  let fixture: ComponentFixture<UserSettingsPageComponent>;
  let store: Store<fromUserSettingsReducer.State>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          userSettings_main: combineReducers(fromUserSettingsReducer.reducers)
        })
      ],
      declarations: [ UserSettingsPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useValue: { events: of(Event) }},
        { provide: SettingsService, useClass: SettingsService }
      ]
    });

    fixture = TestBed.createComponent(UserSettingsPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should display dashboard preferences tab when DashboardPreferences setting is enabled', () => {
    const dashboardPreferencesTab = instance.tabs.find(t => t.Title === TabName.DashboardPreferences);
    instance.hasDashboardPreferences$ = of(true);

    fixture.detectChanges();
    instance.ngOnInit();

    expect(dashboardPreferencesTab.IsVisible).toEqual(true);
  });

  it('should hide dashboard preferences tab when DashboardPreferences setting is disabled', () => {
    const dashboardPreferencesTab = instance.tabs.find(t => t.Title === TabName.DashboardPreferences);
    instance.hasDashboardPreferences$ = of(false);

    fixture.detectChanges();
    instance.ngOnInit();

    expect(dashboardPreferencesTab.IsVisible).toEqual(false);
  });
});
