import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

import {isObject} from 'util';

import {TransferScheduleSummary, SyncScheduleDtoModel} from 'libs/models/hris-api/sync-schedule';

import { junkExpression } from '../../helpers';

@Component({
  selector: 'pf-transfer-schedule-card',
  templateUrl: './transfer-schedule-card.component.html',
  styleUrls: ['./transfer-schedule-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferScheduleCardComponent implements OnChanges {
  @Input() transferSchedule: TransferScheduleSummary;
  @Input() showPublishButton: boolean;
  @Input() validationMode: boolean;
  @Output() changesPending = new EventEmitter();
  @Output() scheduleEnableSubmitted = new EventEmitter();
  @Output() scheduleDisableSubmitted = new EventEmitter();
  @Output() scheduleSaveSubmitted = new EventEmitter();

  isDirty: boolean;
  active = true;
  editMode = true;
  newExpression: string;

  canEdit() {
    return this.transferSchedule && this.transferSchedule.syncSchedule_ID > 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (isObject(changes.transferSchedule) && changes.transferSchedule.isFirstChange()) {
      if (this.transferSchedule.active !== null) {
        this.active = this.transferSchedule.active !== 0;
        this.editMode = false;
        this.changesPending.emit(false);
      } else {
        this.editMode = true;
        this.changesPending.emit(true);
      }
    }
  }

  setCronExpression(v: { expression: string, force: boolean }) {
    const valid = v.expression && v.expression.split(' ').filter(x => x).length === 5;
    this.newExpression = v.expression;
    this.isDirty = valid && (v.force || v.expression !== this.transferSchedule.expression);
  }

  toggleSchedule() {
    let shouldDispatch = true;

    this.active = !this.active;
    // if we are toggling with a schedule that does not exist yet...
    if (!this.newExpression || !this.transferSchedule.syncSchedule_ID) {
      if (!this.active && !this.transferSchedule.expression) {
        this.newExpression = junkExpression;
        this.isDirty = true;
        this.editMode = false;
        this.changesPending.emit(false);
        this.save();
        return;
      }
      if (this.transferSchedule.expression === junkExpression) {
        shouldDispatch = false;
      }
    }

    if (!this.active) {
      this.editMode = false;
      this.changesPending.emit(false);
    }

    if (!shouldDispatch) {
      return;
    }

    if (this.active) {
      this.scheduleEnableSubmitted.emit(this.transferSchedule.syncSchedule_ID);
    } else {
      this.scheduleDisableSubmitted.emit(this.transferSchedule.syncSchedule_ID);
    }
  }

  save() {
    if (!this.isDirty || !this.newExpression) {
      return;
    }
    const model: SyncScheduleDtoModel = {
      Expression: this.newExpression,
      Active: this.active,
      EntityMappingType_ID: this.transferSchedule.entityMappingType_ID,
      SyncSchedule_ID: this.transferSchedule.syncSchedule_ID ? this.transferSchedule.syncSchedule_ID : 0
    };

    this.scheduleSaveSubmitted.emit(model);
  }

  setEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode && !this.active) {
      this.active = true;
    }
    this.changesPending.emit(this.editMode);
  }
}
