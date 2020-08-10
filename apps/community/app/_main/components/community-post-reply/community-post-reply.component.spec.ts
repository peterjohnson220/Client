import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { CommunityPostReplyComponent } from './community-post-reply.component';
import { generateMockCommunityReply } from 'libs/models/community/community-reply.model';
import { generateMockCommunityPost } from 'libs/models/community/community-post.model';

describe('CommunityPostReplyComponent', () => {
  let fixture: ComponentFixture<CommunityPostReplyComponent>;
  let instance: CommunityPostReplyComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
      ],
      declarations: [
        CommunityPostReplyComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPostReplyComponent);
    instance = fixture.componentInstance;

    instance.reply = generateMockCommunityReply();
    instance.post = generateMockCommunityPost();
    instance.discardingPostId$ = of('1234');
    instance.discardingPostReplyProceed$ = of(false);
  });
  it('should show community post reply component', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
  it('should emit a replyHashTagClicked event, when hashtag is clicked', () => {
    spyOn(instance.replyHashTagClicked, 'emit');

    const hashtag = '#hashtag';

    fixture.detectChanges();

    instance.handleHashTagClicked(hashtag);

    expect(instance.replyHashTagClicked.emit).toHaveBeenCalledWith(hashtag);
  });
});
