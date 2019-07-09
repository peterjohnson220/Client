import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Workbook } from '../../models';

@Component({
  selector: 'pf-workbook-card',
  templateUrl: './workbook-card.component.html',
  styleUrls: ['./workbook-card.component.scss']
})
export class WorkbookCardComponent {
  @Input() workbook: Workbook;
  @Output() favoriteClicked: EventEmitter<Workbook> = new EventEmitter();
  @Output() tagClicked: EventEmitter<Workbook> = new EventEmitter();

  displayActionsOverlay: boolean;

  handleMouseOverWorkbookContainer() {
    this.displayActionsOverlay = true;
  }

  handleMouseLeaveWorkbookContainer() {
    this.displayActionsOverlay = false;
  }

  handleFavoriteClicked(workbook: Workbook) {
    this.favoriteClicked.emit(workbook);
  }

  handleTagClicked(workbook: Workbook) {
    this.tagClicked.emit(workbook);
  }
}
