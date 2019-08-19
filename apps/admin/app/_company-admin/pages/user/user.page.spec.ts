import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromUserReducer from '../../reducers';
import * as fromUserActions from '../../actions';

import { UserPageComponent } from './user.page';
import { generateMockUserManagementDto } from 'libs/models/payfactors-api/user';

describe('Admin - Company Admin - User Page - Add', () => {
  let instance: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;
  let store: Store<fromUserReducer.State>;
  let route: ActivatedRoute;

  const mockCompanyId = 13;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          companyAdminMain: combineReducers(fromUserReducer.reducers),
        }),
      ],
      declarations: [
        UserPageComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { companyId: mockCompanyId } }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.get(Store);
    route = TestBed.get(ActivatedRoute);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UserPageComponent);

    instance = fixture.componentInstance;

  }));

  it('Should show the add new user page', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('Should dispatch an LoadRoles action on initial load', () => {
    const expectedAction = new fromUserActions.LoadRoles(mockCompanyId);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch an ResetUser action on initial load', () => {
    const expectedAction = new fromUserActions.ResetUser();
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch an SaveUser action on Save', () => {
    const mockUser = generateMockUserManagementDto();
    const expectedAction = new fromUserActions.SaveUser(mockUser);

    instance.save(mockUser);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});



describe('Admin - Company Admin - User Page - Edit', () => {
  let instance: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;
  let store: Store<fromUserReducer.State>;
  let route: ActivatedRoute;

  const mockCompanyId = 13;
  const mockUserId = 25;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          companyAdminMain: combineReducers(fromUserReducer.reducers),
        })
      ],
      declarations: [
        UserPageComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            navigate: jest.fn(),
            snapshot: { params: { companyId: mockCompanyId, userId: mockUserId } }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.get(Store);
    route = TestBed.get(ActivatedRoute);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UserPageComponent);
    instance = fixture.componentInstance;
  });

  it('Should show the edit user page', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('Should dispatch an LoadUser action on initial load', () => {
    const expectedAction = new fromUserActions.LoadUser(mockUserId);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
