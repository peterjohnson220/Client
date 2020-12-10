import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { MockSelectedCompany } from 'libs/features/company/company-selector/models/';
import * as fromEntityIdentifierActions from 'libs/features/company/entity-identifier/actions/entity-identifier.actions';
import { MockEntityIdentifierViewModelOptions } from 'libs/features/company/entity-identifier/models/entity-identifiers-view.model';

import { CustomEmployeeIdentifierComponent } from './custom-employee-identifier.component';
import { EmployeeKeyStep } from './employee-key-step.enum';

describe('CustomEmployeeIdentifierComponent', () => {
  let fixture: ComponentFixture<CustomEmployeeIdentifierComponent>;
  let store: MockStore<any>;
  let instance: CustomEmployeeIdentifierComponent;
  const mockCompany = MockSelectedCompany();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomEmployeeIdentifierComponent],
      providers: [provideMockStore({})],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CustomEmployeeIdentifierComponent);
    instance = fixture.componentInstance;
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  describe('areStepsValid()', function () {
    const testCases = [
      { step: EmployeeKeyStep.Company, selectedCompany: null, result: false },
      { step: EmployeeKeyStep.Company, selectedCompany: mockCompany, result: true },
      { step: EmployeeKeyStep.Fields, selectedCompany: mockCompany, employeeFields: null, result: false },
      { step: EmployeeKeyStep.Fields, selectedCompany: mockCompany, employeeFields: MockEntityIdentifierViewModelOptions(), result: true }
    ];

    testCases.forEach((test, index) => {
      it(`should validate areStepsValid scenario ${index} correctly`, () => {
        instance.step = test.step;
        instance.selectedCompany = test.selectedCompany;
        instance.employeeFields = test.employeeFields;
        fixture.detectChanges();
        expect(instance.areStepsValid()).toEqual(test.result);
      });
    });
  });

  it('should dispatch PutEmployeeIdentifiers on submitChanges()', () => {
    instance.employeeFields = MockEntityIdentifierViewModelOptions();
    instance.selectedCompany = mockCompany;
    instance.submitChanges();
    const action = new fromEntityIdentifierActions.PutEmployeeIdentifiers(13, instance.employeeFields.filter(f => f.isChecked).map(f => f.Field), undefined);
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should checkfield on click', () => {
    instance.employeeFields = MockEntityIdentifierViewModelOptions();
    instance.checkboxChanged(true, instance.employeeFields[3]);
    expect(instance.employeeFields[3].isChecked).toBe(true);
  });

  it('should not checkfield on click with 4 items', () => {
    instance.employeeFields = MockEntityIdentifierViewModelOptions();
    instance.employeeFields[1].isChecked = true;
    instance.employeeFields[2].isChecked = true;
    instance.employeeFields[3].isChecked = true;

    window.confirm = jest.fn();

    instance.checkboxChanged(true, instance.employeeFields[4]);
    expect(instance.employeeFields[4].isChecked).toBe(false);
  });

});
