import { Component, Input, ViewChild } from '@angular/core';

import { Workbook } from '../../../models';
import { WorkbookCardComponent } from '../workbook-card';

@Component({
  selector: 'pf-dataview-workbook-card',
  templateUrl: './dataview-workbook-card.component.html',
  styleUrls: ['./dataview-workbook-card.component.scss']
})
export class DataViewWorkbookCardComponent {
  @Input() workbook: Workbook;

  @ViewChild(WorkbookCardComponent, { static: false }) public workbookCard: WorkbookCardComponent;
  showingPopover = false;

  handlePopoverShown(): void {
    this.showingPopover = true;
  }

  handlePopoverHidden(): void {
    this.showingPopover = false;
    this.workbookCard.resetDisplayActionsOverlay();
  }
}
