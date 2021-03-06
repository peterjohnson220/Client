import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

@Component({
  selector: 'pf-grid-detail-panel',
  templateUrl: './grid-detail-panel.component.html',
  styleUrls: ['./grid-detail-panel.component.scss']
})
export class GridDetailPanelComponent {
  @Input() isExpanded$: Observable<boolean>;
  @Input() checkForJdmDescription = false;

  @Input() jdmDescriptionIds: number[];
  @Input() jdmDescriptionLoading: boolean;
  @Input() jdmDescriptionLoadingError: boolean;

  @Input() jobId: number;
  @Input() jobTitle: string;
  @Input() jobDescription: string;
  @Input() jobCode: string;
  @Input() jobFamily: string;
  @Input() jobExchange: string;

  @Output() closeClick = new EventEmitter();
  @Output() viewJdmDescriptionClick = new EventEmitter();

  jdmUrl = '/client/job-description-management/job-descriptions';

  handleClose() {
    this.closeClick.emit();
  }

  handleViewJdmDescriptionClick() {
    this.viewJdmDescriptionClick.emit();
  }
}
