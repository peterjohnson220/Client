import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {Store} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';

import * as fromHrisConnectionReducer from '../../reducers/hris-connection.reducer';
import * as fromHrisConnectionActions from '../../actions/hris-connection.actions';
import { HrisIntegrationPanelComponent } from './hris-integration-panel.component';


describe('HrisIntegrationPanelComponent', () => {
  let component: HrisIntegrationPanelComponent;
  let fixture: ComponentFixture<HrisIntegrationPanelComponent>;
  let store: MockStore<any>;
  let router: Router;

  const initialState = { data_management: { hrisConnection: fromHrisConnectionReducer.initialState } };

  beforeEach((() => {
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
      declarations: [ HrisIntegrationPanelComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrisIntegrationPanelComponent);
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
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
  });
});
