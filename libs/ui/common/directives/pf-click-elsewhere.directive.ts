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

    // bail out if we can't tell where the click originates from, or if the click originates from inside the directive's dom node
    if (!targetElement || this.elementRef.nativeElement.contains(targetElement)) {
      return;
    }

    // bail out if the clicked dom node is classed whitelisted
    if (this.whitelist && this.whitelist.some(w => targetElement.classList.value.indexOf(w) >= 0)) {
      return;
    }

    this.clickElsewhere.emit(event);
  }
}
