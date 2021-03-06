import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pf-layout-wrapper-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: [ './right-sidebar.component.scss' ]
})
export class RightSidebarComponent {
  @Input() isOpen = false;
  @Input() fontAwesomeOpenIcon: string;
  @Output() onToggle = new EventEmitter<boolean>();

  toggle() {
    this.isOpen = !this.isOpen;
    this.onToggle.emit(this.isOpen);
  }
}


