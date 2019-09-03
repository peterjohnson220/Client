import { Component, Input, Output, EventEmitter } from '@angular/core';

import { View } from '../../models';

@Component({
  selector: 'pf-view-card',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.scss']
})
export class ViewCardComponent {
  @Input() sourceUrl: string;
  @Input() workbookName: string;
  @Input() workbookContentUrl: string;
  @Input() view: View;
  @Output() favoriteClicked: EventEmitter<View> = new EventEmitter<View>();

  displayActionsOverlay: boolean;

  handleMouseOverViewContainer() {
    this.displayActionsOverlay = true;
  }

  handleMouseLeaveViewContainer() {
    this.displayActionsOverlay = false;
  }

  handleFavoriteClicked(view: View) {
    this.favoriteClicked.emit(view);
  }
}
