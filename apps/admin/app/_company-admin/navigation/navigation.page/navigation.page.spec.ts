import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';


import * as fromNavigationActions from 'libs/features/infrastructure/admin-navigation-links/actions/navigation.actions';
import * as fromNavigationReducer from 'libs/features/infrastructure/admin-navigation-links/reducers';

import { NavigationPageComponent } from './navigation.page';

describe('Admin - Company-Admin - Navigation Page', () => {
  let instance: NavigationPageComponent;
  let fixture: ComponentFixture<NavigationPageComponent>;
  let store: Store<fromNavigationReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          pf_admin: combineReducers(fromNavigationReducer.reducers),
        })
      ],
      declarations: [ NavigationPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(NavigationPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
  });

  it('Should dispatch a LoadNavigationLinks Action when the page is loaded', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromNavigationActions.LoadNavigationLinks('company-admin');
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
