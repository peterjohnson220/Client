import { Component, Input, ViewChild } from '@angular/core';

import { Permissions } from 'libs/constants';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
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

  docType: string;
  permissions = Permissions;

  exportJobDescription() {
    const htmlDocument: any = document;

    htmlDocument.exportForm.elements['export-uid'].value = Date.now();
    htmlDocument.exportForm.elements['export-type'].value = this.docType;
    htmlDocument.exportForm.submit();
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
