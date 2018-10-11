import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CommunityPostReplyComponent } from './community-post-reply.component';
import { generateMockCommunityReply } from 'libs/models/community/community-reply.model';
import { HighlightHashTagPipe, FormatLinkUrlPipe } from 'libs/core';

describe('CommunityPostReplyComponent', () => {
  let fixture: ComponentFixture<CommunityPostReplyComponent>;
  let instance: CommunityPostReplyComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        CommunityPostReplyComponent,
        HighlightHashTagPipe,
        FormatLinkUrlPipe
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CommunityPostReplyComponent);
    instance = fixture.componentInstance;
  });
  it('should show community post reply component', () => {
    instance.reply = generateMockCommunityReply();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
