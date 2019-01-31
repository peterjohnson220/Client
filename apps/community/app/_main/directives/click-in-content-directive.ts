import { Directive, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[pfClickInContent]'
})
export class ClickInContentDirective {
  constructor(private elementRef: ElementRef) {}

  @Output() public hashTagClicked = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const htmlElement = event.target as HTMLElement;

    if (htmlElement && this.elementRef.nativeElement.contains(htmlElement)) {
      const innerText = targetElement.innerText;
      if (innerText && innerText.substr(0, 1) === '#') {
        this.hashTagClicked.emit(innerText);
      }
    }
  }

}
