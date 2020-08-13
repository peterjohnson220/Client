import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {GridDataResult} from '@progress/kendo-angular-grid';

import isObject from 'lodash/isObject';

import {EntityLoadSummaryView} from 'libs/models/admin/loader-dashboard';

@Component({
  selector: 'pf-loader-dashboard-grid-detail',
  templateUrl: './loader-dashboard-grid-detail.component.html',
  styleUrls: ['./loader-dashboard-grid-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderDashboardGridDetailComponent implements OnChanges {
  @Input() dataItem: EntityLoadSummaryView[];
  gridView: GridDataResult;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (isObject(this.dataItem)) {
      this.refreshGridView();
    }
  }

  refreshGridView() {
    this.gridView = {
      data: this.dataItem,
      total: this.dataItem.length
    };
  }
}
