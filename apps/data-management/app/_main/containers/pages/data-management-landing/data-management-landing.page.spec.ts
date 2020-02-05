import {NO_ERRORS_SCHEMA} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Router} from '@angular/router';

import {Store} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';

import * as fromHrisConnectionReducer from '../../../reducers/hris-connection.reducer';
import * as fromHrisConnectionActions from '../../../actions/hris-connection.actions';

import { DataManagementLandingPageComponent } from './data-management-landing.page';

describe('DataManagementLandingPageComponent', () => {
  let component: DataManagementLandingPageComponent;
  let fixture: ComponentFixture<DataManagementLandingPageComponent>;
  let store: MockStore<any>;
  let router: Router;

  const initialState = { data_management: { hrisConnection: fromHrisConnectionReducer.initialState } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState}),
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        }
      ],
      declarations: [DataManagementLandingPageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataManagementLandingPageComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch a get connection summary action on init', () => {
    spyOn(store, 'dispatch');

    fixture.detectChanges();

    const expectedAction = new fromHrisConnectionActions.GetHrisConnectionSummary();
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
