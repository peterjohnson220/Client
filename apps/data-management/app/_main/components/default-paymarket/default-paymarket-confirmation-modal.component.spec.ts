import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { StoreModule, combineReducers, Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromFieldMappingReducer from '../../reducers';
import * as fromFieldMappingActions from '../../actions/field-mapping.actions';
import { DefaultPaymarketConfirmationModalComponent } from './default-paymarket-confirmation-modal.component';

describe('Data Management - Main - Default Paymarket Modal Component', () => {
  let component: DefaultPaymarketConfirmationModalComponent;
  let fixture: ComponentFixture<DefaultPaymarketConfirmationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          fieldMappingPage: combineReducers(fromFieldMappingReducer.reducers),
        }),
      ],
      declarations: [
        DefaultPaymarketConfirmationModalComponent,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultPaymarketConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch a dismiss action on handleDismissDefaultPaymarketsModal', inject(
    [Store],
    (store: Store<fromFieldMappingReducer.State>) => {
      // arrange
      const saveDefaultPaymarket = true;
      const expectedAction = new fromFieldMappingActions.DismissDefaultPaymarketModal({
        saveDefaultPaymarket,
      });
      const spy = jest.spyOn(store, 'dispatch');

      // act
      component.handleDismissDefaultPaymarketsModal(saveDefaultPaymarket);

      // assert
      expect(spy).toBeCalledWith(expectedAction);
    }
  ));
});
