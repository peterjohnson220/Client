import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, StoreModule } from '@ngrx/store';

import { NotificationPreferencesComponent } from './notification-preferences.component';
import * as fromUserSettingsReducer from '../../../reducers';

describe('NotificationPreferencesComponent', () => {
  let component: NotificationPreferencesComponent;
  let fixture: ComponentFixture<NotificationPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromUserSettingsReducer.reducers,
          userSettings_main: combineReducers(fromUserSettingsReducer.reducers)
        })
      ],
      declarations: [ NotificationPreferencesComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
