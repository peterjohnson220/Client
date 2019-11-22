import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Workbook } from '../../models';


@Component({
  selector: 'pf-data-view-reports',
  templateUrl: './data-view-reports.component.html',
  styleUrls: ['./data-view-reports.component.scss']
})
export class DataViewReportsComponent {
  @Input() dataViewReports: Workbook[];
  @Output() favoriteClicked: EventEmitter<Workbook> = new EventEmitter<Workbook>();

  isCollapsed = false;

  handleFavoriteClicked(obj: Workbook) {
    this.favoriteClicked.emit(obj);
  }

  trackByDataViewReport(index: any, workbook: Workbook) {
    return workbook.WorkbookId;
  }

}
