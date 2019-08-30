import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-expand-collapse-icon',
  templateUrl: './expand-collapse-icon.component.html',
  styleUrls: ['./expand-collapse-icon.component.scss']
})

export class ExpandCollapseIconComponent {

  @Input() expanded: boolean;
  constructor() {
  }

}
