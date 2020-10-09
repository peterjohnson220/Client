import { Component, Input, Output, EventEmitter, OnInit, ViewChild, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';

import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { EditorFromTextArea } from 'codemirror';

import { Suggestion } from '../../models';


import 'codemirror/mode/spreadsheet/spreadsheet';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/hint/show-hint';


@Component({
  selector: 'pf-formula-editor',
  templateUrl: './formula-editor.component.html',
  styleUrls: ['./formula-editor.component.scss'],
})
export class FormulaEditorComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() initialFormula: string;
  @Input() fieldSuggestions: Suggestion[];
  @Input() functionSuggestions: Suggestion[];
  @Input() validating: boolean;
  @Input() isValid: boolean;
  @Input() disabled: boolean;
  @Input() isWaitingForValidation: boolean;
  @Output() formulaChanged: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('codeMirror', { static: true }) codeMirrorComponent: CodemirrorComponent;
  readonly formulaMaxLength = 5000;
  codeMirrorConfig: any;
  suggestions: Suggestion[];
  inputValue: string;
  isInsertingFunctionTemplate: boolean;
  codeMirror: EditorFromTextArea;

  ngOnInit(): void {
    this.initEditorData(this.initialFormula);
    this.initCodemirror();
  }

  ngAfterViewInit(): void {
    this.codeMirror = this.codeMirrorComponent.codeMirror;
    this.codeMirror.on('beforeChange', (cm, changeObj) => this.checkFormulaLength(changeObj));
    this.codeMirror.on('inputRead', () => this.handleInputRead());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!this.codeMirror && !!changes && !!changes.disabled
      && changes.disabled.currentValue !== changes.disabled.previousValue) {
      this.codeMirror.setOption('readOnly', this.disabled);
    }
  }

  initCodemirror(): void {
    const self = this;
    this.codeMirrorConfig = {
      mode: 'spreadsheet',
      inputStyle: 'textarea',
      matchBrackets: true,
      placeholder: 'Formula',
      completeSingle: false,
      lineWrapping: true,
      readOnly: this.disabled,
      closeOnUnfocus: true,
      hintOptions: {
        hint: (cm, option) => self.getHintOptions(cm, option, self)
      },
      extraKeys: {
        'Shift-4' : (cm) => self.showFunctionHint(cm, self),
        '[' : (cm) => self.showFieldHint(cm, self),
        'Enter': () => { event.preventDefault(); }
      }
    };
  }

  handleInputValueChanged(value: string): void {
    this.formulaChanged.emit(value);
  }

  public get hideValidatingMessage(): boolean {
    return (!this.inputValue || this.inputValue.length === 0 || this.isInsertingFunctionTemplate || this.isWaitingForValidation);
  }

  private initEditorData(formula: string): void {
    this.inputValue = formula;
    this.suggestions = [];
  }

  // https://github.com/codemirror/CodeMirror/issues/821
  private checkFormulaLength(changeObj): void {
    let text = !!changeObj.text && !!changeObj.text.length ? changeObj.text[0] : '';
    let delta = text.length - (this.codeMirror.indexFromPos(changeObj.to) - this.codeMirror.indexFromPos(changeObj.from));
    delta = this.codeMirror.getValue().length + delta - this.formulaMaxLength;
    if (delta > 0) {
      text = text.substr(0, text.length - delta);
      changeObj.update(changeObj.from, changeObj.to, [text]);
    }
  }

  private showFieldHint(cm, self: FormulaEditorComponent): void {
    self.suggestions = self.fieldSuggestions;
    cm.showHint(self.suggestions);
  }

  private showFunctionHint(cm, self): void {
    self.suggestions = self.functionSuggestions;
    self.isInsertingFunctionTemplate = true;
    cm.showHint(self.suggestions);
  }

  private getHintOptions(cm, option, self): any {
    const cursor = cm.getCursor();
    const token = cm.getTokenAt(cursor);
    const start: number = token.start;
    const end: number = cursor.ch;
    const line: number = cursor.line;
    const searchTerm: string = token.string;

    const filteredSuggestions: any[] = self.suggestions
      .filter((s: Suggestion) => s.displayText.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);

    return {
      list: filteredSuggestions.length ? filteredSuggestions : self.suggestions,
      from: { line, ch: start },
      to: { line, ch: end }
    };
  }

  private handleInputRead(): void {
    this.isInsertingFunctionTemplate = false;
  }

}
