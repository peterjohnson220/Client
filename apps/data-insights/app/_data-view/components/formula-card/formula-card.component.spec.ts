import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { FormulaCardComponent } from './formula-card.component';
import { generateMockField } from '../../../_main/models';

describe('FormulaCardComponent', () => {
  let instance: FormulaCardComponent;
  let fixture: ComponentFixture<FormulaCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(FormulaCardComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should emit editFormulaClicked when handling edit formula', () => {
    const field = generateMockField();
    spyOn(instance.editFormulaClicked, 'emit');

    instance.handleEditFormulaClick(field);

    expect(instance.editFormulaClicked.emit).toHaveBeenCalledWith(field);
  });
});
