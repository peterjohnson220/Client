import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ControlTypeAttribute } from 'libs/models/common';

import { JobDescriptionManagementService } from '../../services';

@Component({
  selector: 'pf-single-editor',
  templateUrl: './single-editor.component.html',
  styleUrls: ['./single-editor.component.scss']
})

export class SingleEditorComponent {
  @Input() data: any[];
  @Input() attributes: ControlTypeAttribute[];
  @Input() vertical: boolean;
  @Input() readOnly: boolean;
  @Input() checkInheritedData: boolean;

  @Output() dataChangesDetected = new EventEmitter();

  constructor(
    private jobDescriptionManagementService: JobDescriptionManagementService
  ) {
  }

  handleDataChangesDetected(dataRowChangeObj: any) {
    this.dataChangesDetected.emit(dataRowChangeObj);
  }

  canEditAttribute(dataRow, dataRowIndex, attribute: ControlTypeAttribute) {
    let canEdit = (!this.readOnly && !this.checkInheritedData) ||
      (!this.readOnly && this.checkInheritedData && (!dataRow.TemplateId || attribute.CanEditTemplateData));

    if (canEdit && attribute.CanEditTemplateData && (dataRowIndex > 0)) {
      canEdit = false;
    }
    return canEdit;
  }
}
