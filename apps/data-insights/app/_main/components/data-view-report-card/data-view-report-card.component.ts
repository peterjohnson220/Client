import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Workbook } from '../../models';

@Component({
  selector: 'pf-data-view-report-card',
  templateUrl: './data-view-report-card.component.html',
  styleUrls: ['./data-view-report-card.component.scss']
})
export class DataViewReportCardComponent {
  @Input() dataViewReport: Workbook;
  @Output() favoriteClicked: EventEmitter<Workbook> = new EventEmitter<Workbook>();

  displayActionsOverlay: boolean;
  showingPopover = false;

  handleMouseOverViewContainer() {
    this.displayActionsOverlay = true;
  }

  handleMouseLeaveViewContainer() {
    if (this.showingPopover !== true) {
      this.displayActionsOverlay = false;
    }
  }

  handlePopoverShown(): void {
    this.showingPopover = true;
  }

  handlePopoverHidden(): void {
    this.showingPopover = false;
    this.displayActionsOverlay = false;
  }

  handleFavoriteClicked() {
    this.favoriteClicked.emit(this.dataViewReport);
  }
}
