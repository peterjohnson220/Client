import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[pfCollapser]'
})
export class CollapserDirective {

  @Input('pfCollapser') surveyTitleId: number;
  public collapsed: boolean;

  constructor(private el: ElementRef) { this.collapsed = true; }

  @HostListener('click') onCategoryClick() {
    this.el.nativeElement.className += ' active';
    const element = document.querySelector('#survey' + this.surveyTitleId);
    if (this.collapsed) {
      element.classList.add('show');
    } else {
      element.classList.remove('show');
    }
    this.collapsed = !this.collapsed;
  }
}
