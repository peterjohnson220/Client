import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { ControlTypeAttribute } from 'libs/models/common';

import { ControlDataHelper } from '../../../helpers';

@Component({
  selector: 'pf-single-editor',
  templateUrl: './single-editor.component.html',
  styleUrls: ['./single-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SingleEditorComponent {
  @Input() data: any[];
  @Input() attributes: ControlTypeAttribute[];
  @Input() vertical: boolean;
  @Input() readOnly: boolean;
  @Input() checkInheritedData: boolean;

  @Output() dataChangesDetected = new EventEmitter();

  controlDataHelper = ControlDataHelper;

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

  trackByFn(index: number, dataRow: any) {
    return dataRow.Id;
  }

  trackByAttributeFn(index: number, row: ControlTypeAttribute) {
    return index + '_' + row.Name;
  }
}
