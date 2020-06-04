import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromCommunitySearchActions from '../../actions/community-search.actions';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

import * as fromRootState from 'libs/state/state';

import { SettingsService } from 'libs/state/app-context/services';
import { generateMockCommunityPost } from 'libs/models';
import { CommunitySearchResultModalComponent } from './community-search-result-modal.component';

describe('CommunityPostSearchResultComponent', () => {
  let fixture: ComponentFixture<CommunitySearchResultModalComponent>;
  let instance: CommunitySearchResultModalComponent;
  let store: Store<fromRootState.State>;
  let router: Router;
  let settings: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      providers: [
        SettingsService,
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      declarations: [ CommunitySearchResultModalComponent ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    settings = TestBed.inject(SettingsService);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunitySearchResultModalComponent);
    instance = fixture.componentInstance;
  });

  it('should show a modal with when communityPost has value', () => {
    instance.communityPost = generateMockCommunityPost();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch GettingCommunityPost actions when getting communitySearchResultModal$ with valid result', () => {

    instance.communityPost = generateMockCommunityPost();
    const result = generateMockCommunityPost();
    instance.communitySearchResultModal$ = of(result.Id);
    fixture.detectChanges();

    const expectedAction = new fromCommunityPostActions.GettingCommunityPost(result.Id);
    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch CloseSearchResultModal action when handleModalDismissed() is called', () => {
    instance.communityPost = generateMockCommunityPost();
    instance.handleModalDismissed();
    fixture.detectChanges();

    const expectedAction = new fromCommunitySearchActions.CloseSearchResultModal();
    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
  it('should dismiss modal when hash tag clicked', () => {

    spyOn(instance, 'handleModalDismissed');
    fixture.detectChanges();
    const hashTagName = '#hashtag';

    instance.hashtagClicked(hashTagName);

    expect(instance.handleModalDismissed).toHaveBeenCalled();

  });
  it('should route to community dashboard when hash tag clicked', () => {
    spyOn(router, 'navigate');

    fixture.detectChanges();
    const hashTagName = '#hashtag';

    instance.hashtagClicked(hashTagName);

    expect(router.navigate).toHaveBeenCalledWith([`/dashboard/tag/hashtag`]);

  });
  it('should not route to community dashboard if hash is null', () => {
    spyOn(router, 'navigate');

    fixture.detectChanges();
    const hashTagName = null;

    instance.hashtagClicked(hashTagName);

    expect(router.navigate).toHaveBeenCalledTimes(0);

  });
  it('should not route to community dashboard if hash is empty', () => {
    spyOn(router, 'navigate');

    fixture.detectChanges();
    const hashTagName = '';

    instance.hashtagClicked(hashTagName);

    expect(router.navigate).toHaveBeenCalledTimes(0);

  });
  it('should not route to community dashboard if hash string does not contain hashtag', () => {
    spyOn(router, 'navigate');

    fixture.detectChanges();
    const hashTagName = 'hashtag';

    instance.hashtagClicked(hashTagName);

    expect(router.navigate).toHaveBeenCalledTimes(0);

  });
});
