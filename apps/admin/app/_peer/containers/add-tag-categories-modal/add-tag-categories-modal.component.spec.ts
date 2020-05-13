import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { GridTypeEnum } from 'libs/models/common';
import { KendoGridFilterHelper, PfCommonModule } from 'libs/core';
import { PfValidatableDirective } from 'libs/forms/directives';
import { InputDebounceComponent } from 'libs/forms/components/input-debounce';
import { AddTagCategoriesRequest, generateMockExchange } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromTagCategoriesActions from '../../actions/tag-categories.actions';
import { AddTagCategoriesModalComponent } from './add-tag-categories-modal.component';

describe('Add Tag Categories Modal', () => {
  let fixture: ComponentFixture<AddTagCategoriesModalComponent>;
  let instance: AddTagCategoriesModalComponent;
  let store: Store<fromRootState.State>;
  let activatedRoute: ActivatedRoute;
  let routeIdParam: number;

  // Configure Testing Module before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        }),
        ReactiveFormsModule,
        FormsModule,
        PfCommonModule
      ],
      declarations: [
        AddTagCategoriesModalComponent,
        PfValidatableDirective,
        InputDebounceComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { parent: { snapshot: { params: { id : 1 } } } }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    activatedRoute = TestBed.inject(ActivatedRoute);
    routeIdParam = activatedRoute.parent.snapshot.params.id;

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(AddTagCategoriesModalComponent);
    instance = fixture.componentInstance;

    instance.gridState$ = of(KendoGridFilterHelper.getMockEmptyGridState());
    instance.selections$ = of([]);
  });

  it('should show a modal with a search bar and a tag categories grid when addTagCategoriesModalOpen$ is true', () => {
    instance.exchange$ = of(generateMockExchange());
    instance.addTagCategoriesModalOpen$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should dispatch a CloseAddTagCategoriesModal action when handleModalDismissed is called`, () => {
    const expectedAction = new fromTagCategoriesActions.CloseAddTagCategoriesModal();

    instance.handleModalDismissed();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should dispatch a ResetGrid action when handleModalDismissed is called`, () => {
    const expectedAction = new fromGridActions.ResetGrid(GridTypeEnum.TagCategories);

    instance.handleModalDismissed();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should dispatch an AddTagCategoriesToExchange action when handleFormSubmit is called`, () => {
    instance.selections = [1, 2];
    const addTagCategoriesRequest: AddTagCategoriesRequest = {
      ExchangeId: 1,
      TagCategoryIds: [1, 2]
    };
    const expectedAction = new fromTagCategoriesActions.AddTagCategoriesToExchange(addTagCategoriesRequest);

    instance.handleFormSubmit();

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
        exchangeId: 1,
        listState: KendoGridFilterHelper.getMockEmptyGridState()
      }
    );

    instance.loadTagCategories();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
});
