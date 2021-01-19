import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromAutoShareActions from '../../actions/auto-share.actions';
import * as fromProjectListActions from '../../../../../../apps/project/app/_project-list/actions';
import * as fromAutoShareReducer from '../../reducers';
import * as fromRootState from '../../../../../state/state';
import { AutoShareModalComponent } from './auto-share-modal.component';
import { generateMockAutoShareUser } from '../../../../../models/user-settings';
import { InputDebounceComponent } from '../../../../../forms/components/input-debounce';
import { ShareModalOperation } from '../../../../../models/share-modal/share-modal-operation';

describe('AutoShareModalComponent', () => {
  let fixture: ComponentFixture<AutoShareModalComponent>;
  let instance: AutoShareModalComponent;
  let store: Store<fromRootState.State>;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          autoShare: combineReducers(fromAutoShareReducer.reducers)
        })
      ],
      declarations: [ AutoShareModalComponent, InputDebounceComponent ],
      providers: [FormBuilder],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    store = TestBed.inject(Store);
    formBuilder = new FormBuilder();
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(AutoShareModalComponent);
    instance = fixture.componentInstance;
    instance.modalOperation = ShareModalOperation.BulkProjectShare;
    instance.emailForm = formBuilder.group({
      CustomEmailMessage: ['', []]
    });
    instance.emailForm.patchValue({
      CustomEmailMessage: 'TEST MESSAGE'
    });
  });

  it('should dispatch an CloseAutoShareModal action when handleModalDismissed is called', () => {
    const expectedAction = new fromAutoShareActions.CloseAutoShareModal();

    instance.handleModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it.each([
    ['Linda', ['Linda A', 'Linda B', 'Linda C']],
    ['Linda B', ['Linda B']],
    ['Larry', []]
  ])('should return the expected search results', (searchValue, searchResults) => {
    instance.shareableUsers = [
      { ...generateMockAutoShareUser(), FullName: 'Bob ' },
      { ...generateMockAutoShareUser(), FullName: 'Linda A' },
      { ...generateMockAutoShareUser(), FullName: 'Linda B' },
      { ...generateMockAutoShareUser(), FullName: 'Linda C' },
    ];

    instance.handleSearchValueChanged(searchValue);
    const filteredFullNames = instance.filteredShareableUsers.map(u => u.FullName);

    expect(filteredFullNames).toEqual(searchResults);
  });

  it('should toggle the isSelected property when handleToggleSelectedUser is called', () => {
    instance.shareableUsers = [
      {...generateMockAutoShareUser(), IsSelected: false}
    ];
    const selectedUser = {...generateMockAutoShareUser(), IsSelected: true};

    instance.handleToggleSelectedUser(selectedUser);

    expect(selectedUser.IsSelected).toEqual(true);
  });

  it('should dispatch BulkProjectShare when handleOnSubmit is called with modalOperation being BulkProjectShare', () => {
    instance.shareableUsers = [
      {...generateMockAutoShareUser(), IsSelected: true},
      {...generateMockAutoShareUser(), IsSelected: false, FirstName: 'Jack'},
      {...generateMockAutoShareUser(), IsSelected: true, FirstName: 'JackTheSecond'},
    ];
    const selectedUserIds = instance.shareableUsers.filter(u => u.IsSelected === true).map(x => x.UserId);
    const expectedAction = new fromProjectListActions.BulkProjectShare({UserIds: selectedUserIds}, 'TEST MESSAGE');

    instance.handleOnSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch SaveAutoShareUsers when handleOnSubmit is called with modalOperation being SaveAutoShareUsers', () => {
    instance.shareableUsers = [
      {...generateMockAutoShareUser(), IsSelected: true},
      {...generateMockAutoShareUser(), IsSelected: false, FirstName: 'Jack'},
      {...generateMockAutoShareUser(), IsSelected: true, FirstName: 'JackTheSecond'},
    ];
    instance.modalOperation = ShareModalOperation.SaveAutoShareUsers;
    const selectedUserIds = instance.shareableUsers.filter(u => u.IsSelected === true).map(x => x.UserId);
    const expectedAction = new fromAutoShareActions.SaveAutoShareUsers({UserIds: selectedUserIds});

    instance.handleOnSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
