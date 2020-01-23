import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';


import {combineReducers, Store, StoreModule} from '@ngrx/store';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromDataInsightsMainReducer from '../../../_main/reducers';
import * as fromRootState from 'libs/state/state';

import { FormulasComponent } from './formulas.component';
import { generateMockField } from '../../../_main/models';
import { FormulaFieldModalComponent } from '../formula-field-modal';


describe('FormulasComponent', () => {
  let instance: FormulasComponent;
  let fixture: ComponentFixture<FormulasComponent>;
  let store: Store<fromDataInsightsMainReducer.State>;
  let formBuilder: FormBuilder;
  let ngbModal: NgbModal;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers),
        }),
        ReactiveFormsModule
      ],
      declarations: [ FormulasComponent, FormulaFieldModalComponent ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() },
        },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(FormulasComponent);
    instance = fixture.componentInstance;
    formBuilder = new FormBuilder();
    ngbModal = TestBed.get(NgbModal);
    store = TestBed.get(Store);

    fixture.detectChanges();
  });

  it('should open edit formula modal when handling edit clicked', () => {
    const field = generateMockField();
    spyOn(instance.formulaFieldModal, 'open');

    instance.handleEditFormulaClicked(field);

    expect(instance.formulaFieldModal.open).toHaveBeenCalled();
  });

  it('should open formula modal when handling create formula', () => {
    spyOn(instance.formulaFieldModal, 'open');

    instance.handleCreateFormulaFieldClicked();

    expect(instance.formulaFieldModal.open).toHaveBeenCalled();
  });
});
