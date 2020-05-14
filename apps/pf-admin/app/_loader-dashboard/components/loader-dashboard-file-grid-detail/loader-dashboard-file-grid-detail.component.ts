import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {GridDataResult} from '@progress/kendo-angular-grid';

import { isObject } from 'lodash';

import {CompanyFilePackagesDetail} from 'libs/models/admin/loader-dashboard';

@Component({
  selector: 'pf-loader-dashboard-file-grid-detail',
  templateUrl: './loader-dashboard-file-grid-detail.component.html',
  styleUrls: ['./loader-dashboard-file-grid-detail.component.scss']
})
export class LoaderDashboardFileGridDetailComponent implements OnChanges {
  @Input() dataItem: CompanyFilePackagesDetail[];
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
