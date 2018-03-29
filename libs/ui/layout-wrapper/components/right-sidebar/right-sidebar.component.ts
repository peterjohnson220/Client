import { Component, Input  } from '@angular/core';

@Component({
  selector: 'pf-layout-wrapper-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: [ './right-sidebar.component.scss' ]
})
export class RightSidebarComponent {
  rightSidebarToggle = false;
  @Input() fontAwesomeOpenIcon: string;
  constructor() { }
}
