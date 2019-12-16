import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';

import * as fromDataViewMainReducer from '../../reducers';
import * as fromFormulaFieldActions from '../../actions/formula-field-modal.actions';
import { FormulaFieldModalComponent } from './formula-field-modal.component';
import { FormulaFieldModalObj } from '../../models';

describe('Data Insights - Data View - Formula Field Modal Component', () => {
  let instance: FormulaFieldModalComponent;
  let fixture: ComponentFixture<FormulaFieldModalComponent>;
  let ngbModal: NgbModal;
  let store: Store<fromDataViewMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataViewMainReducer.reducers),
        }),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ FormulaFieldModalComponent ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() },
        },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(FormulaFieldModalComponent);
    instance = fixture.componentInstance;
    ngbModal = TestBed.get(NgbModal);
    store = TestBed.get(Store);

    fixture.detectChanges();
  });

  it('should use the modal service to open the modal when open is called', () => {
    spyOn(ngbModal, 'open');
    instance.open();

    expect(ngbModal.open).toHaveBeenCalled();
  });

  it('should use the modal service to dismiss the modal, when close is called', () => {
    spyOn(ngbModal, 'dismissAll');

    instance.close();

    expect(ngbModal.dismissAll).toHaveBeenCalled();
  });

  it('should dispatch SaveFormula action with FormulaFieldModalObj when handling save clicked', () => {
    spyOn(store, 'dispatch');
    const fieldName = 'Compa-Ratio';
    instance.formulaFieldForm.patchValue( { fieldName });
    instance.formula = '[Base]/[Mid]';
    const payload: FormulaFieldModalObj = {
      FieldName: fieldName,
      Formula: instance.formula,
      FormulaId: null
    };
    const expectedAction = new fromFormulaFieldActions.SaveFormulaField(payload);

    instance.handleSaveClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch ValidateFormula with formula when formula IS NOT empty', () => {
    spyOn(store, 'dispatch');
    const formula = '[Base]/[Mid]';
    instance.baseEntityId = 1;
    const expectedAction = new fromFormulaFieldActions.ValidateFormula({ formula, baseEntityId: instance.baseEntityId });

    instance.handleFormulaChanged(formula);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch ValidateFormula with formula when formula IS empty', () => {
    spyOn(store, 'dispatch');
    const formula = '';
    instance.baseEntityId = 1;
    const action = new fromFormulaFieldActions.ValidateFormula({ formula, baseEntityId: instance.baseEntityId });

    instance.handleFormulaChanged(formula);

    expect(store.dispatch).not.toHaveBeenCalledWith(action);
  });

});
