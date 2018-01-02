import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { UserVoiceIndicatorComponent } from './user-voice-indicator.component';
import { generateMockUserVoiceModel } from '../../models';

describe('User Voice Indicator', () => {
  let fixture: ComponentFixture<UserVoiceIndicatorComponent>;
  let instance: UserVoiceIndicatorComponent;

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

    instance.model = generateMockUserVoiceModel();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
