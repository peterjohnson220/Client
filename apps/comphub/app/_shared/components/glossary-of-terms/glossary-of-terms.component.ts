import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'pf-glossary-of-terms',
  templateUrl: './glossary-of-terms.component.html',
  styleUrls: ['./glossary-of-terms.component.scss']
})
export class GlossaryOfTermsComponent {
  @ViewChild('termsContainer', { static: true }) private termsContainerElement: ElementRef;
  @Input() open: boolean;
  @Output() close = new EventEmitter();

  constructor() { }

  handleCloseClicked() {
    this.termsContainerElement.nativeElement.scrollTop = 0;
    this.close.emit();
  }

  handleClickElsewhere() {
    this.handleCloseClicked();
  }

}
