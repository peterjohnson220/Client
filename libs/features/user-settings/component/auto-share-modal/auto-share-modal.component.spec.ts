import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromAutoShareActions from '../../actions/auto-share.actions';
import * as fromAutoShareReducer from '../../reducers';
import * as fromRootState from '../../../../state/state';
import { AutoShareModalComponent } from './auto-share-modal.component';
import { generateMockAutoShareUser } from '../../../../models/user-settings';
import { InputDebounceComponent } from '../../../../forms/components/input-debounce';

describe('AutoShareModalComponent', () => {
  let fixture: ComponentFixture<AutoShareModalComponent>;
  let instance: AutoShareModalComponent;
  let store: Store<fromRootState.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          autoShare: combineReducers(fromAutoShareReducer.reducers)
        })
      ],
      declarations: [ AutoShareModalComponent, InputDebounceComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(AutoShareModalComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch an CloseAutoShareModal action when handleModalDismissed is called', () => {
    const expectedAction = new fromAutoShareActions.CloseAutoShareModal();

    instance.handleModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should return users that contains search value when search value changed', () => {
    instance.shareableUsers = [
      { ...generateMockAutoShareUser() },
      { ...generateMockAutoShareUser(), FirstName: 'Bob' },
      { ...generateMockAutoShareUser(), FirstName: 'Bill' },
      { ...generateMockAutoShareUser(), FirstName: 'Jill' },
      { ...generateMockAutoShareUser(), FirstName: 'Larry' }
    ];

    instance.searchValue = 'Larry';

    const expectedFilteredUser = [{...generateMockAutoShareUser(), FirstName: 'Larry'}];

    instance.handleSearchValueChanged(instance.searchValue);
    fixture.detectChanges();

    expect(instance.filteredShareableUsers).toEqual(expectedFilteredUser);
  });

  it('should return no users when no matching user name found', () => {
    instance.shareableUsers = [
      { ...generateMockAutoShareUser()},
      { ...generateMockAutoShareUser(), FirstName: 'Bob' },
      { ...generateMockAutoShareUser(), FirstName: 'Bill' },
      { ...generateMockAutoShareUser(), FirstName: 'Jill' }
    ];

    instance.searchValue = 'Larry';

    const expectedFilteredUser = [];

    instance.handleSearchValueChanged(instance.searchValue);
    fixture.detectChanges();

    expect(instance.filteredShareableUsers).toEqual(expectedFilteredUser);
  });

  it('should toggle the isSelected property when handleToggleSelectedUser is called', () => {
    instance.shareableUsers = [
      {...generateMockAutoShareUser(), IsSelected: false}
    ];
    const selectedUser = {...generateMockAutoShareUser(), IsSelected: true};

    instance.handleToggleSelectedUser(selectedUser);

    expect(selectedUser.IsSelected).toEqual(true);
  });

  it('should dispatch SaveAutoShareUsers when handleOnSubmit is called', () => {
    instance.shareableUsers = [
      {...generateMockAutoShareUser(), IsSelected: true},
      {...generateMockAutoShareUser(), IsSelected: false, FirstName: 'Jack'},
      {...generateMockAutoShareUser(), IsSelected: true, FirstName: 'JackTheSecond'},
    ];
    const selectedUserIds = instance.shareableUsers.filter(u => u.IsSelected === true).map(x => x.UserId);
    const expectedAction = new fromAutoShareActions.SaveAutoShareUsers(selectedUserIds);

    instance.handleOnSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
