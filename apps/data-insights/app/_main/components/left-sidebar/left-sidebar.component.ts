import { Component } from '@angular/core';

@Component({
  selector: 'pf-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent {
  sideBarOpen = true;

  constructor() { }

  toggleSidebar() {
    this.sideBarOpen = !this.sideBarOpen;
  }

}
