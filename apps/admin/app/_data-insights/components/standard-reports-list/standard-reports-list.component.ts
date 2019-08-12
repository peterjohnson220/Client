import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { StandardReportDetails } from '../../models';

@Component({
  selector: 'pf-standard-reports-list',
  templateUrl: './standard-reports-list.component.html',
  styleUrls: ['./standard-reports-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandardReportsListComponent {
  @Input() standardReportsList: StandardReportDetails[];
  @Input() loading: boolean;
  @Input() filter: string;
  @Output() editClicked: EventEmitter<StandardReportDetails> = new EventEmitter();

  constructor() { }

  handleEditClicked(reportDetails: StandardReportDetails) {
    if (!reportDetails) {
      return;
    }
    this.editClicked.emit(reportDetails);
  }
}
