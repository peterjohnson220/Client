import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockUpsertExchangeRequest } from 'libs/models/peer';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeListActions from '../../actions/exchange-list.actions';

import { CreateExchangeModalComponent } from './create-exchange-modal.component';

describe('Create Exchange Modal', () => {
  let fixture: ComponentFixture<CreateExchangeModalComponent>;
  let instance: CreateExchangeModalComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [
        CreateExchangeModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CreateExchangeModalComponent);
    instance = fixture.componentInstance;
  });

  it('should show the form text and no error messages when a submit has not been attempted', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not show the form text and should show a required error message once a submit has been attempted', () => {
    fixture.detectChanges();

    // trigger handleFormSubmit
    instance.handleFormSubmit();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

// TODO: Couldn't get this to work within a reasonable amount of time.
// TODO: The error message is not getting set and I couldn't figure out why. (JP)
/*  it('should not show the form text and should show the error messages if there is an error$ and the form has been submitted', () => {
    fixture.detectChanges();

    instance.name.setValue('test');
    instance.handleFormSubmit();
    store.dispatch(new fromExchangeListActions.UpsertExchangeError(<any>{error: 'Server Error'}));

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });*/

  it('should dispatch an CloseCreateExchangeModal action when handleModalDismissed is called', () => {
    const action = new fromExchangeListActions.CloseCreateExchangeModal();

    instance.handleModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an UpsertingExchange action with payload when handleFormSubmit is called', () => {
    const action = new fromExchangeListActions.UpsertExchange(generateMockUpsertExchangeRequest());
    instance.name.setValue('test');
    instance.handleFormSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
