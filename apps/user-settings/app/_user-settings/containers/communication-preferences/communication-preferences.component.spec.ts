import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AbstractFeatureFlagService } from 'libs/core/services/feature-flags';

import { CommunicationPreferencesComponent } from './communication-preferences.component';

describe('CommunicationPreferencesComponent', () => {
  let component: CommunicationPreferencesComponent;
  let fixture: ComponentFixture<CommunicationPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunicationPreferencesComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: AbstractFeatureFlagService,
          useValue: { enabled: jest.fn() }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
