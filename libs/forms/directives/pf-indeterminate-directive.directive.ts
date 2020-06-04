import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[pfIndeterminateDirective]'
})
export class PfIndeterminateDirectiveDirective {
  @Input()
  set pfIndeterminateDirective(value) {
    this.elem.nativeElement.indeterminate = value;
  }
  constructor(private elem: ElementRef) {
  }

}
