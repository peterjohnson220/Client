import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { merge as observableMerge, fromEvent as observableFromEvent, Subject, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { PfConstants } from '../../../models/common';
import { Observable } from 'rxjs';

import { RemoteDataSourceService } from 'libs/core/services';

@Component({
  selector: 'pf-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TypeaheadComponent),
      multi: true
    }
  ]
})
export class TypeaheadComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private inputEvents;
  private eventStream;
  private clearEvent;
  private innerValue;
  remoteDataSourceSubscription: Subscription;

  @Input() placeholderText = 'Search...';
  @Input() delay = PfConstants.DEBOUNCE_DELAY;
  @Input() hideClearBtn = false;
  @Input() distinctUntilChanged = false;
  @Input() focus = false;
  @Input() showing = true;
  @Input() disabled = false;
  @Input() maxLength = 524288;
  @Input() id: string;
  @Input() automationClassName: '';
  @Input() minWidth: '100';
  @Input() typeaheadOptions = [];
  @Input() numTypeaheadResults = 10;
  @Input() apiEndpoint = '';
  @Input() apiResponsePropertyForTypeahead = '';
  @Output() valueChanged = new EventEmitter();
  @Output() ngModelChange = new EventEmitter();

  constructor(private elementRef: ElementRef, private remoteDataSourceService: RemoteDataSourceService) {
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

    if (this.apiEndpoint && !this.typeaheadOptions.length) {
      this.refreshRemoteData();
    }
  }

  ngOnDestroy() {
    if (this.remoteDataSourceSubscription) {
      this.remoteDataSourceSubscription.unsubscribe();
    }
  }
  clearValue() {
    this.innerValue = '';
    this.clearEvent.next('');
    this.ngModelChange.emit(this.innerValue);
    this.valueChanged.emit(this.innerValue);
  }

  onKey() {
    this.propogateChange(this.innerValue);
  }

  onPaste() {
    this.propogateChange(this.innerValue);
    this.valueChanged.emit(this.innerValue);
  }

  onItemSelect(item: any) {
    this.innerValue = item;
    this.ngModelChange.emit(this.innerValue);
    this.valueChanged.emit(this.innerValue);
  }

  writeValue(value: any) {
    this.innerValue = value;
  }

  registerOnChange(fn) {
    this.propogateChange = fn;
  }

  refreshRemoteData(endpoint: string = this.apiEndpoint, responseProperty: string = this.apiResponsePropertyForTypeahead) {
    if (endpoint) {
      this.remoteDataSourceSubscription =  this.remoteDataSourceService.getDataSource(`${endpoint}`).subscribe(
        s => {
          this.typeaheadOptions = [];
          s.map(o => {
            this.typeaheadOptions.push(responseProperty ? o[responseProperty] : JSON.stringify(o));
          });
        }
      );
    }
  }

  registerOnTouched() { }

  typeaheadFn = (text$: Observable<string>) => text$
    .debounceTime(this.delay)
    .distinctUntilChanged()
    .map(term => this.typeaheadOptions.filter(v => new RegExp(term, 'gi').test(v)).splice(0, this.numTypeaheadResults))
}
