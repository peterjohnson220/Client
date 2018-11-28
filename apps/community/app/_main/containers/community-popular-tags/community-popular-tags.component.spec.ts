import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityTagsReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';
import { CommunityPopularTagsComponent } from './community-popular-tags.component';

import { generateMockCommunityTag } from 'libs/models/community/community-tag.model';
import { mapCommunityTagToTag } from '../../helpers/model-mapping.helper';

describe('CommunityPopularTagsComponent', () => {
  let fixture: ComponentFixture<CommunityPopularTagsComponent>;
  let instance: CommunityPopularTagsComponent;
  let store: Store<fromRootState.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityTags: combineReducers(fromCommunityTagsReducer.reducers)
        })
      ],
      declarations: [ CommunityPopularTagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityPopularTagsComponent);

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    instance = fixture.componentInstance;
  });

  it('should show popular tags', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
  it('should dispatch if button clicked', () => {
    const tag = generateMockCommunityTag();
    const mappedTag = mapCommunityTagToTag(tag);
    const expectedAction = new fromCommunityPostFilterOptionsActions.AddingCommunityTagToFilterOptions(mappedTag);
    instance.buttonClicked(tag);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
