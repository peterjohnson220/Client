import {Router} from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { Store } from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';

import { ResetIntegrationPageComponent } from './reset-integration.page';
import * as fromHrisConnectionReducer from '../../../reducers/hris-connection.reducer';
import * as fromHrisConnectionActions from '../../../actions/hris-connection.actions';

describe('ResetIntegrationPageComponent', () => {
  let instance: ResetIntegrationPageComponent;
  let fixture: ComponentFixture<ResetIntegrationPageComponent>;
  let store: MockStore<any>;
  let router: Router;

  const initialState = { data_management: { hrisConnection: fromHrisConnectionReducer.initialState } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        }
      ],
      declarations: [
        ResetIntegrationPageComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ResetIntegrationPageComponent);
    instance = fixture.componentInstance;
    router = TestBed.inject(Router);
  }));

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should get the current hris connection on init', () => {
    spyOn(store, 'dispatch');

    fixture.detectChanges();

    const expectedAction = new fromHrisConnectionActions.GetCurrentHrisConnection();
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
  });

  it('should soft delete an hris connection on reset', () => {
    spyOn(store, 'dispatch');

    fixture.detectChanges();
    instance.doReset();

    const expectedAction = new fromHrisConnectionActions.DeleteHRISConnection();
    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should go home if goHome is called', () => {
    spyOn(router, 'navigate');

    fixture.detectChanges();
    instance.goHome();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
