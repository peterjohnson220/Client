import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
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
  private inputEvents;
  private eventStream;
  private clearEvent;
  private innerValue;

  @Input() placeholderText = 'Search...';
  @Input() delay = 300;
  @Input() hideClearBtn = false;
  @Input() distinctUntilChanged = false;
  @Input() focus = false;
  @Input() disabled = false;
  @Output() valueChanged = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    this.clearEvent = new Subject();
  }

  propogateChange = (_: any) => { };

  ngOnInit() {
    this.inputEvents = Observable.fromEvent(this.elementRef.nativeElement, 'input');

    this.eventStream = Observable.merge(this.inputEvents, this.clearEvent)
      .map(() => this.innerValue)
      .debounceTime(this.delay);


    if (this.distinctUntilChanged) {
      this.eventStream = this.eventStream.distinctUntilChanged();
    }

    this.eventStream.subscribe(input => this.valueChanged.emit(input));
  }

  clearValue() {
    this.innerValue = '';
    this.clearEvent.next('');
  }

  onKey() {
    this.propogateChange(this.innerValue);
  }

  onPaste() {
    this.propogateChange(this.innerValue);
  }

  writeValue(value: any) {
    this.innerValue = value;
  }

  registerOnChange(fn) {
    this.propogateChange = fn;
  }

  registerOnTouched() {}
}
