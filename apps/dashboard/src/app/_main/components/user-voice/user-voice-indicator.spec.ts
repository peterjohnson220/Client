import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UserVoiceIndicatorComponent } from './user-voice-indicator.component';

describe('user-voice-indicator', () => {
  let fixture: ComponentFixture<UserVoiceIndicatorComponent>;
  let instance: UserVoiceIndicatorComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserVoiceIndicatorComponent,
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(UserVoiceIndicatorComponent);
    instance = fixture.componentInstance;
  });

  it('should show correct html', () => {

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
