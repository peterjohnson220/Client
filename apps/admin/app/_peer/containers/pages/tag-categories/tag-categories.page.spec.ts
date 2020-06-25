import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { GridTypeEnum } from 'libs/models/common';
import { KendoGridFilterHelper } from 'libs/core/helpers';

import * as fromPeerAdminReducer from '../../../reducers';
import * as fromTagCategoriesActions from '../../../actions/tag-categories.actions';
import { TagCategoriesPageComponent } from './tag-categories.page';

describe('Admin - Tag Categories Page', () => {
  let fixture: ComponentFixture<TagCategoriesPageComponent>;
  let instance: TagCategoriesPageComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        }),
      ],
      declarations: [
        TagCategoriesPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(TagCategoriesPageComponent);
    instance = fixture.componentInstance;
    instance.gridState$ = of(KendoGridFilterHelper.getMockEmptyGridState());
  });

  it('(the page) should match the snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should dispatch an OpenCreateTagCategoryModal action when openCreateTagCategoryModal is called`, () => {
    const expectedAction = new fromTagCategoriesActions.OpenCreateTagCategoryModal();

    instance.openCreateTagCategoryModal();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should dispatch an UpdateFilter action when updateSearchFilter is called`, () => {
    const expectedAction = new fromGridActions.UpdateFilter(
      GridTypeEnum.TagCategories,
      {columnName: 'DisplayName', value: 'search'}
    );

    instance.updateSearchFilter('search');

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should dispatch an LoadTagCategories action when LoadTagCategories is called`, () => {
    const expectedAction = new fromTagCategoriesActions.LoadTagCategories(
      {
        exchangeId: -1,
        listState: KendoGridFilterHelper.getMockEmptyGridState()
      }
    );

    instance.loadTagCategories();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
});
