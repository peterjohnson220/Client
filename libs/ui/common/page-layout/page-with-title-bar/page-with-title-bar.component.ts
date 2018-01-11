import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pf-page-with-title-bar',
  templateUrl: './page-with-title-bar.component.html',
  styleUrls: ['./page-with-title-bar.component.scss']
})
export class PageWithTitleBarComponent {
  @Input() returnUrl: string;
  @Output() returning = new EventEmitter();

  // Events
  handleBackButtonClicked() {
    this.returning.emit();
  }
}
