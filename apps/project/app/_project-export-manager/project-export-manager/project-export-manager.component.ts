import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { ProjectTemplate } from 'libs/models/projects/project-templates';
import {
  ReportType,
  ProjectExportDataSource,
  ReportTypeModel,
  ProjectExportModalData,
  AdditionalProjectExportData
} from 'libs/models/projects/project-export-manager';
import { PfValidators } from 'libs/forms/validators';
import { AsyncStateObj } from 'libs/models/state';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';
import * as fromPfGridActions from 'libs/features/grids/pf-data-grid/actions';
import { CustomExportType } from 'libs/models/data-views';

import * as fromProjectExportManagerActions from '../actions';
import * as fromPricingProjectActions from 'apps/project/app/_pricing-project/actions';
import * as fromProjectExportManagerReducer from '../reducers';
import { PageViewIds } from '../../shared/constants';

@Component({
  selector: 'pf-project-export-manager',
  templateUrl: './project-export-manager.component.html',
  styleUrls: []
})
export class ProjectExportManagerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() display: 'component' | 'modal' = 'modal';
  @Input() modalTitle: string;
  @Input() openModal = false;
  @Input() modalSize: 'lg' | 'md' | 'sm' = 'md';
  @Input() numRowsToExport: number;

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

  pricingProjectExportFeatureFlag: RealTimeFlag = { key: FeatureFlags.PricingProjectExport, value: false };
  featureFlagUnsubscribe$ = new Subject<void>();

  constructor(private store: Store<fromProjectExportManagerReducer.State>, private formBuilder: FormBuilder,
              private featureFlagService: AbstractFeatureFlagService) {

    this.projectTemplates$ = this.store.select(fromProjectExportManagerReducer.getProjectTemplatesAsync);
    this.featureFlagService.bindEnabled(this.pricingProjectExportFeatureFlag, this.featureFlagUnsubscribe$);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromProjectExportManagerActions.GetProjectTemplates());
    this.dataSourceForm = this.formBuilder.group({
      DataSources: this.formBuilder.array([], PfValidators.required)
    });

    this.dataSources.forEach(dataSource => this.updateFormControl(dataSource));
  }

  ngOnDestroy() {
    this.featureFlagUnsubscribe$.next();
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

    if (this.pricingProjectExportFeatureFlag.value) {
      const additionalData: AdditionalProjectExportData = {
        NumRowsToExport: this.numRowsToExport
      };

      this.store.dispatch(new fromPfGridActions.ExportGrid(PageViewIds.ProjectJobs, 'ProjectSummaryReport', CustomExportType.PricingProject,
        additionalData, true));
    } else {
      this.store.dispatch(new fromPricingProjectActions.QueuePricingProjectExport(modalData));
    }

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
