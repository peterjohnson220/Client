import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'pf-glossary-of-terms',
  templateUrl: './glossary-of-terms.component.html',
  styleUrls: ['./glossary-of-terms.component.scss']
})
export class GlossaryOfTermsComponent {
  @ViewChild('termsContainer') private termsContainerElement: ElementRef;

  isOpen = false;

  constructor() { }

  handleCloseClicked() {
    this.isOpen = false;
    this.termsContainerElement.nativeElement.scrollTop = 0;
  }

  handleClickElsewhere(event) {
    this.handleCloseClicked();
  }

}
