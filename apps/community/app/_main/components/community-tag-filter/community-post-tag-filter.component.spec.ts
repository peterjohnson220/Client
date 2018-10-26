import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { CommunityPostTagFilterComponent } from './community-post-tag-filter.component';
import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

describe('CommunityPostReplyComponent', () => {
  let fixture: ComponentFixture<CommunityPostTagFilterComponent>;
  let instance: CommunityPostTagFilterComponent;

  let store: Store<fromCommunityPostReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({

      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
      ],
      declarations: [
        CommunityPostTagFilterComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPostTagFilterComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch GettingCommunityPosts action when calling removeTagFilter', () => {
    const expectedAction = new fromCommunityPostActions.GettingCommunityPosts();

    instance.removeTagFilter();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
