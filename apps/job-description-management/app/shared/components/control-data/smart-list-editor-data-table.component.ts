import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ControlTypeAttribute } from 'libs/models/common';

@Component({
  selector: 'pf-smart-list-editor-data-table',
  templateUrl: './smart-list-editor-data-table.component.html',
  styleUrls: ['./smart-list-editor-data-table.component.scss']
})

export class SmartListEditorDataTableComponent {
  @Input() data: any[];
  @Input() attributes: ControlTypeAttribute[];
  @Input() readOnly: boolean;
  @Input() checkInheritedData: boolean;
  @Input() additionalProperties: any;

  @Output() dataChangesDetected = new EventEmitter();

  constructor() {
  }

  handleDataChangesDetected(dataRowChangeObj: any) {
    this.dataChangesDetected.emit(dataRowChangeObj);
  }

  canEditAttribute(dataRow, attribute: ControlTypeAttribute) {
    return !attribute.CanBeSourced &&
      ((!this.readOnly && !this.checkInheritedData) ||
        (!this.readOnly && this.checkInheritedData && (!dataRow.TemplateId || attribute.CanEditTemplateData)));
  }

  getBullet(index: number) {
    return this.additionalProperties && this.additionalProperties.ListType === 'OL' ? `${index + 1}.` : '&bull;';
  }

  trackByFn(index: number, dataRow: any) {
    return dataRow.Id;
  }

  trackByAttributeFn(index: number, row: ControlTypeAttribute) {
    return index + '_' + row.Name;
  }
}
