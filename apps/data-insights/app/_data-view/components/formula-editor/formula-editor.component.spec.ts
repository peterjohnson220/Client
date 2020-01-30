import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { FormulaEditorComponent } from './formula-editor.component';

describe('Data Insights - Data View - Formula Editor', () => {
  let instance: FormulaEditorComponent;
  let fixture: ComponentFixture<FormulaEditorComponent>;
  const codeMirrorComponent: any = { codeMirror: { on: jest.fn() } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaEditorComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(FormulaEditorComponent);
    instance = fixture.componentInstance;
    instance.codeMirrorComponent = codeMirrorComponent;
    fixture.detectChanges();
  });

  it('should emit formulaChanged when handling input value changed', () => {
    spyOn(instance.formulaChanged, 'emit');

    instance.handleInputValueChanged('[Employee.Base]');

    expect(instance.formulaChanged.emit).toHaveBeenCalledWith('[Employee.Base]');
  });

});
