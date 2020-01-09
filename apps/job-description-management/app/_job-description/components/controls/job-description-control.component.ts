import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { filter, skip } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ControlType } from 'libs/models/common';
import { JobDescriptionControl } from 'libs/models/jdm';

import * as fromJobDescriptionManagementSharedReducer from '../../../shared/reducers';
import * as fromJobDescriptionReducers from '../../reducers';

@Component({
  selector: 'pf-job-description-control',
  templateUrl: './job-description-control.component.html',
  styleUrls: ['./job-description-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobDescriptionControlComponent implements OnInit, OnDestroy {
  @Input() jobDescriptionControl: JobDescriptionControl;
  @Input() readOnly: boolean;
  @Input() controlTypesLoaded: boolean;
  @Input() isCompare: boolean;
  @Input() saveThrottle: Subject<any>;
  @Output() dataChangesDetected = new EventEmitter();
  @Output() bulkDataChangesDetected = new EventEmitter();
  @Output() additionalPropertiesChangesDetected = new EventEmitter();
  @Output() dataRowDeleted = new EventEmitter();
  @Output() dataRowAdded = new EventEmitter();

  hideBody = false;
  controlType: ControlType;
  controlTypeSubscription: Subscription;
  changesSubscription: Subscription;
  changesSubject: Subject<any>;
  bulkChangesSubject: Subject<any>;
  undoChanges$: Observable<boolean>;

  constructor(
    private sharedStore: Store<fromJobDescriptionManagementSharedReducer.State>,
    private store: Store<fromJobDescriptionReducers.State>) {
    this.changesSubject = new Subject();
    this.bulkChangesSubject = new Subject();
    this.undoChanges$ = this.store.select(fromJobDescriptionReducers.getUndoJobDescriptionChangesComplete);
  }

  ngOnInit() {
    this.controlTypeSubscription = this.sharedStore
      .select(fromJobDescriptionManagementSharedReducer.getControlTypeAndVersion).pipe(
        filter(cts => !!cts)
      ).subscribe(cts => {
        const ct = cts.find(control => control.Type === this.jobDescriptionControl.Type
          && control.ControlVersion === this.jobDescriptionControl.ControlVersion);

        if (ct) {
          this.controlType = ct;

          if (this.shouldAddDataRowOnInit(ct)) {
            this.addDataRow(false);
          }

          this.watchForControlValueChanges();
        }
      });
  }

  get showControlName() {
    if (this.jobDescriptionControl && this.jobDescriptionControl.AdditionalProperties) {
      return this.jobDescriptionControl.AdditionalProperties.ShowControlName;
    }
  }

  toggleBody() {
    this.hideBody = !this.hideBody;
  }

  addDataRow(triggerSave: boolean) {
    this.dataRowAdded.emit(
      {
        control: this.jobDescriptionControl,
        attributes: this.controlType.Attributes,
        save: triggerSave
      }
    );
  }

  // Events
  handledDataRowDeleted(id: number) {
    this.dataRowDeleted.emit({jobDescriptionControl: this.jobDescriptionControl, dataRowId: id});
  }

  handleDataChangesDetected(dataRowChangeObj: any) {
    this.changesSubject.next({control: this.jobDescriptionControl, change: dataRowChangeObj});
  }

  handleBulkDataChangesDetected(bulkDataChangeObj: any) {
    this.bulkChangesSubject.next({
      control: this.jobDescriptionControl,
      attributes: this.controlType.Attributes,
      bulkData: bulkDataChangeObj
    });
  }

  handleAdditionalPropertiesChangesDetected(additionalProperties: object) {
    this.additionalPropertiesChangesDetected.emit({control: this.jobDescriptionControl, additionalProperties: additionalProperties});
  }

  // Private Methods
  private hasJobDescriptionDataRow() {
    return !this.jobDescriptionControl.Data.length ? false : this.jobDescriptionControl.Data.some(dataRow => !dataRow.TemplateId);
  }

  private watchForControlValueChanges() {

    this.changesSubscription = this.changesSubject.subscribe(dataRowChangeObj => this.dataChangesDetected.emit(dataRowChangeObj));

    this.bulkChangesSubject.pipe(
      skip(this.jobDescriptionControl.Data.length ? 1 : 0)
    ).subscribe(bulkDataChangeObj => this.bulkDataChangesDetected.emit(bulkDataChangeObj));
  }

  private getRTEWithDataCount() {
    let rteCount = 0;

    this.jobDescriptionControl.Data.filter(d => !d.hasOwnProperty('TemplateId')).forEach(dataRow => {
      this.controlType.Attributes.forEach(a => {
        (a.Type === 'RichText' || a.Type === 'Textarea') && !!dataRow[a.Name] ? rteCount += 1 : rteCount = rteCount;
      });
    });

    return rteCount;
  }

  private shouldAddDataRowOnInit(controlType: ControlType) {
    return controlType.EditorType !== 'SmartList' &&
      !controlType.ReadOnly &&
      !(controlType.EditorType === 'Single' && this.jobDescriptionControl.Data.length) &&
      !(controlType.EditorType === 'List' && controlType.Locked && this.jobDescriptionControl.Data.length) &&
      !this.hasJobDescriptionDataRow();
  }

  ngOnDestroy() {
    this.controlTypeSubscription.unsubscribe();
    if (this.changesSubscription) {
      this.changesSubscription.unsubscribe();
    }
  }
}
