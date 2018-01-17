import { Input, Directive, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[pfKendoScrollTo]'
})
export class KendoGridScrollToDirective implements AfterViewInit, OnChanges {
  @Input('pfKendoScrollTo') rowNumber: number;
  @Input('pfKendoScrollToEnabled') enabled = true;

  gridContent: any;
  gridfirstRowHeight: number;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.gridContent = this.el.nativeElement.querySelector('.k-grid-content');
    this.gridfirstRowHeight = this.gridContent.querySelector('.k-grid-table tr').clientHeight;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.enabled && this.gridContent && changes.rowNumber.currentValue) {
      this.scrollTo(this.gridContent, this.gridfirstRowHeight * this.rowNumber, 1000);
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
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  }
}
