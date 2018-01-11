import { Input, Directive, ElementRef, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[pfFocus]'
})
export class FocusDirective implements AfterViewChecked {
  // Angular doesn't allow for conditionally adding directives
  // using an input property to conditionally toggle behavior.
  /* tslint:disable:no-input-rename */
  @Input('pfFocus') focus = true;

  constructor(private el: ElementRef) {}

  ngAfterViewChecked(): void {
    if (this.focus) {
      this.el.nativeElement.focus();
    }
  }
}
