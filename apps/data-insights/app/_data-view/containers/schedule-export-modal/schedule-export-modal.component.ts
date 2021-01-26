import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import cloneDeep from 'lodash/cloneDeep';

import { ExportFormatComponent, ExportFrequencyComponent } from 'libs/features/export-scheduler/export-scheduler/components';
import { AsyncStateObj } from 'libs/models/state';
import { TabularReportExportSchedule } from 'libs/features/reports/models/tabular-report-export-schedule.model';
import { UserDataView } from 'libs/ui/formula-editor/models';
import { CronExpressionHelper, ExportFrequencyType } from 'libs/features/export-scheduler/export-scheduler/helpers';
import { ExportScheduleHelper } from 'libs/features/export-scheduler/export-scheduler/models';

import * as fromDataViewMainReducer from '../../reducers';
import * as fromScheduleExportModalActions from '../../actions/schedule-export-modal.actions';

@Component({
  selector: 'pf-schedule-export-modal',
  templateUrl: './schedule-export-modal.component.html',
  styleUrls: ['./schedule-export-modal.component.scss']
})
export class ScheduleExportModalComponent implements OnInit, OnDestroy {
  @ViewChild(ExportFormatComponent, { static: true }) exportFormat: ExportFormatComponent;
  @ViewChild(ExportFrequencyComponent, { static: true }) exportFrequency: ExportFrequencyComponent;
  @ViewChild('scheduleDataViewModal', { static: true }) public scheduleDataViewModal: any;

  userDataView: UserDataView;
  currentSchedule: TabularReportExportSchedule;

  savedSchedulesAsync$: Observable<AsyncStateObj<TabularReportExportSchedule[]>>;

  getSavedSchedulesSubscription: Subscription;

    constructor(
    protected modalService: NgbModal,
    protected formBuilder: FormBuilder,
    private exportModalStore: Store<fromDataViewMainReducer.State>
  ) {
    this.savedSchedulesAsync$ = this.exportModalStore.select(fromDataViewMainReducer.getSavedSchedulesAsync);
  }

  ngOnInit(): void {
    this.getSavedSchedulesSubscription = this.savedSchedulesAsync$.subscribe(
      value => {
        if (value.obj) {
          this.currentSchedule = value.obj.find(schedules => schedules.DataViewId === this.userDataView?.UserDataViewId);
        }
      }
    );

    this.exportModalStore.dispatch(new fromScheduleExportModalActions.GetSavedSchedules());
  }

  ngOnDestroy(): void {
    this.getSavedSchedulesSubscription.unsubscribe();
  }

  open(): NgbModalRef {
    return this.modalService.open(ScheduleExportModalComponent, { backdrop: 'static', centered: true });
  }

  handleSaveClicked(): void {
    const cronExpression = this.exportFrequency.selectedFrequency === ExportFrequencyType.OneTime
      ? null
      : CronExpressionHelper.generateCronExpression(this.exportFrequency.selectedFrequency,
        this.exportFrequency.selectedDaysOfWeek,
        this.exportFrequency.selectedMonthlyOccurrence);
    if ((this.exportFrequency.selectedFrequency !== ExportFrequencyType.OneTime && cronExpression === '')) {
      return;
    }
    const schedule: TabularReportExportSchedule = {
      DataViewId: this.userDataView?.UserDataViewId,
      Format: this.exportFormat.selectedFormat,
      FormatSeparatorType: this.exportFormat.selectedFormat === ExportScheduleHelper.csvFileFormat ?
        this.exportFormat.selectedSeparatorType : null,
      Frequency: this.exportFrequency.selectedFrequency,
      CronExpression: cronExpression
    };

    this.exportModalStore.dispatch(new fromScheduleExportModalActions.SaveSchedule(schedule));
  }

  handleUpdateClicked() {
    const updatedSchedule = cloneDeep(this.currentSchedule);
    updatedSchedule.Format = this.exportFormat.selectedFormat;
    updatedSchedule.FormatSeparatorType = this.exportFormat?.selectedSeparatorType;
    updatedSchedule.Frequency = this.exportFrequency.selectedFrequency;
    updatedSchedule.CronExpression = CronExpressionHelper.generateCronExpression(
      this.exportFrequency.selectedFrequency,
      this.exportFrequency.selectedDaysOfWeek,
      this.exportFrequency.selectedMonthlyOccurrence);
    updatedSchedule.FrequencyTextFormat = ExportScheduleHelper.getFrequencyTextFormat(this.exportFrequency.selectedFrequency, updatedSchedule.CronExpression);

    this.exportModalStore.dispatch(new fromScheduleExportModalActions.UpdateExportSchedule(updatedSchedule));
  }

  handleDeleteClicked() {
    this.exportModalStore.dispatch(new fromScheduleExportModalActions.DeleteExportSchedule(this.currentSchedule.DataViewId));
  }

  close(): void {
    this.exportFormat.reset();
    this.exportFrequency.reset();
    this.modalService.dismissAll();
  }

  get saveDisabled(): boolean {
    return !(this.exportFormat?.isValid && this.exportFrequency?.isValid);
  }

  get changesMade(): boolean {
    return (this.exportFormat?.changesMade || this.exportFrequency?.changesMade) && this.exportFrequency?.isValid;
  }
}
