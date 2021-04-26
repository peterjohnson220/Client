import {NO_ERRORS_SCHEMA} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Router} from '@angular/router';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import { Subject } from 'rxjs/Subject';

import { AbstractFeatureFlagService } from 'libs/core';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromRootState from 'libs/state/state';

import * as fromHrisConnectionReducer from '../../../reducers/hris-connection.reducer';
import * as fromHrisConnectionActions from '../../../actions/hris-connection.actions';

import { DataManagementLandingPageComponent } from './data-management-landing.page';

describe('DataManagementLandingPageComponent', () => {
  let component: DataManagementLandingPageComponent;
  let fixture: ComponentFixture<DataManagementLandingPageComponent>;
  let store: MockStore<any>;
  let router: Router;
  let abstractFeatureFlagService: AbstractFeatureFlagService;
  let settingsService: SettingsService;
  const companySetting = new Subject<boolean>();

  const initialState = {
    ...fromRootState.reducers,
    data_management: { hrisConnection: fromHrisConnectionReducer.initialState }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState}),
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        },
        {
          provide: AbstractFeatureFlagService,
          useValue: { enabled: jest.fn(), bindEnabled: jest.fn() }
        },
        {
          provide: SettingsService,
          useValue: { selectCompanySetting: jest.fn(() => companySetting) }
        },
      ],
      declarations: [DataManagementLandingPageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataManagementLandingPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    abstractFeatureFlagService = TestBed.inject(AbstractFeatureFlagService);
    settingsService = TestBed.inject(SettingsService);
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
