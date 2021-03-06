import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { ControlTypeAttribute } from 'libs/models/common';

import { ControlDataHelper } from '../../../helpers';

@Component({
  selector: 'pf-list-editor',
  templateUrl: './list-editor.component.html',
  styleUrls: ['./list-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListEditorComponent {
  @Input() data: any[];
  @Input() attributes: ControlTypeAttribute[];
  @Input() readOnly: boolean;
  @Input() checkInheritedData: boolean;
  @Input() locked: boolean;
  @Input() isCompare = false;

  @Output() dataChangesDetected = new EventEmitter();
  @Output() dataRowDeleted = new EventEmitter();

  controlDataHelper = ControlDataHelper;

  handleDataChangesDetected(dataRowChangeObj: any) {
    this.dataChangesDetected.emit(dataRowChangeObj);
  }

  deleteDataRow(id: number) {
    this.dataRowDeleted.emit(id);
  }

  canEditAttribute(dataRow, attribute: ControlTypeAttribute) {
    return (!this.readOnly && !this.checkInheritedData) ||
      (!this.readOnly && this.checkInheritedData && (!dataRow.TemplateId || attribute.CanEditTemplateData));
  }

  trackByFn(index: number, dataRow: any) {
    return dataRow.Id;
  }

  trackByAttributeFn(index: number, row: ControlTypeAttribute) {
    return index + '_' + row.Name;
  }
}
