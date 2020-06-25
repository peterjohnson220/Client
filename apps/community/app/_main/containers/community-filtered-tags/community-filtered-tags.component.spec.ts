import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { combineReducers, Store, StoreModule } from '@ngrx/store';


import * as fromRootState from 'libs/state/state';
import * as fromCommunityTagsReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';
import { CommunityFilteredTagsComponent } from './community-filtered-tags.component';

import { CommunityCategoryEnum } from 'libs/models/community/community-category.enum';
import { generateMockCommunityTag } from 'libs/models/community/community-tag.model';
import { Tag } from '../../models/tag.model';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

describe('CommunityFilteredTagsComponent', () => {
  let fixture: ComponentFixture<CommunityFilteredTagsComponent>;
  let instance: CommunityFilteredTagsComponent;
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
      declarations: [ CommunityFilteredTagsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
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
    fixture = TestBed.createComponent(CommunityFilteredTagsComponent);

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    spyOn(store, 'dispatch');

    instance = fixture.componentInstance;
    instance.filteredTags = [];
  });
  it('should show trending tags', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
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
  it('should filtered by industry return false if not filtered by industries', () => {

    instance.filteredIndustries = [];
    const result = instance.isFilteredByIndustry();
    expect(result).toBeFalsy();

  });
  it('should filtered by industry return true if not filtered by industries', () => {

    const filtered = [];
    filtered.push('TestIndustry');
    instance.filteredIndustries = filtered;

    const result = instance.isFilteredByIndustry();
    expect(result).toBeTruthy();

  });
  it('should be true when non filtered tags selected', () => {

    const trending = [];
    trending.push(generateMockCommunityTag);
    instance.filteredTags = [];

    const result = instance.isFilteredByTag();
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

    instance.filteredTags = filteredTags;


    const result = instance.isFilteredByTag();
    expect(result).toBeTruthy();
  });
  it('should dispatch delete tags filter action when nonTrendingTag Clicked', () => {

    const tag: Tag = {
      Id: 'abc',
      TagName: 'new Test'
    };

    const expectedAction = new fromCommunityPostFilterOptionsActions.DeletingCommunityTagFromFilterOptions(tag);

    fixture.detectChanges();
    instance.tagClicked(tag);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
  it('should dispatch deleting category filter action when category filter Clicked', () => {

    const categoryFilter = CommunityCategoryEnum.MyPosts;

    const expectedAction = new fromCommunityPostFilterOptionsActions.DeletingCommunityCategoryFromFilterOptions(categoryFilter);
    fixture.detectChanges();

    instance.categoryFilterClicked(categoryFilter);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
  it('should dispatch deleting industry filter action when industry filter Clicked', () => {

    const industryFilter = 'TestIndustry';

    const expectedAction = new fromCommunityPostFilterOptionsActions.DeletingCommunityIndustryFromFilterOptions(industryFilter);
    fixture.detectChanges();

    instance.industryFilterClicked(industryFilter);

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
      IndustryFilter: null,
      CompanySizeFilter: null,
      TopicFilter: null,
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
      IndustryFilter: null,
      CompanySizeFilter: null,
      TopicFilter: null,
      PostIds: ['999', '888'],
      ReplyIds: []
    });

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
