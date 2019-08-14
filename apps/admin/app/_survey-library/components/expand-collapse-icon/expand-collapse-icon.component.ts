import { Component } from '@angular/core';

@Component({
  selector: 'pf-expand-collapse-icon',
  templateUrl: './expand-collapse-icon.component.html',
  styleUrls: ['./expand-collapse-icon.component.scss']
})

export class ExpandCollapseIconComponent {
  expanded: boolean;

  constructor() {
    this.expanded = false;
  }

  switchIcon() {
    this.expanded = !this.expanded;
  }
}
