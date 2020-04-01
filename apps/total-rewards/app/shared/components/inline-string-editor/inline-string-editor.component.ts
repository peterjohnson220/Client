import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'pf-inline-string-editor',
  templateUrl: './inline-string-editor.component.html',
  styleUrls: ['./inline-string-editor.component.scss']
})
export class InlineStringEditorComponent implements OnDestroy, OnInit {
  constructor() {}

  @Input() minCharacters = 1;
  @Input() maxCharacters: number;
  @Input() placeholder: string;
  @Input() isEditable$: Observable<boolean>;
  @Input() icon = 'pencil';
  @Input() value: string;

  @Output() valueChange = new EventEmitter<string>();

  isEditableSubscription: Subscription;
  isEditable: boolean;
  isInEditState: boolean;

  @ViewChild('textBox', {static: false}) textBox: ElementRef;

  ngOnInit(): void {
    this.isInEditState = false;
    if (this.isEditable$) {
      this.isEditableSubscription = this.isEditable$.subscribe(isEditable => { this.isEditable = isEditable; });
    } else {
      this.isEditable = true;
    }
  }

  ngOnDestroy(): void {
    if (this.isEditableSubscription) {
      this.isEditableSubscription.unsubscribe();
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
