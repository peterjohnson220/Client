import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { UsersListComponent } from './users-list.component';
import * as fromUsersReducer from '../../reducers';
import { generateMockUserGridItems } from '../../models';

describe('Pf-Admin - Users - Users List Component', () => {
  let instance: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let store: Store<fromUsersReducer.State>;
  let router: Router;

  const mockUsersList = generateMockUserGridItems();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          pf_admin: combineReducers(fromUsersReducer.reducers),
        })
      ],
      declarations: [
        UsersListComponent,
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    router = TestBed.get(Router);

    fixture = TestBed.createComponent(UsersListComponent);
    instance = fixture.componentInstance;

    instance.usersList = mockUsersList;
  });

  it('Should show the users list grid when usersList is populated', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
  it('Should navigate to the user page when the row is clicked', () => {
    spyOn(router, 'navigate');

    instance.userSelectionChange(
      {
        selectedRows: [
          {
            dataItem: {
              CompanyId: 1,
              UserId: 1
            }
          }
        ]
      }
    );

    expect(router.navigate).toHaveBeenCalledWith(['/companies/', 1, 'users', 1]);
  });
});
