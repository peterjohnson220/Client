import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { merge as observableMerge, fromEvent as observableFromEvent , Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { PfConstants } from '../../../models/common';

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
  @Input() delay = PfConstants.DEBOUNCE_DELAY;
  @Input() hideClearBtn = false;
  @Input() distinctUntilChanged = false;
  @Input() focus = false;
  @Input() disabled = false;
  @Input() maxLength = 524288;
  @Output() valueChanged = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    this.clearEvent = new Subject();
  }

  propogateChange = (_: any) => { };

  ngOnInit() {
    this.inputEvents = observableFromEvent(this.elementRef.nativeElement, 'input');

    this.eventStream = observableMerge(this.inputEvents, this.clearEvent).pipe(
      map(() => this.innerValue),
      debounceTime(this.delay)
    );


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
