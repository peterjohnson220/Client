import { ContentChild, Directive, DoCheck, ElementRef, Renderer2 } from '@angular/core';
import { FormControlName } from '@angular/forms';

@Directive({
  selector: '[pfValidatable]'
})
export class PfValidatableDirective implements DoCheck {
  @ContentChild(FormControlName) control: FormControlName;
  constructor(private _el: ElementRef, private _renderer: Renderer2) {}

  ngDoCheck(): void {
    const isDirty = this.control.dirty || this.control.touched;
    if (!isDirty) {
      return;
    }

    if (this.control.valid) {
      this._renderer.removeClass(this._el.nativeElement, 'is-invalid');
      this._renderer.addClass(this._el.nativeElement, 'is-valid');
    } else {
      this._renderer.removeClass(this._el.nativeElement, 'is-valid');
      this._renderer.addClass(this._el.nativeElement, 'is-invalid');
    }
  }
}
