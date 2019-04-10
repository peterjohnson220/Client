import {Directive, EventEmitter, ElementRef, HostListener, Output, Input} from '@angular/core';

@Directive({ selector: '[pfClickElsewhere]' })
export class ClickElsewhereDirective {
  @Input() whitelist: string[];
  @Output() clickElsewhere = new EventEmitter<MouseEvent>();

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    // Check if the click was outside the element
    if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
      if (!this.whitelist ||  !this.whitelist.some(w => targetElement.className.includes(w))) {
        this.clickElsewhere.emit(event);
      }
    }
  }
}
