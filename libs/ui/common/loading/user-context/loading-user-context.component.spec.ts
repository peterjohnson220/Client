import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import * as fromUserContextActions from 'libs/state/app-context/actions/user-context.actions';

import { LoadingUserContextComponent } from './loading-user-context.component';


describe('Loading User Context', () => {
  let fixture: ComponentFixture<LoadingUserContextComponent>;
  let instance: LoadingUserContextComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
      ],
      declarations: [
        LoadingUserContextComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(LoadingUserContextComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch a GetUserContext action upon Init', () => {
    const action = new fromUserContextActions.GetUserContext();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should show a router outlet, when we are not getting the user context', () => {
    instance.gettingUserContext$ = of(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
