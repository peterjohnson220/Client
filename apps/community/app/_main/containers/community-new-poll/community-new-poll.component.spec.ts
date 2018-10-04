import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightHashTagPipe } from 'libs/core';
import { CommunityNewPollComponent } from './community-new-poll.component';

describe('CommunityStartPollComponent', () => {
  let fixture: ComponentFixture<CommunityNewPollComponent>;
  let instance: CommunityNewPollComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        CommunityNewPollComponent,
        HighlightHashTagPipe
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CommunityNewPollComponent);
    instance = fixture.componentInstance;
  });

  it('should show community start poll', () => {
    expect(fixture).toMatchSnapshot();
  });

  // TODO: Add units tests when implementing poll submit functionality.

});
