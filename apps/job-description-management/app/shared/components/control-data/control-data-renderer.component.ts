import { Component, Input, Output, EventEmitter} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Observable } from 'rxjs';

import { ControlType } from 'libs/models/common';


@Component({
  selector: 'pf-control-data-renderer',
  templateUrl: './control-data-renderer.component.html',
  styleUrls: ['./control-data-renderer.component.scss']
})

export class ControlDataRendererComponent {
  @Input() data: any[];
  @Input() controlType: ControlType;
  @Input() readOnly: boolean;
  @Input() checkInheritedData: boolean;
  @Input() additionalProperties: object;
  @Input() isCompare = false;
  @Input() undoChanges$: Observable<boolean>;
  @Input() replaceContents$: Observable<boolean>;
  @Input() rebuildQuillAfterDiscardDraft$: Observable<boolean>;

  @Output() dataChangesDetected = new EventEmitter();
  @Output() dataRowDeleted = new EventEmitter();
  @Output() bulkDataChangesDetected = new EventEmitter();
  @Output() additionalPropertiesChangesDetected = new EventEmitter();

  constructor(private sanitizer: DomSanitizer) {
  }

  // Events
  handleDataChangesDetected(dataRowChangeObj: any) {
    this.dataChangesDetected.emit(dataRowChangeObj);
  }

  handledDataRowDeleted(id: number) {
    this.dataRowDeleted.emit(id);
  }

  handleSmartEditorChangesDetected(dataChangeObj: any) {
    this.bulkDataChangesDetected.emit(dataChangeObj);
  }

  handleAdditionalPropertiesChangesDetected(additionalProperties: object) {
    this.additionalPropertiesChangesDetected.emit(additionalProperties);
  }

  hasData(dataRow: any) {
    return this.controlType.Attributes.some(a => !!dataRow[a.DisplayName]);
  }
}
