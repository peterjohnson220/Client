import { Input, Directive, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[pfFocus]'
})
export class FocusDirective implements AfterViewInit, OnChanges {
  // Angular doesn't allow for conditionally adding directives
  // using an input property to conditionally toggle behavior.
  /* tslint:disable:no-input-rename */
  @Input('pfFocus') focus = true;
  @Input('pfFocusElementShowing') elementShowing = true;

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit(): void {
    if (this.focus) {
      this.focusElement();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.focusWhenElementShows(changes) || this.focusWhenElementAlreadyShowing(changes)) {
      window.setTimeout(() => this.focusElement(), 0);
    }
  }

  focusWhenElementShows(changes: SimpleChanges): boolean {
    return this.focus
      && typeof changes.elementShowing !== 'undefined'
      && !changes.elementShowing.previousValue
      && changes.elementShowing.currentValue === true;
  }

  focusWhenElementAlreadyShowing(changes: SimpleChanges): boolean {
    return this.elementShowing
      && typeof changes.focus !== 'undefined'
      && !changes.focus.previousValue
      && changes.focus.currentValue === true;
  }

  focusElement() {
    this.el.nativeElement.focus();
  }
}
