import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import isObject from 'lodash/isObject';
import { EntityLoadSummaryDetailView } from 'libs/models/admin/loader-dashboard';
import { DetailKeysModel } from '../../models/detail-keys.model';

@Component({
  selector: 'pf-loader-dashboard-grid-summary-detail',
  templateUrl: './loader-dashboard-grid-summary-detail.component.html',
  styleUrls: ['./loader-dashboard-grid-summary-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderDashboardGridSummaryDetailComponent implements OnChanges {
  @Input() dataItem: EntityLoadSummaryDetailView[];
  @Input() detailKeys: DetailKeysModel;
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
