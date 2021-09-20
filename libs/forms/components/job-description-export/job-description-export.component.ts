import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';

import { Permissions } from 'libs/constants';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums';
import { JobDescriptionExportRequest } from 'libs/models/payfactors-api';
import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common';

@Component({
  selector: 'pf-job-description-export',
  templateUrl: './job-description-export.component.html',
  styleUrls: ['./job-description-export.component.scss']
})
export class JobDescriptionExportComponent {
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;
  @Input() jobDescriptionId: number;
  @Input() actionIconSize = 'lg';
  @Input() theme = PfThemeType.Default;
  @Input() enableFileDownloadSecurityWarning: boolean;
  @Input() pageViewId: string;
  @Output() exportClicked: EventEmitter<JobDescriptionExportRequest> = new EventEmitter();

  docType: string;
  permissions = Permissions;

  exportJobDescription() {
    if (!this.pageViewId) {
      return;
    }
    const request: JobDescriptionExportRequest = {
      JobDescriptionId: this.jobDescriptionId,
      FileExtension: this.docType,
      ViewName: 'Default',
      ReportName: 'Job Description',
      PageViewId: this.pageViewId
    };

    this.exportClicked.emit(request);
  }

  handleExportJobDescription(docType: string) {
    this.docType = docType;
    if (this.enableFileDownloadSecurityWarning) {
      this.fileDownloadSecurityWarningModal.open();
    } else {
      this.exportJobDescription();
    }
  }

  handleSecurityWarningConfirmed(isConfirmed) {
    if (isConfirmed) {
      this.exportJobDescription();
    }
  }
}
