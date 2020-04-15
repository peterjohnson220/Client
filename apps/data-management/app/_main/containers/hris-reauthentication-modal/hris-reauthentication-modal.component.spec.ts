import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';

import * as fromRootState from 'libs/state/state';

import * as fromDataManagementMainReducer from '../../reducers';
import * as fromHrisConnectionActions from '../../actions/hris-connection.actions';

import { HrisReAuthenticationModalComponent } from './hris-reauthentication-modal.component';

describe('Data Management - Main - Hris Re-Authentication Modal', () => {
  let instance: HrisReAuthenticationModalComponent;
  let fixture: ComponentFixture<HrisReAuthenticationModalComponent>;
  let store: Store<fromDataManagementMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          transferDataMain: combineReducers(fromDataManagementMainReducer.reducers),
        }),
        ReactiveFormsModule
      ],
      providers: [],
      declarations: [
        HrisReAuthenticationModalComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(HrisReAuthenticationModalComponent);
    instance = fixture.componentInstance;

  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
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

  it('should dispatch an action on handleFormSubmit', () => {
    const mockFormData = {
      username: 'MockUserName',
      password: 'MockPassword'
    };
    const expectedAction = new fromHrisConnectionActions.PatchConnection(mockFormData);
    instance.hrisReAuthenticateForm.setValue(mockFormData);

    spyOn(store, 'dispatch');


    instance.handleFormSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action on dismiss of the modal', () => {
    const expectedAction = new fromHrisConnectionActions.OpenReAuthenticationModal(false);

    spyOn(store, 'dispatch');

    instance.handleModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
