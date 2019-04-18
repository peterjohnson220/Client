import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromCommunitySearchActions from '../../actions/community-search.actions';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

import * as fromRootState from 'libs/state/state';

import { generateMockCommunityPost } from 'libs/models';
import { CommunitySearchResultModalComponent } from './community-search-result-modal.component';

describe('CommunityPostSearchResultComponent', () => {
  let fixture: ComponentFixture<CommunitySearchResultModalComponent>;
  let instance: CommunitySearchResultModalComponent;
  let store: Store<fromRootState.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      declarations: [ CommunitySearchResultModalComponent ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
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

});
