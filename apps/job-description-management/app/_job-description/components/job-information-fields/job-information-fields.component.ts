import { Component, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import { AvailableJobInformationField } from 'libs/features/job-description-management/models/available-job-information-field.model';
import * as fromJobInformationFieldsReducer from '../../reducers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pf-job-information-fields',
  templateUrl: './job-information-fields.component.html',
  styleUrls: ['./job-information-fields.component.scss']
})

export class JobInformationFieldsComponent implements OnInit, OnDestroy {
  @Output() selectedJobInformationIds = new EventEmitter();
  @Output() selectedJobInformationFieldsString = new EventEmitter();

  public allJobInformationFieldsSelected = false;
  public jobInformationFieldsDisplay = false;
  public selectedJobInformationFieldsAsString: string;
  public jobInformationFieldSelected = false;
  public jobInformationFields: AvailableJobInformationField[];
  public jobInformationFieldsLoading: boolean;

  private jobInformationFields$: Observable<AvailableJobInformationField[]>;
  private jobInformationFieldsLoading$: Observable<boolean>;

  private jobInformationFieldsSubscription: Subscription;

  constructor(private store: Store<fromJobInformationFieldsReducer.State>) {
    this.jobInformationFieldsLoading$ = this.store.select(fromJobInformationFieldsReducer.getJobInformationFieldsForBulkExportLoading);
    this.jobInformationFields$ = this.store.select(fromJobInformationFieldsReducer.getJobInformationFieldsForBulkExport);
  }

  stringify(obj) {
    return JSON.stringify(obj);
  }

  toggleAllJobInformationFields() {
    this.allJobInformationFieldsSelected = !this.allJobInformationFieldsSelected;

    this.jobInformationFields.map(jif => jif.Checked = this.allJobInformationFieldsSelected || jif.IsRequired);

    this.updateJobInformationFieldSelected();
  }

  toggleJobInformationFieldsDisplay() {
    this.jobInformationFieldsDisplay = !this.jobInformationFieldsDisplay;
  }

  toggleJobInformationField(event, jobInformationField: AvailableJobInformationField) {
    jobInformationField.Checked = event.target.checked;

    this.allJobInformationFieldsSelected = jobInformationField.Checked && this.areAllJobInformationFieldsChecked();

    this.updateJobInformationFieldSelected();
  }

  private getCheckedJobInformationFields() {
    return this.jobInformationFields.filter(jif => jif.Checked);
  }

  private areAllJobInformationFieldsChecked() {
    return this.getCheckedJobInformationFields().length === this.jobInformationFields.length;
  }

  private updateJobInformationFieldSelected() {
    const checkedJobInfoFields = this.getCheckedJobInformationFields();
    this.selectedJobInformationFieldsAsString = this.stringify(checkedJobInfoFields);
    this.selectedJobInformationIds.emit(checkedJobInfoFields.map(j => j.Id));
    this.selectedJobInformationFieldsString.emit(this.selectedJobInformationFieldsAsString);
    this.jobInformationFieldSelected = checkedJobInfoFields.length > 0;
    this.allJobInformationFieldsSelected = this.getCheckedJobInformationFields().length === this.jobInformationFields.length;
  }

  ngOnInit() {
    this.jobInformationFieldsSubscription = this.jobInformationFields$.subscribe(jifs => {
      if (jifs) {
        // had to add cloneDeep here in order to allow the fields to be altered, such as Checked.
        this.jobInformationFields = cloneDeep(jifs);
        this.updateJobInformationFieldSelected();
      }
    });
  }

  ngOnDestroy() {
    this.jobInformationFieldsSubscription.unsubscribe();
  }
}
