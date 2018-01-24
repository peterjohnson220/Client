import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/distinctUntilChanged';


@Component({
  selector: 'pf-input-debounce',
  templateUrl: './input-debounce.component.html',
  styleUrls: ['./input-debounce.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDebounceComponent),
      multi: true
    }
  ]
})
export class InputDebounceComponent implements OnInit, ControlValueAccessor {
  private keyUpEvents;
  private pasteEvents;
  private eventStream;
  private clearEvent;

  @Input() inputValue: string;
  @Input() placeholderText = 'Search...';
  @Input() delay = 300;
  @Input() hideClearBtn = false;
  @Input() distinctUntilChanged = true;
  @Input() focus = false;
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
