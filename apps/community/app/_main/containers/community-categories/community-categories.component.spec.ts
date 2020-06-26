import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityCategoriesReducer from '../../reducers';
import * as fromCommunityCategoriesActions from '../../actions/community-categories.actions';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';

import { CommunityCategoryEnum } from 'libs/models/community/community-category.enum';
import { CommunityCategoriesComponent } from './community-categories.component';
import { CommunityCategoryDisplayNamePipe } from '../../pipes/community-category-displayname.pipe';

describe('CommunityCategoriesComponent', () => {
  let fixture: ComponentFixture<CommunityCategoriesComponent>;
  let instance: CommunityCategoriesComponent;
  let store: Store<fromRootState.State>;
  let router: Router;
  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityCategories: combineReducers(fromCommunityCategoriesReducer.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [
        CommunityCategoriesComponent,
        CommunityCategoryDisplayNamePipe
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityCategoriesComponent);
    instance = fixture.componentInstance;
  });

  it('should show community categories', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a Get Community Categories on init', () => {
    const action = new fromCommunityCategoriesActions.GettingCommunityCategories();

    instance.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should navigate to the job postings if job postings category clicked', () => {
    spyOn(router, 'navigate');

    instance.onClick(CommunityCategoryEnum.JobPostings);

    expect(router.navigate).toHaveBeenCalledWith(['/job-postings']);
  });
  it('should dispatch if My Posts Category clicked', () => {
    const expectedAction = new fromCommunityPostFilterOptionsActions.AddingCommunityCategoryToFilterOptions(CommunityCategoryEnum.MyPosts);

    instance.onClick(CommunityCategoryEnum.MyPosts);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
  it('should set filtered by post to true when observable returns true', () => {
    instance.filteredByPost$ = of(true);
    fixture.detectChanges();
    expect(instance.filteredByPost).toBeTruthy();
  });
});
