import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { CompanyEmployee } from 'libs/models/company';

@Component({
  selector: 'pf-grid-action-menu',
  templateUrl: './grid-action-menu.component.html',
  styleUrls: ['./grid-action-menu.component.scss']
})
export class GridActionMenuComponent {

  @Input() isOpen: boolean;
  @Input() employee: CompanyEmployee;

  @Output() open = new EventEmitter<CompanyEmployee>();
  @Output() close = new EventEmitter();
  @Output() unassignClick = new EventEmitter<CompanyEmployee>();

  constructor() { }

  onClickElsewhere() {
    if (this.isOpen) {
      this.close.emit();
    }
  }

  onEllipsisClick() {
    if (this.isOpen) {
      this.close.emit();
    } else {
      this.open.emit(this.employee);
    }
  }

  onUnassignClick() {
    this.unassignClick.emit(this.employee);
  }

  // send a close message up when the menu is open and the escape key is clicked
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isOpen && event.key.toLowerCase() === 'escape') {
      this.close.emit();
    }
  }
}
