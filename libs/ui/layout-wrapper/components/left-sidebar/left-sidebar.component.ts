import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';

import { SidebarLink } from 'libs/models';

@Component({
  selector: 'pf-layout-wrapper-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: [ './left-sidebar.component.scss' ]
})
export class LeftSidebarComponent {
  leftSidebarToggle = false;
  ngAppRoot = environment.ngAppRoot;

  @Input() gettingSidebarNavigationLinks: boolean;
  @Input() gettingSidebarNavigationLinksError: boolean;

  @Input() sidebarNavigationLinks: SidebarLink[];

  constructor() {}
}
