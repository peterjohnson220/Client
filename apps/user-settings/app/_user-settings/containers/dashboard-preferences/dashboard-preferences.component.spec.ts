import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromUserSettingsReducer from '../../reducers';
import * as fromDashboardPreferencesActions from '../../actions/dashboard-preferences.actions';
import { DashboardPreferencesComponent } from './dashboard-preferences.component';
import { generateMockUserTile } from '../../models';

describe('DashboardPreferencesComponent', () => {
  let instance: DashboardPreferencesComponent;
  let fixture: ComponentFixture<DashboardPreferencesComponent>;
  let store: Store<fromUserSettingsReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          userSettings_main: combineReducers(fromUserSettingsReducer.reducers)
        })
      ],
      declarations: [DashboardPreferencesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(DashboardPreferencesComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should emit user tile selection when toggling user tile', () => {
    const userTile = generateMockUserTile();
    const expectedAction = new fromDashboardPreferencesActions.ToggleUserTile(userTile);
    spyOn(store, 'dispatch');

    instance.toggleUserTile(userTile);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
