import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import 'rxjs/add/observable/of';

import * as fromRootState from 'libs/state/state';
import { generateMockUserManagementDto } from 'libs/models/payfactors-api/user';
import { RouteTrackingService } from 'libs/core/services';

import * as fromUserActions from '../actions/user-management.actions';
import * as fromUserReducer from '../reducers';
import { UserPageComponent } from './user.page';

describe('Admin - Company Admin - User Page', () => {
  let instance: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;
  let store: Store<fromUserReducer.State>;
  let router: Router;
  let route: ActivatedRoute;
  let routeTrackingService: RouteTrackingService;

  const mockCompanyId = 13;
  const mockUserId = 25;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_usermanagement_user: combineReducers(fromUserReducer.reducers),
        })
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { userId : 25, companyId: 13 } } }
        },
        {
          provide: RouteTrackingService,
          useValue: {
            goBack: jest.fn()
          }
        },
      ],
      declarations: [
        UserPageComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    routeTrackingService = TestBed.inject(RouteTrackingService);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UserPageComponent);
    instance = fixture.componentInstance;
  }));

  it('Should show the add user page', () => {
    instance.userId = null;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('Should show the edit user page', () => {
    instance.userId = mockUserId;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('Should dispatch an LoadRoles action on initial load', () => {
    const expectedAction = new fromUserActions.LoadRoles(mockCompanyId);

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch an LoadUser action for edits', () => {
    const expectedAction = new fromUserActions.LoadUser(mockUserId);

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch an ResetUser action for adding new user', () => {
    const expectedAction = new fromUserActions.ResetUser();
    route.snapshot.params.userId = null;

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch an SaveUser action on Save', () => {
    const mockUser = generateMockUserManagementDto();
    const expectedAction = new fromUserActions.SaveUser(mockUser);

    instance.save(mockUser);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should call goBack on the route tracking service upon cancel', () => {
    spyOn(routeTrackingService, 'goBack');

    instance.handleCancel();

    expect(routeTrackingService.goBack).toHaveBeenCalled();
  });

});
