import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromCommunityPostActions from '../../actions/community-post.actions';

import * as fromRootState from 'libs/state/state';

import { generateMockCommunityPost } from 'libs/models';
import { CommunitySearchResultModalComponent } from './community-search-result-modal.component';

describe('CommunityPostSearchResultComponent', () => {
  let fixture: ComponentFixture<CommunitySearchResultModalComponent>;
  let instance: CommunitySearchResultModalComponent;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
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
  }));

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should dispatch GettingCommunityPost when getting communitySearchResultModal$ with valid result', () => {

    const result = generateMockCommunityPost();
    instance.communitySearchResultModal$ = of(result.Id);
    const expectedAction = new fromCommunityPostActions.GettingCommunityPost(result.Id);
    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
});
