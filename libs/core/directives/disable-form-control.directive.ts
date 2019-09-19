import { Directive, Input } from '@angular/core';

import { NgControl } from '@angular/forms';

@Directive({
  selector: '[pfDisableFormControl]'
})
export class DisableFormControlDirective {

  @Input() set pfDisableFormControl( condition: boolean ) {
    const action = condition ? 'disable' : 'enable';
    this.ngControl.control[action]();
  }

  constructor( private ngControl: NgControl ) {}
}
