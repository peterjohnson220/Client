import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'pf-inline-string-editor',
  templateUrl: './inline-string-editor.component.html',
  styleUrls: ['./inline-string-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineStringEditorComponent implements OnInit, OnChanges {
  constructor() {}

  @Input() minCharacters = 1;
  @Input() maxCharacters: number;
  @Input() placeholder: string;
  @Input() inEditMode: boolean;
  @Input() icon = 'pencil';
  @Input() value: string;

  @Output() valueChange = new EventEmitter<string>();

  isEditable: boolean;
  isInEditState: boolean;

  @ViewChild('textBox', {static: false}) textBox: ElementRef;

  ngOnInit(): void {
    this.isInEditState = false;
    this.isEditable = this.inEditMode !== false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inEditMode) {
      this.isEditable = this.inEditMode;
    }
  }

  getValueForInputControl(): string {
    if (this.value) {
      return this.value;
    } else if (this.isIe()) {
      return this.getValueForDisplay();
    } else {
      return '';
    }
  }

  getValueForDisplay(): string {
    let returnValue = this.placeholder;
    if (this.value) {
      returnValue = this.value;
    }
    return returnValue;
  }

  enableEditState(): void {
    this.isInEditState = true;
    setTimeout(() => this.textBox.nativeElement.focus(), 0);
  }

  disableEditState(): void {
    this.isInEditState = false;
  }

  onChange(): void {
    this.value = this.textBox.nativeElement.value;
    this.valueChange.emit(this.value);
  }

   isIe(): boolean {
    const agent = window.navigator.userAgent.toLowerCase();
    return agent.indexOf('trident') > -1;
  }
}
