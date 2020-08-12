import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CommunityPostReplyComponent } from './community-post-reply.component';
import { generateMockCommunityReply } from 'libs/models/community/community-reply.model';

describe('CommunityPostReplyComponent', () => {
  let fixture: ComponentFixture<CommunityPostReplyComponent>;
  let instance: CommunityPostReplyComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        CommunityPostReplyComponent
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
  it('should emit a replyHashTagClicked event, when hashtag is clicked', () => {
    spyOn(instance.replyHashTagClicked, 'emit');

    instance.reply = generateMockCommunityReply();
    const hashtag = '#hashtag';

    fixture.detectChanges();

    instance.handleHashTagClicked(hashtag);

    expect(instance.replyHashTagClicked.emit).toHaveBeenCalledWith(hashtag);
  });
});
