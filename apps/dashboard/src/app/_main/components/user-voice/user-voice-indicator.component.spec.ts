import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { generateMockUserContext, generateMockNavigationLink } from 'libs/models';

import { UserMenuComponent } from './user-menu.component';
import { UserVoiceIndicatorComponent } from './user-voice-indicator.component';

describe('User Voice Indicator', () => {
  let fixture: ComponentFixture<UserMenuComponent>;
  let instance: UserMenuComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserVoiceIndicatorComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(UserVoiceIndicatorComponent);
    instance = fixture.componentInstance;
  });

  it('should show the link to user voice', () => {

    instance.userContext = generateMockUserContext();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
