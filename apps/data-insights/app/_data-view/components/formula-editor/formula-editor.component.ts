import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';

import { SuggestionIndicator, functionNames, SuggestionIndicatorType, SpecialCharacter, Suggestion } from '../../models';
import { FormulaHelper } from '../../helpers';

@Component({
  selector: 'pf-formula-editor',
  templateUrl: './formula-editor.component.html',
  styleUrls: ['./formula-editor.component.scss']
})
export class FormulaEditorComponent implements OnInit {
  @Input() initialFormula: string;
  @Input() fieldSuggestions: Suggestion[];
  @Input() validating: boolean;
  @Input() isValid: boolean;
  @Input() disabled: boolean;
  @Input() isWaitingForValidation: boolean;
  @Output() formulaChanged: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('editor', { static: true }) editor: ElementRef;
  @ViewChild('suggestionList', { static: true }) suggestionList: DropDownListComponent;

  readonly MIN_QUERY_LENGTH = 1;
  readonly formulaMaxLength = 5000;
  readonly popupSettings = {
    width: 'auto',
    anchorAlign: { horizontal: 'right', vertical: 'bottom' },
    popupAlign: { horizontal: 'left', vertical: 'top' }
  };
  suggestions: Suggestion[];
  filteredSuggestions: Suggestion[];
  inputValue: string;
  searchTerm: string;
  beforeMarkerValues: string;
  markerValue: string;
  afterMarkerValues: string;
  showPopup: boolean;
  isInsertingFunctionTemplate: boolean;
  suggestionIndicator: SuggestionIndicator;

  ngOnInit(): void {
    this.initEditorData(this.initialFormula);
  }

  handleInputValueChanged(value: string): void {
    this.formulaChanged.emit(value);
    this.updatePopupMarkerValue();
    this.resetEditorIfInputValueIsEmpty();
    this.resetSuggestionIndicatorIfIndicatorRemoved();
    if (this.suggestionIndicator.Entered) {
      this.showPopupIfSuggestionsFound();
    } else {
      this.checkIfSuggestionIndicatorEntered();
    }
  }

  handleEditorKeyDown(event: any): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      return;
    }
    if ((event.key === 'ArrowDown' || event.key === 'Down') && this.showPopup && !this.suggestionList.isFocused) {
      event.preventDefault();
      this.suggestionList.focus();
    }
  }

  handleEditorKeyUp(event: any): void {
    this.isInsertingFunctionTemplate = false;
  }

  handleSuggestionClicked(suggestion: string): void {
    if (this.suggestionIndicator.Index === -1) {
      return;
    }
    const fromIndex: number = this.suggestionIndicator.Index;
    const toIndex: number = this.editor.nativeElement.selectionStart;
    const textToInsert = this.getFormattedSelectedSuggestion(suggestion, toIndex);
    this.insertSelectedSuggestionIntoEditor(fromIndex, toIndex, textToInsert);
    this.resetSuggestionIndicator();
    this.suggestionList.reset();
    this.setEditorFocus();
  }

  handleClickElsewhere(): void {
    this.showPopup = false;
  }

  public get hideValidatingMessage(): boolean {
    return (!this.inputValue || this.inputValue.length === 0 || this.isInsertingFunctionTemplate || this.isWaitingForValidation);
  }

  private initEditorData(formula: string): void {
    this.inputValue = formula;
    this.filteredSuggestions = [];
    this.suggestions = [];
    this.searchTerm = '';
    this.showPopup = false;
    this.suggestionIndicator = FormulaHelper.buildSuggestionIndicator();
  }

  private checkIfSuggestionIndicatorEntered(): void {
    const lastCharacterIndex: number = this.editor.nativeElement.selectionStart - 1;
    const lastCharacter = this.inputValue.charAt(lastCharacterIndex);
    switch (lastCharacter) {
      case SpecialCharacter.OpenBracket: {
        this.suggestionIndicator.Character = SpecialCharacter.OpenBracket;
        this.updateSuggestions(lastCharacterIndex, SuggestionIndicatorType.Field, this.fieldSuggestions);
        break;
      }
      case SpecialCharacter.DollarSign: {
        this.suggestionIndicator.Character = SpecialCharacter.DollarSign;
        this.updateSuggestions(lastCharacterIndex, SuggestionIndicatorType.Function, functionNames);
        break;
      }
      default: {
        break;
      }
    }
  }

  private updateSuggestions(suggestionIndicatorIndex: number, type: SuggestionIndicatorType, suggestions: Suggestion[]): void {
    this.suggestionIndicator.Entered = true;
    this.suggestionIndicator.Index = suggestionIndicatorIndex;
    this.suggestionIndicator.Type = type;
    this.suggestions = suggestions;
  }

  private resetEditorIfInputValueIsEmpty(): void {
    if (this.inputValue.length === 0) {
      this.showPopup = false;
      this.suggestionList.toggle(false);
      this.initEditorData('');
      return;
    }
  }

  private getFormattedSelectedSuggestion(suggestion: string, selectionStartIndex: number): string {
    let textToInsert = '';
    switch (this.suggestionIndicator.Type) {
      case SuggestionIndicatorType.Field: {
        const selectionStartCharacter: string = this.inputValue.charAt(selectionStartIndex);
        textToInsert = FormulaHelper.getFormattedField(suggestion, selectionStartCharacter);
        break;
      }
      case SuggestionIndicatorType.Function: {
        textToInsert = FormulaHelper.getFormattedFunction(suggestion);
        break;
      }
      default: {
        break;
      }
    }
    return textToInsert;
  }

  private resetSuggestionIndicatorIfIndicatorRemoved(): void {
    if (this.suggestionIndicator.Index === -1) {
      return;
    }
    const suggestionIndicatorRemoved: boolean = this.inputValue.charAt(this.suggestionIndicator.Index) !== this.suggestionIndicator.Character;
    if (suggestionIndicatorRemoved) {
      this.resetSuggestionIndicator();
      this.suggestionList.toggle(false);
    }
  }

  private resetSuggestionIndicator(): void {
    this.suggestionIndicator.Entered = false;
    this.suggestionIndicator.Type = null;
    this.suggestionIndicator.Index = -1;
    this.suggestionIndicator.Character = null;
    this.searchTerm = '';
    this.filteredSuggestions = [];
  }

  private insertSelectedSuggestionIntoEditor(fromIndex: number, toIndex: number, textToInsert: string): void {
    this.isInsertingFunctionTemplate = (this.suggestionIndicator.Type === SuggestionIndicatorType.Function) && (textToInsert && !textToInsert.endsWith('()'));
    this.editor.nativeElement.focus();
    if (typeof this.editor.nativeElement.setRangeText === 'function') {
      this.editor.nativeElement.setRangeText(textToInsert, fromIndex, toIndex, 'end');
    } else {
      const currentValue = this.editor.nativeElement.value;
      this.editor.nativeElement.value = currentValue.slice(0, fromIndex) + textToInsert + currentValue.slice(toIndex);
      this.editor.nativeElement.setSelectionRange(fromIndex + textToInsert.length, fromIndex + textToInsert.length);
    }
    this.inputValue = this.editor.nativeElement.value;
    if (!this.isInsertingFunctionTemplate) {
      this.formulaChanged.emit(this.inputValue);
    }
  }

  private showPopupIfSuggestionsFound(): void {
    const currentPosition: number = this.editor.nativeElement.selectionStart;
    this.searchTerm = this.inputValue.substring(this.suggestionIndicator.Index + 1, currentPosition);
    if (!!this.searchTerm && this.searchTerm.length >= this.MIN_QUERY_LENGTH) {
      this.filteredSuggestions = this.suggestions.filter((s) => s.Name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1);
      this.showPopup = (this.filteredSuggestions.length !== 0);
      this.suggestionList.toggle(this.showPopup);
    } else {
      this.showPopup = false;
    }
  }

  private setEditorFocus(): void {
    setTimeout(() => {
      document.getElementById('dsFormulaEditor').focus();
    }, 100);
  }

  private updatePopupMarkerValue(): void {
    const currentPosition: number = this.editor.nativeElement.selectionStart;
    this.beforeMarkerValues = this.inputValue.substring(0, this.suggestionIndicator.Index);
    this.markerValue = this.inputValue.substring(this.suggestionIndicator.Index, currentPosition);
    this.afterMarkerValues = this.inputValue.substring(currentPosition, this.inputValue.length);
  }

}
