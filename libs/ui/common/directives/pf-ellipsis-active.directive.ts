import { Directive, ElementRef, AfterViewInit, HostListener } from '@angular/core';

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[pfEllipsisActive]' })

export class EllipsisActiveDirective {

  constructor(private elementRef: ElementRef) { }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    setTimeout(() => {
      const element = this.elementRef.nativeElement;
      if (element.offsetWidth < element.scrollWidth) {
        element.title = element.textContent;
      } else if (element.title) {
        element.removeAttribute('title');
      }
    }, 500);
  }
}
