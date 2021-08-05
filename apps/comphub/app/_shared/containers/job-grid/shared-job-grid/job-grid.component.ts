import { Component, EventEmitter, Input, Output } from '@angular/core';

import { JobGridData } from 'libs/models/comphub';

import { QuickPriceGridColumn } from '../../../models';
import { DataCardHelper } from '../../../helpers';

@Component({
  selector: 'pf-comphub-job-grid',
  templateUrl: './job-grid.component.html',
  styleUrls: ['./job-grid.component.scss']
})
export class JobGridComponent {
  @Input() jobTitle: string;
  @Input() jobGridData: JobGridData;
  @Input() gridHasData: boolean;
  @Input() gridColumnsConfiguration: QuickPriceGridColumn[];
  @Input() loading: boolean;
  @Input() loadingError: boolean;
  @Input() countryCode: string;
  @Input() gridContext: any;

  @Output() loadMoreClicked: EventEmitter<any> = new EventEmitter();

  firstDayOfMonth: Date;

  constructor() {
    this.firstDayOfMonth = DataCardHelper.firstDayOfMonth();
  }

  handleLoadMore(): void {
    if (!this.jobGridData?.Data?.length) {
      return;
    }
    this.gridContext.skip = this.jobGridData.Data.length;
    this.loadMoreClicked.emit(this.gridContext);
  }

}
