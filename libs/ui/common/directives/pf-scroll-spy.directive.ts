import { Directive, Input, EventEmitter, Output, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[pfScrollSpy]'
})
export class PfScrollSpyDirective {
  @Input() public spiedTag;
  @Output() public sectionChange = new EventEmitter<string>();
  private currentSection: string;

  constructor(private _el: ElementRef) {}

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {

    let currentSection: string;

    const children = this._el.nativeElement.getElementsByTagName(this.spiedTag);
    const scrollTop = event.target.scrollTop;
    const parentOffset = event.target.offsetTop + 1;

    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      if (this.spiedTag === element.tagName) {
        if ((element.offsetTop - parentOffset) <= scrollTop) {
          currentSection = element.id;
        }
      }
    }

    if (currentSection !== this.currentSection) {
      this.currentSection = currentSection;
      this.sectionChange.emit(this.currentSection);
    }
  }

}
