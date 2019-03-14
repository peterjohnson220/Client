import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { combineReducers, Store, StoreModule } from '@ngrx/store';


import * as fromRootState from 'libs/state/state';
import * as fromCommunityTagsReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';
import { CommunityTrendingAndFilteredTagsComponent } from './community-trending-and-filtered-tags.component';

import { CommunityCategoryEnum } from 'libs/models/community/community-category.enum';
import { generateMockCommunityTag } from 'libs/models/community/community-tag.model';
import { mapCommunityTagToTag } from '../../helpers/model-mapping.helper';
import { Tag } from '../../models/tag.model';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

describe('CommunityPopularTagsComponent', () => {
  let fixture: ComponentFixture<CommunityTrendingAndFilteredTagsComponent>;
  let instance: CommunityTrendingAndFilteredTagsComponent;
  let store: Store<fromRootState.State>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityTags: combineReducers(fromCommunityTagsReducer.reducers)
        })
      ],
      declarations: [ CommunityTrendingAndFilteredTagsComponent ],
      providers: [
        {
          provide: Router,
          useValue: { navigateByUrl: jest.fn() },
        }
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityTrendingAndFilteredTagsComponent);

    store = TestBed.get(Store);
    router = TestBed.get(Router);

    spyOn(store, 'dispatch');

    instance = fixture.componentInstance;
    instance.filteredTags = [];
  });
  it('should show trending tags', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
  it('should dispatch if button clicked', () => {
    const tag = generateMockCommunityTag();
    const mappedTag = mapCommunityTagToTag(tag);
    const expectedAction = new fromCommunityPostFilterOptionsActions.AddingCommunityTagToFilterOptions(mappedTag);
    instance.trendingTagClicked(tag);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
  it('should filtered by category return false if not filtered by categories', () => {

    instance.filteredCategories = [];
    const result = instance.isFilteredByCategory();
    expect(result).toBeFalsy();

  });
  it('should filtered by category return true if not filtered by categories', () => {

    const filtered = [];
    filtered.push(CommunityCategoryEnum.JobPostings);
    instance.filteredCategories = filtered;

    const result = instance.isFilteredByCategory();
    expect(result).toBeTruthy();

  });
  it('should be true when non filtered tags selected', () => {

    const trending = [];
    trending.push(generateMockCommunityTag);
    instance.trendingTags = [];
    instance.filteredTags = [];

    const result = instance.isFilteredByNonTrendingTags();
    expect(result).toBeFalsy();
  });
  it('should be false when non filtered are not selected', () => {
    const filteredTag: Tag = {
      Id: 'abc',
      TagName: 'new Test'
    };

    const filteredTags = [];
    filteredTags.push(filteredTag);

    const trending = [];
    trending.push(generateMockCommunityTag);

    instance.trendingTags = trending;
    instance.filteredTags = filteredTags;


    const result = instance.isFilteredByNonTrendingTags();
    expect(result).toBeTruthy();
  });
  it('should dispatch delete tags filter action when nonTrendingTag Clicked', () => {

    const tag: Tag = {
      Id: 'abc',
      TagName: 'new Test'
    };

    const expectedAction = new fromCommunityPostFilterOptionsActions.DeletingCommunityTagFromFilterOptions(tag);

    fixture.detectChanges();
    instance.nonTrendingTagClicked(tag);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
  it('should dispatch deleting category filter action when category filter Clicked', () => {

    const categoryFilter = CommunityCategoryEnum.MyPosts;

    const expectedAction = new fromCommunityPostFilterOptionsActions.DeletingCommunityCategoryFromFilterOptions(categoryFilter);
    fixture.detectChanges();

    instance.categoryFilterClicked(categoryFilter);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
  it('should dispatch deletingallfilteroptions when view all is clicked', () => {
    const expectedAction = new fromCommunityPostFilterOptionsActions.DeletingAllFilterOptions();
    fixture.detectChanges();

    instance.viewAllClicked();
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
  it('should show filter title when filtering by single post', () => {
    instance.isFilteredByPostId = true;
    instance.filterTitle = 'Test Post Filter';

    instance.filters$ = Observable.of({
      TagFilter: null,
      CategoryFilter: null,
      PostIds: ['999'],
      ReplyIds: []
    });

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should not show filter title when filtering by multiple posts', () => {
    instance.isFilteredByPostId = true;
    instance.filterTitle = 'Test Post Filter';

    instance.filters$ = Observable.of({
      TagFilter: null,
      CategoryFilter: null,
      PostIds: ['999', '888'],
      ReplyIds: []
    });

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
