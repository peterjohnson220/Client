import { Component, Input, Output, ElementRef, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';


@Component({
  selector: 'pf-input-debounce',
  styles: [`
        .input-group {
            width:100%
        }
        .form-control::-ms-clear {
            display: none;
        }
    `],
  template: `
    <input *ngIf="hideClearBtn" type="text" class="form-control"
           (keyup)="onKey()"
           [placeholder]="placeholderText"
           [(ngModel)]="inputValue"
           focus>
  <div *ngIf="!hideClearBtn" class="input-group">
    <input type="text" class="form-control" [placeholder]="placeholderText"
           (keyup)="onKey()"
           [(ngModel)]="inputValue"
           focus>
    <div (click)="clearValue()" class="input-group-addon input-group-append">
      <i class="fa fa-times" aria-hidden="true"></i>
    </div>
  </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PfInputDebounceComponent),
      multi: true
    }
  ]
})
export class PfInputDebounceComponent implements OnInit, ControlValueAccessor {
  private keyUpEvents;
  private pasteEvents;
  private eventStream;
  private clearEvent;

  @Input() inputValue: string;
  @Input() placeholderText = 'Search...';
  @Input() delay = 300;
  @Input() hideClearBtn = false;
  @Input() distinctUntilChanged = true;
  @Output() valueChanged = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    this.clearEvent = new Subject();
  }

  propogateChange = (_: any) => { };

  ngOnInit() {
    this.keyUpEvents = Observable.fromEvent(this.elementRef.nativeElement, 'keyup');
    this.pasteEvents = Observable.fromEvent(this.elementRef.nativeElement, 'paste');

    this.eventStream = Observable.merge(this.keyUpEvents, this.pasteEvents, this.clearEvent)
      .map(() => this.inputValue)
      .debounceTime(this.delay);


    if (this.distinctUntilChanged) {
      this.eventStream = this.eventStream.distinctUntilChanged();
    }

    this.eventStream.subscribe(input => this.valueChanged.emit(input));
  }

  clearValue() {
    this.inputValue = '';
    this.clearEvent.next('');
  }

  setSilently(newValue: string) {
    this.inputValue = newValue;
  }

  onKey() {
    this.propogateChange(this.inputValue);
  }

  writeValue(value: any) {
    this.inputValue = value;
  }

  registerOnChange(fn) {
    this.propogateChange = fn;
  }

  registerOnTouched() {}

}
