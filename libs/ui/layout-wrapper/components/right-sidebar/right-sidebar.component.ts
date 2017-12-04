import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pf-layout-wrapper-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RightSidebarComponent implements OnInit {
  private show = false;
  constructor() { }

  ngOnInit() {
  }

  toggleRightSidebar() {
    if (this.show) {
      this.show = false;
    } else {
      this.show = true;
    }
  }
}
