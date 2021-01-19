import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, StoreModule } from '@ngrx/store';

import { EmailPreferencesComponent } from './email-preferences.component';
import * as fromUserSettingsReducer from '../../../reducers';

describe('EmailPreferencesComponent', () => {
  let instance: EmailPreferencesComponent;
  let fixture: ComponentFixture<EmailPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromUserSettingsReducer.reducers,
          userSettings_main: combineReducers(fromUserSettingsReducer.reducers)
        })
      ],
      declarations: [ EmailPreferencesComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPreferencesComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
