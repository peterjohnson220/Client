import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromPeerAdminReducer from '../../../reducers';
import * as fromTagCategoriesActions from '../../../actions/tag-categories.actions';
import { GridHelperService } from '../../../services';
import { TagCategoriesPageComponent } from './tag-categories.page';

describe('Admin - Tag Categories Page', () => {
  let fixture: ComponentFixture<TagCategoriesPageComponent>;
  let instance: TagCategoriesPageComponent;
  let store: Store<fromRootState.State>;
  let gridHelperService: GridHelperService;

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
      providers: [
        {
          provide: GridHelperService,
          useValue: {
            loadTagCategories: jest.fn()
          }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    gridHelperService = TestBed.get(GridHelperService);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(TagCategoriesPageComponent);
    instance = fixture.componentInstance;
  });

  it('(the page) should match the snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should call loadTagCategories on init`, () => {
    spyOn(gridHelperService, 'loadTagCategories');

    fixture.detectChanges();

    expect(gridHelperService.loadTagCategories).toHaveBeenCalledWith('');
  });

  it(`should dispatch a LoadTagCategories action when handleTagCategoriesGridReload is called`, () => {
    const expectedAction = new fromTagCategoriesActions.LoadTagCategories('');

    instance.handleTagCategoriesGridReload();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should call loadTagCategories when handleSearchChanged`, () => {
    const str = 'new category';
    spyOn(gridHelperService, 'loadTagCategories');

    instance.handleSearchChanged(str);

    expect(gridHelperService.loadTagCategories).toHaveBeenCalledWith(str);
  });

  it(`should dispatch an OpenCreateTagCategoryModal action when openCreateTagCategoryModal is called`, () => {
    const expectedAction = new fromTagCategoriesActions.OpenCreateTagCategoryModal();

    instance.openCreateTagCategoryModal();

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
});
