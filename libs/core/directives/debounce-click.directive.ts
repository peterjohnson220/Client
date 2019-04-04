import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Subject, Subscription } from 'rxjs';

import { PfConstants } from '../../models/common';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[pfDebounceClick]'
})
export class DebounceClickDirective implements OnInit, OnDestroy {
  @Input() delay = PfConstants.DEBOUNCE_DELAY;
  @Output() debouncedClick = new EventEmitter();

  private clicksSubject = new Subject();
  private clicksSubscription: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.clicksSubscription = this.clicksSubject.pipe(
        debounceTime(this.delay)
      )
      .subscribe(() => this.debouncedClick.emit());
  }

  ngOnDestroy(): void {
    this.clicksSubscription.unsubscribe();
  }

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.clicksSubject.next(event);
  }
}
