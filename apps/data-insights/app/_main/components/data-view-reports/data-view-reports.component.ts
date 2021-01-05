import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { Workbook } from 'libs/features/surveys/reports/models';

@Component({
  selector: 'pf-data-view-reports',
  templateUrl: './data-view-reports.component.html',
  styleUrls: ['./data-view-reports.component.scss']
})
export class DataViewReportsComponent implements OnDestroy {
  @Input() dataViewReports: Workbook[];
  @Output() favoriteClicked: EventEmitter<Workbook> = new EventEmitter<Workbook>();
  @Output() dataViewReportsOrderUpdated: EventEmitter<string[]> = new EventEmitter<string[]>();

  dragulaSub: Subscription;
  isCollapsed = false;

  constructor(
    private dragulaService: DragulaService
  ) {
    this.dragulaSub = new Subscription();
    this.dragulaSub.add(this.dragulaService.dropModel('dataView-reports').subscribe(({ sourceModel }) => {
      this.handleDropModel(sourceModel);
    }));
  }

  ngOnDestroy() {
    this.dragulaSub.unsubscribe();
  }

  handleFavoriteClicked(obj: Workbook) {
    this.favoriteClicked.emit(obj);
  }

  trackByDataViewReport(index: any, workbook: Workbook) {
    return workbook.WorkbookId;
  }

  private handleDropModel(sourceModel: any[]) {
    if (!sourceModel) {
      return;
    }
    const workbookIds = sourceModel.map((x: Workbook) => x.WorkbookId);
    this.dataViewReportsOrderUpdated.emit(workbookIds);
  }
}
