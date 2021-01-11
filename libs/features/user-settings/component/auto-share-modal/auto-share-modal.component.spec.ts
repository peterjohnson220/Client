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
