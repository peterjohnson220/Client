import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Workbook, View } from '../../models';

@Component({
  selector: 'pf-workbook-views-card',
  templateUrl: './workbook-views-card.component.html',
  styleUrls: ['./workbook-views-card.component.scss']
})
export class WorkbookViewsCardComponent {
  @Input() workbook: Workbook;
  @Output() favoriteClicked: EventEmitter<{ workbookId: String, view: View }> =
    new EventEmitter<{ workbookId: String, view: View }>();

  isCollapsed = false;

  trackByViews(index: any, view: View) {
    return view.ViewId;
  }

  handleFavoriteClicked(view: View) {
    this.favoriteClicked.emit({ workbookId: this.workbook.WorkbookId, view });
  }
}
