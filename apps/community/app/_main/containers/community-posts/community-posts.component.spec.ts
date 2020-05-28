import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import 'rxjs/add/observable/of';
import { CdkScrollable } from '@angular/cdk/scrolling';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import { CommunityPostsComponent } from './community-posts.component';
import { CommunityPost } from 'libs/models/community/community-post.model';
import { ActivatedRouteStub } from 'libs/test/activated-route-stub';
import { generateMockCommunityPost } from 'libs/models/community/community-post.model';
import { SettingsService } from 'libs/state/app-context/services';

describe('CommunityPostsComponent', () => {
  let fixture: ComponentFixture<CommunityPostsComponent>;
  let instance: CommunityPostsComponent;
  let store: Store<fromRootState.State>;
  let route: ActivatedRouteStub;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityPollRequest: combineReducers(fromCommunityPostReducer.reducers)
        }),
        ReactiveFormsModule
      ],
      providers: [ CdkScrollable,
        {
          provide: ActivatedRoute,
          useValue: {
            params: Observable.of({ id: 123 })
          }
        },
        SettingsService ],
      declarations: [
        CommunityPostsComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    route = TestBed.get(ActivatedRoute);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPostsComponent);
    instance = fixture.componentInstance;
  });

  it('should show community posts', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should return the id for tracking purposes ', () => {
    const filter: CommunityPost = generateMockCommunityPost();

    const postId = instance.trackByPostId(5, filter);

    expect(postId).toBe(filter.Id);
  });

  it('should dispatch GettingPreviousBatchCommunityPosts when calling onScrollUp ' +
    'when hasPreviousBatchOnServer and not loadingPreviousBatchCommunityPosts', () => {
    const action = new fromCommunityPostActions.GettingPreviousBatchCommunityPosts();
    instance.loadingPreviousBatchCommunityPosts = false;
    instance.hasPreviousBatchOnServer = true;
    instance.onScrollUp();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should not dispatch GettingPreviousBatchCommunityPosts when calling onScrollUp ' +
    'when loadingPreviousBatchCommunityPosts', () => {
    const action = new fromCommunityPostActions.GettingPreviousBatchCommunityPosts();
    instance.loadingPreviousBatchCommunityPosts = true;
    instance.hasPreviousBatchOnServer = true;
    instance.onScrollUp();

    expect(store.dispatch).not.toHaveBeenCalledWith(action);
  });

  it('should not dispatch GettingPreviousBatchCommunityPosts when calling onScrollUp ' +
    'when not hasPreviousBatchOnServer', () => {
    const action = new fromCommunityPostActions.GettingPreviousBatchCommunityPosts();
    instance.loadingPreviousBatchCommunityPosts = false;
    instance.hasPreviousBatchOnServer = false;
    instance.onScrollUp();

    expect(store.dispatch).not.toHaveBeenCalledWith(action);
  });

  it('should dispatch GettingNextBatchCommunityPosts when calling onScrollDown' +
    'when hasNextBatchOnServer and not loadingNextBatchCommunityPosts', () => {
    const action = new fromCommunityPostActions.GettingNextBatchCommunityPosts();
    instance.communityPosts = [ generateMockCommunityPost() ];
    instance.loadingNextBatchCommunityPosts = false;
    instance.hasNextBatchOnServer = true;
    instance.onScrollDown();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should not dispatch GettingNextBatchCommunityPosts when calling onScrollDown' +
    'when loadingNextBatchCommunityPosts', () => {
    const action = new fromCommunityPostActions.GettingNextBatchCommunityPosts();
    instance.communityPosts = [ generateMockCommunityPost() ];
    instance.loadingNextBatchCommunityPosts = true;
    instance.hasNextBatchOnServer = true;
    instance.onScrollDown();

    expect(store.dispatch).not.toHaveBeenCalledWith(action);
  });

  it('should not dispatch GettingNextBatchCommunityPosts when calling onScrollDown' +
    'when not hasNextBatchOnServer', () => {
    const action = new fromCommunityPostActions.GettingNextBatchCommunityPosts();
    instance.communityPosts = [ generateMockCommunityPost() ];
    instance.loadingNextBatchCommunityPosts = false;
    instance.hasNextBatchOnServer = false;
    instance.onScrollDown();

    expect(store.dispatch).not.toHaveBeenCalledWith(action);
  });

  it('should set show replies to empty when loadingNextBatchCommunityPosts$ is true', () => {
    instance.loadingNextBatchCommunityPosts$ = of(true);
    fixture.detectChanges();
    expect(instance.loadingNextBatchCommunityPosts).toBeTruthy();
  });
  it('should set show replies to empty when loadingPreviousBatchCommunityPosts is true', () => {
    instance.loadingPreviousBatchCommunityPosts$ = of(true);
    fixture.detectChanges();
    expect(instance.loadingPreviousBatchCommunityPosts).toBeTruthy();
  });
  it('should set show replies to empty when getHasNextBatchPostsOnServer is true', () => {
    instance.getHasNextBatchPostsOnServer$ = of(true);
    fixture.detectChanges();
    expect(instance.hasNextBatchOnServer).toBeTruthy();
  });
  it('should set show replies to empty when getHasPreviousBatchPostsOnServer is true', () => {
    instance.getHasPreviousBatchPostsOnServer$ = of(true);
    fixture.detectChanges();
    expect(instance.hasPreviousBatchOnServer).toBeTruthy();
  });
});
