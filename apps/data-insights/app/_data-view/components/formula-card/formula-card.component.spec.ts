import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { generateMockField } from 'libs/ui/formula-editor';

import { FormulaCardComponent } from './formula-card.component';

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

  it('should emit deleteFormulaClick when handling delete formula', () => {
    const field = generateMockField();
    spyOn(instance.deleteClicked, 'emit');

    instance.handleDeleteFormulaClick(field);

    expect(instance.deleteClicked.emit).toHaveBeenCalledWith(field);
  });
});
