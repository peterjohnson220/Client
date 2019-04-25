import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { TagApiService } from 'libs/data/payfactors-api/tags';
import { UpsertTagCategoryRequest } from 'libs/models/peer/requests';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromTagCategoriesActions from '../../actions/tag-categories.actions';
import { CreateTagCategoryModalComponent } from './create-tag-category-modal.component';

describe('Admin - Create Tag Category Modal', () => {
  let fixture: ComponentFixture<CreateTagCategoryModalComponent>;
  let instance: CreateTagCategoryModalComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        }),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        CreateTagCategoryModalComponent
      ],
      providers: [
        {
          provide: TagApiService,
          useValue: { validateNewTagCategoryName: jest.fn() }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CreateTagCategoryModalComponent);
    instance = fixture.componentInstance;
  });

  it('(the modal) should match the snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should dispatch a CloseCreateTagCategoryModal action when handleModalDismissed is called`, () => {
    const expectedAction = new fromTagCategoriesActions.CloseCreateTagCategoryModal();

    instance.handleModalDismissed();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should call setPlaceholderOnBlur method when the textarea focus is changed', () => {
    spyOn(instance, 'setPlaceholderOnBlur');

    fixture.detectChanges();

    // Find the textarea in the template and trigger a blur event
    const textArea = fixture.debugElement.query(By.css('.text-area-no-resize'));
    textArea.triggerEventHandler('blur', {target: {placeholder: ''}});

    expect(instance.setPlaceholderOnBlur).toHaveBeenCalled();
  });

  it('should call CreateTagCategory action when handleFormSubmit called', () => {
    const name = 'new tag';
    const description = 'description';
    instance.name.setValue(name);
    instance.description.setValue(description);
    const upsertRequest: UpsertTagCategoryRequest = {
      DisplayName: name,
      EntityTypesFlag: 0,
      Description: description
    };
    const expectedAction = new fromTagCategoriesActions.CreateTagCategory(upsertRequest);

    instance.handleFormSubmit();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
});
