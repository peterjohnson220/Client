import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { JobDescriptionControl, JobDescriptionSection } from 'libs/models';

@Component({
  selector: 'pf-job-description-section',
  templateUrl: './job-description-section.component.html',
  styleUrls: ['./job-description-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class JobDescriptionSectionComponent {
  @Input() section: JobDescriptionSection;
  @Input() readOnly: boolean;
  @Input() isCompare = false;
  @Input() saveThrottle: Subject<any>;
  @Input() jobDescriptionStatus: string;
  @Input() undoChanges$: Observable<boolean>;
  @Input() replaceContents$: Observable<boolean>;

  @Output() controlDataChangesDetected = new EventEmitter();
  @Output() controlBulkDataChangesDetected = new EventEmitter();
  @Output() controlAdditionalPropertiesChangesDetected = new EventEmitter();
  @Output() controlDataRowDeleted = new EventEmitter();
  @Output() controlDataRowAdded = new EventEmitter();

  hideBody = false;

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
