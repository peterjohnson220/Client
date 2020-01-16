import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Subject } from 'rxjs/Subject';

import { FormulaEditorComponent } from './formula-editor.component';
import { SuggestionIndicatorType, Function, SpecialCharacter } from '../../models';

describe('Data Insights - Data View - Formula Editor', () => {
  let instance: FormulaEditorComponent;
  let fixture: ComponentFixture<FormulaEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaEditorComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(FormulaEditorComponent);
    instance = fixture.componentInstance;
    instance.fieldSuggestions = [
      { Name: 'Employees.Base', Value: 'Employees.Base' },
      { Name: 'Structures.Mid', Value: 'Structures.Mid' }];
    instance.suggestionList = {
      filterChange: new Subject(),
      reset: jest.fn(),
      writeValue: function(val: string) { this.value = val; },
      value: '',
      toggle: jest.fn()
    } as any;

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

    expect(instance.suggestionIndicator.Type).toEqual(SuggestionIndicatorType.Field);
  });

  it('should set selectedSuggestionType to Function if previous character is dollar sign', () => {
    instance.inputValue = '$I';
    fixture.detectChanges();

    instance.handleInputValueChanged(instance.inputValue);

    expect(instance.suggestionIndicator.Type).toEqual(SuggestionIndicatorType.Function);
  });

  it('should display popup with suggestions if matched results found', () => {
    const editor = fixture.debugElement.query(By.css('.formula')).nativeElement;
    const filteredSuggestions = [
      { Name: 'Employees.Base', Value: 'Employees.Base' }
    ];
    instance.suggestionIndicator.Index = 0;
    instance.suggestionIndicator.Entered = true;
    instance.suggestionIndicator.Character = SpecialCharacter.OpenBracket;
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
    instance.suggestionIndicator.Index = 0;
    instance.suggestionIndicator.Entered = true;
    instance.suggestionIndicator.Character = SpecialCharacter.OpenBracket;
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
    instance.suggestionIndicator.Index = 0;
    instance.suggestionIndicator.Entered = true;
    instance.suggestionIndicator.Type = SuggestionIndicatorType.Field;
    instance.inputValue = '[B';
    editor.setSelectionRange(2, 2);
    fixture.detectChanges();

    instance.handleSuggestionClicked('Employees.Base');

    expect(instance.inputValue.trim()).toEqual('[Employees.Base]');
  });

  it('should insert correct function format when handling function suggestion clicked', () => {
    const editor = fixture.debugElement.query(By.css('.formula')).nativeElement;
    instance.suggestionIndicator.Index = 0;
    instance.suggestionIndicator.Entered = true;
    instance.suggestionIndicator.Character = SpecialCharacter.DollarSign;
    instance.suggestionIndicator.Type = SuggestionIndicatorType.Function;
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
