import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';

import { NgControl } from '@angular/forms';

@Directive({
  selector: '[pfDisableFormControl]'
})
export class DisableFormControlDirective implements OnChanges {

  @Input() pfDisableFormControl: boolean;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pfDisableFormControl']) {
      const action = this.pfDisableFormControl ? 'disable' : 'enable';
      this.ngControl.control[action]();
    }
  }

  constructor( private ngControl: NgControl ) {}
}
