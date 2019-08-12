import { AfterContentInit, Directive, EventEmitter, Output } from '@angular/core';

// tslint:disable-next-line:directive-selector
@Directive({selector: '[pf-afterIf]'})
export class AfterIfDirective implements AfterContentInit {
  @Output('pf-afterIf')
  public after: EventEmitter<AfterIfDirective> = new EventEmitter();

  public ngAfterContentInit(): void {
    setTimeout(() => {
      // timeout helps prevent unexpected change errors
      this.after.next(this);
    });
  }
}
