import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityPollChoicesComponent } from './community-poll-choices.component';

describe('CommunityPollChoicesComponent', () => {
  let fixture: ComponentFixture<CommunityPollChoicesComponent>;
  let instance: CommunityPollChoicesComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        CommunityPollChoicesComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CommunityPollChoicesComponent);
    instance = fixture.componentInstance;
  });

  it('should show community start poll', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should not allow to update poll choices if !enableEditingResponseOptions', () => {
    CommunityPollChoicesComponent.enableEditingResponseOptionsStatic = false;
    expect(fixture).toMatchSnapshot();
  });

  it('should not allow to update poll choices if enableEditingResponseOptions === true', () => {
    CommunityPollChoicesComponent.enableEditingResponseOptionsStatic = true;
    expect(fixture).toMatchSnapshot();
  });
});
