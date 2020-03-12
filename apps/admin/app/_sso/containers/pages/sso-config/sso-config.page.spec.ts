import { ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import * as fromRootState from 'libs/state/state';
import * as fromSsoConfigReducers from '../../../reducers';
import * as fromSsoConfigActions from '../../../actions/sso-config.actions';
import { SsoConfigPageComponent } from './sso-config.page';



describe('Sso Config Page', () => {
  let instance: SsoConfigPageComponent;
  let fixture: ComponentFixture<SsoConfigPageComponent>;
  let store: Store<fromSsoConfigReducers.State>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          sso_ssoConfig: combineReducers(fromSsoConfigReducers.reducers),
        })
      ],
      declarations: [ SsoConfigPageComponent ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(SsoConfigPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    router = TestBed.get(Router);
  });

  it('should dispatch GetSsoConfigurations on Init', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSsoConfigActions.GetSsoConfiguration();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch OpenAddSsoConfigModal action when addSsoConfig is triggered', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSsoConfigActions.OpenAddSsoConfigModal();
    const testEvent = new Event('click');

    instance.OpenAddSsoModal(testEvent);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
