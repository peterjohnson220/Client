import { Directive, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[pfClickInContent]'
})
export class ClickInContentDirective {
  constructor(private elementRef: ElementRef) {}

  @Output() public hashTagClicked = new EventEmitter();

  @HostListener('document:click', ['$event', '$event.target'])
    onClick(event: MouseEvent, targetElement: HTMLElement): void {
      if (!targetElement) {
        return;
      }

      if (this.elementRef.nativeElement.contains(targetElement)) {
        const innerText = targetElement.innerText;
        if (innerText && innerText.substr(0, 1) === '#') {
           event.preventDefault();
           this.hashTagClicked.emit(innerText);
        }
      }
    }
}
