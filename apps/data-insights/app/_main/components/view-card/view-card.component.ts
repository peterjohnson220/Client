import { Component, Input } from '@angular/core';

import { View } from '../../models';

@Component({
  selector: 'pf-view-card',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.scss']
})
export class ViewCardComponent {
  @Input() sourceUrl: string;
  @Input() workbookName: string;
  @Input() view: View;

  displayActionsOverlay: boolean;

  handleMouseOverViewContainer() {
    this.displayActionsOverlay = true;
  }

  handleMouseLeaveViewContainer() {
    this.displayActionsOverlay = false;
  }
}
