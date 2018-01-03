import { Directive, ElementRef, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[pfFocus]'
})
export class FocusDirective implements AfterViewChecked {

  constructor(private el: ElementRef) {}

  ngAfterViewChecked(): void {
    this.el.nativeElement.focus();
  }
}
