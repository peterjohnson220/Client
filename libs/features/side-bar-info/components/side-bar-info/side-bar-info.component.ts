import { Component, Input } from '@angular/core';

import { SidebarGroup } from '../../models/side-bar-info-models';

@Component({
  selector: 'pf-side-bar-info-component',
  templateUrl: './side-bar-info.component.html',
  styleUrls: ['./side-bar-info.component.scss']
})
export class SideBarInfoComponent {
  @Input() sidebarGroups: SidebarGroup[];
}
