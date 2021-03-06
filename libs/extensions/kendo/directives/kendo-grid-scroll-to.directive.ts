import { Input, Directive, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[pfKendoScrollTo]'
})
export class KendoGridScrollToDirective implements AfterViewInit, OnChanges {
  /* tslint:disable:no-input-rename */
  @Input('pfKendoScrollTo') rowNumber: number;
  /* tslint:disable:no-input-rename */
  @Input('pfKendoScrollToEnabled') enabled = true;
  /* tslint:disable:no-input-rename */
  @Input('pfKendoScrollToAnimate') animate = true;

  gridContent: any;
  gridfirstRowHeight: number;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.gridContent = this.el.nativeElement.querySelector('.k-grid-content');
    this.gridfirstRowHeight = this.gridContent.querySelector('.k-grid-table tr').clientHeight;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.enabled && this.gridContent && changes.rowNumber && changes.rowNumber.currentValue) {
      const offset = this.gridfirstRowHeight * this.rowNumber;

      if (this.animate) {
        this.scrollTo(this.gridContent, offset, 1000);
      } else {
        this.gridContent.scrollTop = offset;
      }
    }
  }

  // SOURCE [BC]: https://gist.github.com/andjosh/6764939
  scrollTo(element, to, duration) {
    const start = element.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    const easeInOutQuad = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t + b;
      }
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    const animateScroll = function() {
      currentTime += increment;
      const val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        window.setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  }
}
