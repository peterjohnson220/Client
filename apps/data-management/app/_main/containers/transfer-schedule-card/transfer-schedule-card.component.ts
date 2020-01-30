import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Store} from '@ngrx/store';

import {isObject} from 'util';

import {TransferScheduleSummary, SyncScheduleDtoModel} from 'libs/models/hris-api/sync-schedule';

import * as fromDataManagementMainReducer from '../../reducers';
import * as fromTransferScheduleActions from '../../actions/transfer-schedule.actions';

@Component({
  selector: 'pf-transfer-schedule-card',
  templateUrl: './transfer-schedule-card.component.html',
  styleUrls: ['./transfer-schedule-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferScheduleCardComponent implements OnChanges {
  @Input() transferSchedule: TransferScheduleSummary;
  @Output() changesPending = new EventEmitter();
  isDirty: boolean;
  active = true;
  editMode = true;
  newExpression: string;

  constructor(private store: Store<fromDataManagementMainReducer.State>) { }

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
    const junkExpression = '59 23 31 12 *';
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
      this.store.dispatch(new fromTransferScheduleActions.EnableTransferSchedule(this.transferSchedule.syncSchedule_ID));
    } else {
      this.store.dispatch(new fromTransferScheduleActions.DisableTransferSchedule(this.transferSchedule.syncSchedule_ID));
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

    this.store.dispatch(new fromTransferScheduleActions.SaveTransferSchedule(model));
  }

  setEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode && !this.active) {
      this.active = true;
    }
    this.changesPending.emit(this.editMode);
  }
}
