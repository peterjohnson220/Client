import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

import * as fromRootState from 'libs/state/state';
import { TagApiService } from 'libs/data/payfactors-api/tags';
import { UpsertTagCategoryRequest } from 'libs/models/peer/requests';
import { OperatorEnum } from 'libs/constants';

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
        // Even though we are doing shallow testing a weird error will occur with the kendo switch because one of
        // its inputs is prefixed with 'on'. Need to import the module to get the template to parse. [BG]
        SwitchModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        }),
        FormsModule,
        ReactiveFormsModule,
        DropDownListModule
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

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CreateTagCategoryModalComponent);
    instance = fixture.componentInstance;
  });

  it('(the modal) should match the snapshot', () => {
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
    const dataType = 'Text';
    const useSlider = false;
    instance.name.setValue(name);
    instance.description.setValue(description);
    instance.dataType.setValue(dataType);
    instance.useSlider.setValue(useSlider);
    const upsertRequest: UpsertTagCategoryRequest = {
      DisplayName: name,
      EntityTypesFlag: 0,
      Description: description,
      DataType: dataType,
      UseSlider: useSlider,
      CategoryOperator: OperatorEnum[OperatorEnum.And],
      DisplayOperatorToggle: false
    };
    const expectedAction = new fromTagCategoriesActions.CreateTagCategory(upsertRequest);

    instance.handleFormSubmit();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
});
