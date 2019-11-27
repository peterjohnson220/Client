import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Subject } from 'rxjs';

import { JobDescriptionControl, JobDescriptionSection } from 'libs/models';

@Component({
  selector: 'pf-job-description-section',
  templateUrl: './job-description-section.component.html',
  styleUrls: ['./job-description-section.component.scss']
})

export class JobDescriptionSectionComponent {
  @Input() section: JobDescriptionSection;
  @Input() readOnly: boolean;
  @Input() controlTypesLoaded = false;
  @Input() isCompare = false;
  @Input() saveThrottle: Subject<any>;
  @Output() controlDataChangesDetected = new EventEmitter();
  @Output() controlBulkDataChangesDetected = new EventEmitter();
  @Output() controlAdditionalPropertiesChangesDetected = new EventEmitter();
  @Output() controlDataRowDeleted = new EventEmitter();
  @Output() controlDataRowAdded = new EventEmitter();

  hideBody = false;

  constructor() {
  }

  toggleBody() {
    this.hideBody = !this.hideBody;
  }

  // Events
  handleControlDataChangesDetected(changeObj: any) {
    this.controlDataChangesDetected.emit(changeObj);
  }

  handleControlDataRowDeleted(removeDataRowObj: any) {
    this.controlDataRowDeleted.emit(removeDataRowObj);
  }

  handleControlDataRowAdded(addDataRowObj: any) {
    this.controlDataRowAdded.emit(addDataRowObj);
  }

  handleControlBulkDataChangesDetected(bulkChangeObj: any) {
    this.controlBulkDataChangesDetected.emit(bulkChangeObj);
  }

  handleAdditionalPropertiesChangesDetected(eventArgs: any) {
    this.controlAdditionalPropertiesChangesDetected.emit(eventArgs);
  }

  trackByFn(index: number, control: JobDescriptionControl) {
    return control.Id;
  }
}
