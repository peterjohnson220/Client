import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';

import { JobDescriptionControl } from 'libs/models/jdm';

@Component({
  selector: 'pf-job-description-control',
  templateUrl: './job-description-control.component.html',
  styleUrls: ['./job-description-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobDescriptionControlComponent {
  @Input() jobDescriptionControl: JobDescriptionControl;
  @Input() readOnly: boolean;
  @Input() isCompare: boolean;
  @Input() saveThrottle: Subject<any>;
  @Input() jobDescriptionStatus: string;
  @Input() undoChanges$: Observable<boolean>;
  @Input() replaceContents$: Observable<boolean>;

  @Output() dataChangesDetected = new EventEmitter();
  @Output() bulkDataChangesDetected = new EventEmitter();
  @Output() additionalPropertiesChangesDetected = new EventEmitter();
  @Output() dataRowDeleted = new EventEmitter();
  @Output() dataRowAdded = new EventEmitter();

  hideBody = false;

  // if AdditionalProperties.ShowControlName is explicitly set to false, do not show control name
  get showControlName() {
    return this.jobDescriptionControl?.AdditionalProperties?.ShowControlName === false ? false : true;
  }

  // if AdditionalProperties.ShowControl is explicitly set to false, do not show control
  get showControl() {
    const result = this.jobDescriptionControl?.AdditionalProperties?.ShowControl === false ? false : true;
    return result;
  }

  toggleBody() {
    this.hideBody = !this.hideBody;
  }

  addDataRow(): void {
    this.dataRowAdded.emit(
      {
        control: this.jobDescriptionControl,
        attributes: this.jobDescriptionControl.ControlType.Attributes,
        save: true
      }
    );
  }

  // Events
  handledDataRowDeleted(id: number) {
    this.dataRowDeleted.emit({jobDescriptionControl: this.jobDescriptionControl, dataRowId: id});
  }

  handleDataChangesDetected(dataRowChangeObj: any) {
    this.dataChangesDetected.emit({control: this.jobDescriptionControl, change: dataRowChangeObj});
  }

  handleBulkDataChangesDetected(bulkDataChangeObj: any) {
    this.bulkDataChangesDetected.emit({
      control: this.jobDescriptionControl,
      attributes: this.jobDescriptionControl.ControlType.Attributes,
      bulkData: bulkDataChangeObj
    });
  }

  handleAdditionalPropertiesChangesDetected(additionalProperties: object) {
    this.additionalPropertiesChangesDetected.emit({control: this.jobDescriptionControl, additionalProperties: additionalProperties});
  }

}
