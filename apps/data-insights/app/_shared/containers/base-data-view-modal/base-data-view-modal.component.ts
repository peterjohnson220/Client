import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

import { FormGroup } from '@angular/forms';

import { Entity } from '../../models';

@Component({
  selector: 'pf-base-data-view-modal',
  templateUrl: './base-data-view-modal.component.html',
  styleUrls: ['./base-data-view-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseDataViewModalComponent {
  @Input() baseEntities: Entity[];
  @Input() reportName: string;
  @Input() summary: string;
  @Input() showErrorMessages: boolean;
  @Input() saving: boolean;
  @Input() savingConflict: boolean;
  @Input() savingError: boolean;
  @Input() baseDataViewForm: FormGroup;
  @Input() saveDisabled: boolean;
  @Output() saveClicked: EventEmitter<any> = new EventEmitter();
  @Output() cancelClicked: EventEmitter<any> = new EventEmitter();

  close(): void {
    this.cancelClicked.emit();
  }

  save(): void {
    this.saveClicked.emit();
  }
}
