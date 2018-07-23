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
    if (
      this.focus &&
      changes.elementShowing &&
      changes.elementShowing.previousValue === false &&
      changes.elementShowing.currentValue === true) {
      setTimeout(() => this.focusElement(), 0);
    }
  }

  focusElement() {
    this.el.nativeElement.focus();
  }
}
