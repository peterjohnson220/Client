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

  @Output() valueChange = new EventEmitter<string>();

  isEditableSubscription: Subscription;
  value: string;
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

  getValue(): string {
    let value = this.placeholder;
    if (this.value) {
      value = this.value;
    }
    return value;
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
}
