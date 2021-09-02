import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';

import { generateMockCommunityReply } from 'libs/models/community/community-reply.model';
import * as fromRootState from 'libs/state/state';

import { CommunityPostReplyComponent } from './community-post-reply.component';

describe('CommunityPostReplyComponent', () => {
  let fixture: ComponentFixture<CommunityPostReplyComponent>;
  let instance: CommunityPostReplyComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
        }),
      ],
      declarations: [
        CommunityPostReplyComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(CommunityPostReplyComponent);
    instance = fixture.componentInstance;
  });
  it('should show community post reply component', () => {
    instance.reply = generateMockCommunityReply();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
  it('should emit a replyHashTagClicked event, when hashtag is clicked', () => {
    jest.spyOn(instance.replyHashTagClicked, 'emit');

    instance.reply = generateMockCommunityReply();
    const hashtag = '#hashtag';

    fixture.detectChanges();

    instance.handleHashTagClicked(hashtag);

    expect(instance.replyHashTagClicked.emit).toHaveBeenCalledWith(hashtag);
  });
});
