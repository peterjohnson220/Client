import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';

import { SuggestionIndicator, functionNames, SuggestionIndicatorType, SpecialCharacter } from '../../models';
import { FormulaHelper } from '../../helpers';

@Component({
  selector: 'pf-formula-editor',
  templateUrl: './formula-editor.component.html',
  styleUrls: ['./formula-editor.component.scss']
})
export class FormulaEditorComponent implements OnInit, OnDestroy {
  @Input() initialFormula: string;
  @Input() fieldSuggestions: string[];
  @Input() validating: boolean;
  @Input() isValid: boolean;
  @Output() formulaChanged: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('editor', { static: true }) editor: ElementRef;
  @ViewChild('suggestionList', { static: true }) suggestionList: DropDownListComponent;
  inputValueChanged: Subject<string> = new Subject<string>();

  inputValueChangedSubscription: Subscription;

  readonly MIN_QUERY_LENGTH = 1;
  readonly VALIDATE_DEBOUNCE_TIME = 2000;
  readonly formulaMaxLength = 5000;
  readonly popupSettings = {
    width: 'auto',
    anchorAlign: { horizontal: 'right', vertical: 'bottom' },
    popupAlign: { horizontal: 'left', vertical: 'top' }
  };
  suggestions: string[];
  filteredSuggestions: string[];
  inputValue: string;
  searchTerm: string;
  beforeMarkerValues: string;
  markerValue: string;
  afterMarkerValues: string;
  showPopup: boolean;
  isTyping: boolean;
  isInsertingFunctionTemplate: boolean;
  suggestionIndicator: SuggestionIndicator;

  ngOnInit(): void {
    this.inputValueChangedSubscription = this.inputValueChanged
      .pipe(
        debounceTime(this.VALIDATE_DEBOUNCE_TIME),
        distinctUntilChanged())
          .subscribe((value) => this.handleInputValueChangedAfterDebounceTime(value));
    this.initEditorData(this.initialFormula);
  }

  ngOnDestroy(): void {
    this.inputValueChangedSubscription.unsubscribe();
  }

  handleInputValueChanged(value: string): void {
    this.inputValueChanged.next(value);
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
    this.isTyping = true;
    this.isInsertingFunctionTemplate = false;
  }

  handleSuggestionClicked(suggestion: string): void {
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
    return (!this.inputValue || this.inputValue.length === 0 || this.isTyping || this.isInsertingFunctionTemplate);
  }

  private initEditorData(formula: string): void {
    this.inputValue = formula;
    this.filteredSuggestions = [];
    this.suggestions = [];
    this.searchTerm = '';
    this.showPopup = false;
    this.suggestionIndicator = FormulaHelper.buildSuggestionIndicator();
  }

  private handleInputValueChangedAfterDebounceTime(value: string): void {
    if (this.isInsertingFunctionTemplate) {
      return;
    }
    this.formulaChanged.emit(value);
    this.isTyping = false;
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

  private updateSuggestions(suggestionIndicatorIndex: number, type: SuggestionIndicatorType, suggestions: string[]): void {
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
    this.isInsertingFunctionTemplate = (this.suggestionIndicator.Type === SuggestionIndicatorType.Function);
    this.editor.nativeElement.focus();
    this.editor.nativeElement.setRangeText(textToInsert, fromIndex, toIndex, 'end');
    this.inputValue = this.editor.nativeElement.value;
    this.inputValueChanged.next(this.inputValue);
  }

  private showPopupIfSuggestionsFound(): void {
    const currentPosition: number = this.editor.nativeElement.selectionStart;
    this.searchTerm = this.inputValue.substring(this.suggestionIndicator.Index + 1, currentPosition);
    if (!!this.searchTerm && this.searchTerm.length >= this.MIN_QUERY_LENGTH) {
      this.filteredSuggestions = this.suggestions.filter((s) => s.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1);
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
