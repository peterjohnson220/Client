import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { FormulaEditorComponent } from './formula-editor.component';
import { SuggestionIndicatorType, Function } from '../../models';
import { By } from '@angular/platform-browser';

describe('Data Insights - Data View - Formula Editor', () => {
  let instance: FormulaEditorComponent;
  let fixture: ComponentFixture<FormulaEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaEditorComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [ DropDownsModule ]
    });

    fixture = TestBed.createComponent(FormulaEditorComponent);
    instance = fixture.componentInstance;
    instance.fieldSuggestions = ['Employees.Base', 'Structures.Mid'];

    fixture.detectChanges();
  });

  it('should hide suggestion popup if inputValue is empty', () => {
    instance.showPopup = true;
    instance.inputValue = '';
    instance.handleInputValueChanged('');

    expect(instance.showPopup).toEqual(false);
  });

  it('should set selectedSuggestionType to Field if previous character is open bracket', () => {
    instance.inputValue = '[B';
    fixture.detectChanges();

    instance.handleInputValueChanged(instance.inputValue);

    expect(instance.suggestionIndicatorType).toEqual(SuggestionIndicatorType.Field);
  });

  it('should set selectedSuggestionType to Function if previous character is dollar sign', () => {
    instance.inputValue = '$I';
    fixture.detectChanges();

    instance.handleInputValueChanged(instance.inputValue);

    expect(instance.suggestionIndicatorType).toEqual(SuggestionIndicatorType.Function);
  });

  it('should display popup with suggestions if matched results found', () => {
    const editor = fixture.debugElement.query(By.css('.formula')).nativeElement;
    const filteredSuggestions = ['Employees.Base'];
    instance.suggestionIndicatorIndex = 0;
    instance.suggestionIndicatorEntered = true;
    instance.suggestions = instance.fieldSuggestions;
    instance.showPopup = false;
    instance.inputValue = '[B';
    editor.setSelectionRange(2, 2);
    fixture.detectChanges();

    instance.handleInputValueChanged(instance.inputValue);

    expect(instance.showPopup).toEqual(true);
    expect(instance.filteredSuggestions).toEqual(filteredSuggestions);
  });

  it('should NOT display popup if NONE matched results found', () => {
    const editor = fixture.debugElement.query(By.css('.formula')).nativeElement;
    const filteredSuggestions = [];
    instance.suggestionIndicatorIndex = 0;
    instance.suggestionIndicatorEntered = true;
    instance.suggestions = instance.fieldSuggestions;
    instance.showPopup = false;
    instance.inputValue = '[Bonus';
    editor.setSelectionRange(6, 6);
    fixture.detectChanges();

    instance.handleInputValueChanged(instance.inputValue);

    expect(instance.showPopup).toEqual(false);
    expect(instance.filteredSuggestions).toEqual(filteredSuggestions);
  });

  it('should insert correct field format when handling field suggestion clicked', () => {
    const editor = fixture.debugElement.query(By.css('.formula')).nativeElement;
    instance.suggestionIndicatorIndex = 0;
    instance.suggestionIndicatorEntered = true;
    instance.suggestionIndicatorType = SuggestionIndicatorType.Field;
    instance.inputValue = '[B';
    editor.setSelectionRange(2, 2);
    fixture.detectChanges();

    instance.handleSuggestionClicked('Employees.Base');

    expect(instance.inputValue.trim()).toEqual('[Employees.Base]');
  });

  it('should insert correct function format when handling function suggestion clicked', () => {
    const editor = fixture.debugElement.query(By.css('.formula')).nativeElement;
    instance.suggestionIndicatorIndex = 0;
    instance.suggestionIndicatorEntered = true;
    instance.suggestionIndicatorType = SuggestionIndicatorType.Function;
    instance.inputValue = '$I';
    editor.setSelectionRange(2, 2);
    fixture.detectChanges();

    instance.handleSuggestionClicked('IF');

    expect(instance.inputValue.trim()).toEqual(Function.IF);
  });

  it('should hide popup if clicking outside of the editor', () => {
    instance.showPopup = true;

    instance.handleClickElsewhere();

    expect(instance.showPopup).toEqual(false);
  });
});
