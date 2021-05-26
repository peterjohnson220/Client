import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';

import { OrgDataEntityType } from 'libs/constants/hris-api';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core';

import { EntityTypeModel } from '../../../models';

@Component({
  selector: 'pf-workdayrest-authentication',
  templateUrl: './workdayrest-authentication.component.html',
  styleUrls: ['./workdayrest-authentication.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkdayRestAuthenticationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() validated = false;
  @Input() selectedEntities: EntityTypeModel[] = [];
  @Input() waitingForAuthentication = false;

  @Output() submitClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();
  @Output() backClick = new EventEmitter();

  private employeeReportUrl = 'employeeReportUrl';
  private jobReportUrl = 'jobReportUrl';
  private paymarketReportUrl = 'paymarketReportUrl';
  private structureReportUrl = 'structureReportUrl';
  private structureMappingReportUrl = 'structureMappingReportUrl';
  private unsubscribe$ = new Subject<void>();

  enabledControls = [
    { FieldName: this.employeeReportUrl, FieldValue: 'Employees' },
    { FieldName: this.jobReportUrl, FieldValue: 'Jobs' },
    { FieldName: this.paymarketReportUrl, FieldValue: 'Paymarkets' },
    { FieldName: this.structureReportUrl, FieldValue: 'Structures' },
    { FieldName: this.structureMappingReportUrl, FieldValue: 'Structure Mappings' },
  ];

  ctrlVisibility = {
    employeeReportUrl: false
  };
  controlToEntityTypeMap = {
    employeeReportUrl: OrgDataEntityType.Employees,
    jobReportUrl: OrgDataEntityType.Jobs,
    paymarketReportUrl: OrgDataEntityType.PayMarkets,
    structureReportUrl: OrgDataEntityType.Structures,
    structureMappingReportUrl: OrgDataEntityType.StructureMapping
  };

  workdayRestForm: FormGroup;
  submitted = false;

  hrisTestDataBypassFeatureFlag: RealTimeFlag = { key: FeatureFlags.HrisTestDataBypass, value: false };

  constructor(
    private formBuilder: FormBuilder,
    private featureFlagService: AbstractFeatureFlagService,
  ) {
    this.featureFlagService.bindEnabled(this.hrisTestDataBypassFeatureFlag, this.unsubscribe$);
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  onSubmit() {
    this.submitted = true;

    if (this.workdayRestForm.invalid) {
      return;
    }

    this.submitClick.emit(this.workdayRestForm.value);
  }

  cancelAuthenticationClick() {
    this.workdayRestForm.reset();
    this.cancelClick.emit();
  }

  initForm(): void {
    this.workdayRestForm = this.formBuilder.group({
      username: [ '', [Validators.required]],
      password: [ '', Validators.required ],
      employeeReportUrl: [ '' ],
      jobReportUrl: [ '' ],
      paymarketReportUrl: [ '' ],
      structureReportUrl: [ '' ],
      structureMappingReportUrl: [ '' ]
    });
    this.refreshControls();
  }

  refreshControls(): void {
    Object.keys(this.workdayRestForm.controls).forEach(key => {
      const e = this.controlToEntityTypeMap[key];
      if (e) {
        const ctrl = this.workdayRestForm.get(key);
        if (this.selectedEntities.includes(this.controlToEntityTypeMap[key])) {
          this.addValidators(ctrl);
          this.ctrlVisibility[key] = true;
        } else {
          ctrl.clearValidators();
          this.ctrlVisibility[key] = false;
        }
        ctrl.updateValueAndValidity();
      }
    });
  }

  backBtnClick() {
    this.backClick.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedEntities && changes.selectedEntities.currentValue && !changes.selectedEntities.isFirstChange()) {
      this.refreshControls();
    }
  }

  private addValidators(ctrl: AbstractControl) {
    const validatorPattern = this.hrisTestDataBypassFeatureFlag.value ?
      /^[a-z0-9_\-]+$/i :
      /^https:\/\/([a-z0-9_-]+\.)+(my)?workday.com\//;
    ctrl.setValidators([Validators.required, Validators.pattern(validatorPattern)]);
  }
}
