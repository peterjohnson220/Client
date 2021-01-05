import { Component, Input, Output, EventEmitter } from '@angular/core';

import { View } from 'libs/features/surveys/reports/models';

@Component({
  selector: 'pf-view-card',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.scss']
})
export class ViewCardComponent {
  @Input() sourceUrl: string;
  @Input() workbookName: string;
  @Input() workbookContentUrl: string;
  @Input() workbookId: string;
  @Input() view: View;
  @Output() favoriteClicked: EventEmitter<{workbookId: string, view: View}> = new EventEmitter<{workbookId: string, view: View}>();

  displayActionsOverlay: boolean;

  handleMouseOverViewContainer() {
    this.displayActionsOverlay = true;
  }

  handleMouseLeaveViewContainer() {
    this.displayActionsOverlay = false;
  }

  handleFavoriteClicked() {
    this.favoriteClicked.emit({workbookId: this.workbookId, view: this.view});
  }
}
