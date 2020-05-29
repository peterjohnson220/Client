import {
  ContentChild, Directive, DoCheck, ElementRef, Input, Renderer2
} from '@angular/core';
import { FormControlName } from '@angular/forms';

@Directive({
  selector: '[pfValidatable]'
})
export class PfValidatableDirective implements DoCheck {
  private shouldValidate = false;
  @ContentChild(FormControlName) control: FormControlName;
  @Input() set pfValidatable(shouldValidate: boolean) {
    this.shouldValidate = shouldValidate;
  }
  constructor(private _el: ElementRef, private _renderer: Renderer2) {}

  ngDoCheck(): void {
    if (!this.control) {
      return;
    }

    const isDirty = (this.control.dirty || this.control.touched) && this.shouldValidate;
    // I left the comments below in case we'd want to use the bootstrap 'is-valid' utility classes down the road.
    if (this.control.valid || !isDirty) {
      this._renderer.removeClass(this._el.nativeElement, 'is-invalid');
      // this._renderer.addClass(this._el.nativeElement, 'is-valid');
    } else {
      // this._renderer.removeClass(this._el.nativeElement, 'is-valid');
      this._renderer.addClass(this._el.nativeElement, 'is-invalid');
    }
  }
}
