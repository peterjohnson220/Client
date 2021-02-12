import { Component, Input } from '@angular/core';

import { Permissions } from 'libs/constants';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';

@Component({
  selector: 'pf-job-description-export',
  templateUrl: './job-description-export.component.html',
  styleUrls: ['./job-description-export.component.scss']
})
export class JobDescriptionExportComponent {
  @Input() jobDescriptionId: number;
  @Input() actionIconSize = 'lg';
  @Input() theme = PfThemeType.Default;

  permissions = Permissions;

  exportJobDescription(docType: string) {
    const htmlDocument: any = document;

    htmlDocument.exportFormFromJobDescriptionExport.elements['export-uid'].value = Date.now();
    htmlDocument.exportFormFromJobDescriptionExport.elements['export-type'].value = docType;
    htmlDocument.exportFormFromJobDescriptionExport.submit();
  }
}
