import { Directive, Input, HostListener, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[pfDebounceValueChanged]'
})
export class PfDebounceValueChangedDirective implements OnDestroy {
  @Output()
  public pfDebounceValueChanged: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  public valueChangeDelay = 300;

  private stream: Subject<any> = new Subject<any>();
  private subscription: Subscription;

  constructor() {
    this.subscription = this.stream
      .pipe(debounceTime(this.valueChangeDelay))
      .subscribe((value: any) => this.pfDebounceValueChanged.next(value));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('valueChange', [ '$event' ])
  public onValueChange(value: any): void {
    this.stream.next(value);
  }
}