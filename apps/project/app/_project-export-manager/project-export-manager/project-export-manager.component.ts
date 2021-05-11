import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ProjectTemplate } from 'libs/models/projects/project-templates';
import { ReportType, ProjectExportDataSource, ReportTypeModel, ProjectExportModalData } from 'libs/models/projects/project-export-manager';
import { PfValidators } from 'libs/forms/validators';
import { AsyncStateObj } from 'libs/models/state';

import * as fromProjectExportManagerActions from '../actions';
import * as fromPricingProjectActions from 'apps/project/app/_pricing-project/actions';
import * as fromProjectExportManagerReducer from '../reducers';

@Component({
  selector: 'pf-project-export-manager',
  templateUrl: './project-export-manager.component.html',
  styleUrls: []
})
export class ProjectExportManagerComponent implements OnInit, OnChanges {
  @Input() display: 'component' | 'modal' = 'modal';
  @Input() modalTitle: string;
  @Input() openModal = false;
  @Input() modalSize: 'lg' | 'md' | 'sm' = 'md';

  @Output() cancelChanges = new EventEmitter();
  @Output() saveSuccess = new EventEmitter();

  showExportManager = new BehaviorSubject<boolean>(false);

  showExportManager$ = this.showExportManager.asObservable();
  projectTemplates$: Observable<AsyncStateObj<ProjectTemplate[]>>;

  savedDataSources: ProjectExportDataSource[] = [];

  reportTypeOptions: ReportTypeModel[] = [
    {ReportTypeName: '.xls', ReportTypeValue: ReportType.Excel},
    {ReportTypeName: '.pdf', ReportTypeValue: ReportType.PDF},
    {ReportTypeName: '.csv', ReportTypeValue: ReportType.CSV}
  ];

  dataSources: ProjectExportDataSource[] = [
    {Key: 'Job Summary', Value: true},
    {Key: 'Job Details', Value: true},
    {Key: 'Employees', Value: true}
  ];

  selectedTemplateId = null;
  selectedReportType: ReportType = ReportType.Excel;

  ReportType = ReportType;
  templatePlaceHolder: ProjectTemplate = { TemplateName: 'Current', ProjectTemplateId: null };

  dataSourceForm: FormGroup;
  get f() { return this.dataSourceForm.controls; }

  constructor(private store: Store<fromProjectExportManagerReducer.State>, private formBuilder: FormBuilder) {
    this.projectTemplates$ = this.store.select(fromProjectExportManagerReducer.getProjectTemplatesAsync);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromProjectExportManagerActions.GetProjectTemplates());
    this.dataSourceForm = this.formBuilder.group({
      DataSources: this.formBuilder.array([], PfValidators.required)
    });

    this.dataSources.forEach(dataSource => this.updateFormControl(dataSource));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.openModal.currentValue) {
      this.showExportManager.next(true);
    }
  }

  updateDataSource(dataSource: ProjectExportDataSource): void {
    dataSource.Value = !dataSource.Value;
    this.updateFormControl(dataSource);
  }

  // https://www.positronx.io/angular-checkbox-tutorial/
  updateFormControl(dataSource: ProjectExportDataSource) {
    const dataSourceArray: FormArray = this.f.DataSources as FormArray;

    if (dataSource.Value) {
      dataSourceArray.push(new FormControl(dataSource.Key));
    } else {
      let i = 0;
      dataSourceArray.controls.forEach((item: FormControl) => {
        if (item.value === dataSource.Key) {
          dataSourceArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  exportProject(): void {
    const includedDataSources: string[] = [];
    this.dataSources.forEach(dataSource => {
      if (dataSource.Value) {
        includedDataSources.push(dataSource.Key);
      }
    });

    const modalData: ProjectExportModalData = {
      ProjectTemplateId: this.selectedTemplateId === null ? -1 : this.selectedTemplateId,
      FileType: this.selectedReportType,
      DataSources: includedDataSources
    };

    this.store.dispatch(new fromPricingProjectActions.QueuePricingProjectExport(modalData));

    this.resetModal();
    this.showExportManager.next(false);
    this.saveSuccess.emit();
  }

  cancelExport(): void {
    this.resetModal();
    this.showExportManager.next(false);
    this.cancelChanges.emit();
  }

  resetModal() {
    this.selectedReportType = ReportType.Excel;
    this.selectedTemplateId = null;
    this.f.DataSources = this.formBuilder.array([], PfValidators.required);
    this.dataSources.forEach(dataSource => {dataSource.Value = true; this.updateFormControl(dataSource); });
  }
}
