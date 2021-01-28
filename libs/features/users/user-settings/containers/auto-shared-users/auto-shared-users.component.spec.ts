import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';

import * as fromAutoShareActions from '../../actions/auto-share.actions';
import * as fromAutoShareReducer from '../../reducers';
import { AutoSharedUsersComponent } from './auto-shared-users.component';
import { generateMockAutoShareUser } from '../../../../../models/user-settings';

describe('AutoSharedUsersComponent', () => {
  let fixture: ComponentFixture<AutoSharedUsersComponent>;
  let instance: AutoSharedUsersComponent;
  let store: Store<fromAutoShareReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromAutoShareReducer.reducers
        })
      ],
      declarations: [ AutoSharedUsersComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(AutoSharedUsersComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch RemoveAutoSharedUser action when removeSharedUser clicked', () => {
    const userToRemove = { ...generateMockAutoShareUser(), IsSelected: true};
    const expectedAction = new fromAutoShareActions.RemoveAutoSharedUser(userToRemove.UserId);

    instance.removeSharedUser(userToRemove.UserId);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
