import { Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { merge as observableMerge, fromEvent as observableFromEvent, Subject, Observable, of, Subscription } from 'rxjs';
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
export class InputDebounceComponent implements OnInit, ControlValueAccessor, OnDestroy {
  private inputEvents;
  private eventStream;
  private clearEvent;
  private innerValue;

  @Input() placeholderText = 'Search...';
  @Input() delay = PfConstants.DEBOUNCE_DELAY;
  @Input() hideClearBtn = false;
  @Input() prependIcon = '';
  @Input() distinctUntilChanged = false;
  @Input() focus = false;
  @Input() showing = true;
  @Input() disabled = false;
  @Input() maxLength = 524288;
  @Input() id: string;
  @Input() automationClassName = '';
  @Input() minWidth = 100;
  @Input() value = '';
  @Input() resetValue$: Observable<boolean> = of(false);
  @Output() valueChanged: EventEmitter<string> = new EventEmitter();
  @Output() clearClicked = new EventEmitter();

  resetValueSubscription: Subscription;

  constructor(private elementRef: ElementRef) {
    this.clearEvent = new Subject();
  }

  propagateChange = (_: any) => { };

  ngOnDestroy() {
    this.resetValueSubscription.unsubscribe();
  }

  ngOnInit() {
    this.resetValueSubscription = this.resetValue$.subscribe(triggered => {
      if (triggered) {
        this.clearValue();
      }
    });

    this.inputEvents = observableFromEvent(this.elementRef.nativeElement, 'input');

    this.eventStream = observableMerge(this.inputEvents, this.clearEvent).pipe(
      map(() => this.innerValue),
      debounceTime(this.delay)
    );


    if (this.distinctUntilChanged) {
      this.eventStream = this.eventStream.distinctUntilChanged();
    }

    this.eventStream.subscribe(input => this.valueChanged.emit(input));

    this.innerValue = this.value;
  }

  getMaxLength(): string {
    return String(this.maxLength);
  }

  clearValue() {
    if (!this.disabled) {
      this.innerValue = '';
      this.clearEvent.next('');
      this.clearClicked.emit();
    }
  }

  onKey() {
    this.propagateChange(this.innerValue);
  }

  onPaste() {
    this.propagateChange(this.innerValue);
  }

  writeValue(value: any) {
    this.innerValue = value;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  blur() {
    const innerInput = this.elementRef.nativeElement.getElementsByTagName('input')[0];
    innerInput.blur();
  }

  registerOnTouched() { }

  getClearButtonCss(): any {
    let cssClasses = '';

    if (!this.disabled) {
      cssClasses += 'action-item';
    }

    if (this.automationClassName) {
      cssClasses += ' ' + this.automationClassName + '-clear';
    }
    return cssClasses;
  }
}
