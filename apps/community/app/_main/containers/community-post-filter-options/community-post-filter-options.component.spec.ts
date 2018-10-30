import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostFilterOptionsReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';
import { CommunityPostFilterOptionsComponent } from './community-post-filter-options.component';


describe('CommunityCategoriesComponent', () => {
  let fixture: ComponentFixture<CommunityPostFilterOptionsComponent>;
  let instance: CommunityPostFilterOptionsComponent;
  let store: Store<fromRootState.State>;
  let router: Router;
  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityPostFilterOptions: combineReducers(fromCommunityPostFilterOptionsReducer.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [
        CommunityPostFilterOptionsComponent
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

    store = TestBed.get(Store);
    router = TestBed.get(Router);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPostFilterOptionsComponent);
    instance = fixture.componentInstance;
  });

  it('should show community categories', () => {
    expect(fixture).toMatchSnapshot();
  });
  it('should dispatch delete tag when button clicked', () => {
    const item = {};
    const expectedAction = new fromCommunityPostFilterOptionsActions.DeletingCommunityTagFromFilterOptions(item);
    const type = 'tag';
    instance.buttonClicked(type, item);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
  it('should dispatch delete category when button clicked', () => {
    const item = {};
    const expectedAction = new fromCommunityPostFilterOptionsActions.DeletingCommunityCategoryFromFilterOptions(item);
    const type = 'category';
    instance.buttonClicked(type, item);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
