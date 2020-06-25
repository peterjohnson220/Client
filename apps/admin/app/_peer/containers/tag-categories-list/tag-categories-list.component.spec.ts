import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';

import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { GridTypeEnum } from 'libs/models/common';
import { KendoGridFilterHelper } from 'libs/core/helpers';
import { generateMockTagCategory } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromTagCategoriesActions from '../../actions/tag-categories.actions';
import { TagCategoriesListComponent } from './tag-categories-list.component';

describe('Tag Categories List', () => {
  let fixture: ComponentFixture<TagCategoriesListComponent>;
  let instance: TagCategoriesListComponent;
  let store: Store<fromRootState.State>;

  const mockTagCategory = generateMockTagCategory();

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
        TagCategoriesListComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(TagCategoriesListComponent);
    instance = fixture.componentInstance;
    instance.gridState$ = of(KendoGridFilterHelper.getMockEmptyGridState());
  });

  it('(the page) should match the snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should dispatch a ToggleRowSelection action when handleCellClick is called`, () => {
    instance.InAddTagCategoriesModal = true;
    const expectedAction = new fromGridActions.ToggleRowSelection(GridTypeEnum.TagCategories, 1);

    instance.handleCellClick({dataItem: mockTagCategory});

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should dispatch an UpdateGrid action when handleDataStateChange is called`, () => {
    const dataStateChangeEvent = {} as DataStateChangeEvent;
    const expectedAction = new fromGridActions.UpdateGrid(GridTypeEnum.TagCategories, dataStateChangeEvent);

    instance.handleDataStateChange(dataStateChangeEvent);

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`getEntityTypes should return 'None' when types is 0`, () => {
    const num = 0;
    const result = instance.getEntityTypes(num);
    expect(result).toEqual('None');
  });

  it(`getEntityTypes should return all types when types is 7`, () => {
    const num = 7;
    const result = instance.getEntityTypes(num);
    expect(result).toEqual('Company, Job, Employee');
  });

  it(`should dispatch an LoadTagCategories action when handleTagCategoriesGridReload is called`, () => {
    const expectedAction = new fromTagCategoriesActions.LoadTagCategories(
      {
        exchangeId: -1,
        listState: KendoGridFilterHelper.getMockEmptyGridState()
      }
    );

    instance.handleTagCategoriesGridReload();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
});
