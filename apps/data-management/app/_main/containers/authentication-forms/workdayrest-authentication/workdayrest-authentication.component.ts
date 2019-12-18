import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {OrgDataEntityType} from 'libs/constants/hris-api';

import { EntityTypeModel } from '../../../models';

@Component({
  selector: 'pf-workdayrest-authentication',
  templateUrl: './workdayrest-authentication.component.html',
  styleUrls: ['./workdayrest-authentication.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkdayRestAuthenticationComponent implements OnInit, OnChanges {
  @Input() validated = false;
  @Input() selectedEntities: EntityTypeModel[] = [];

  @Output() submitClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();

  private employeeReportUrl = 'employeeReportUrl';
  private jobReportUrl = 'jobReportUrl';
  private paymarketReportUrl = 'paymarketReportUrl';
  private structureReportUrl = 'structureReportUrl';
  private structureMappingReportUrl = 'structureMappingReportUrl';

  enabledControls = [
    { FieldName: this.employeeReportUrl, FieldValue: 'Employee' },
    { FieldName: this.jobReportUrl, FieldValue: 'Job' },
    { FieldName: this.paymarketReportUrl, FieldValue: 'Paymarket' },
    { FieldName: this.structureReportUrl, FieldValue: 'Structure' },
    { FieldName: this.structureMappingReportUrl, FieldValue: 'Structure Mapping' },
  ];

  ctrlVisibility = {
    employeeReportUrl: false
  };
  controlToEntityTypeMap = {
    employeeReportUrl: OrgDataEntityType.Employees,
    jobReportUrl: OrgDataEntityType.Jobs,
    paymarketReportUrl: OrgDataEntityType.PayMarkets,
    structureReportUrl: OrgDataEntityType.Structures,
    structureMappingReportUrl: OrgDataEntityType.StructureMappings
  };

  workdayRestForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.initForm();
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
        if (this.selectedEntities.find(x => x.EntityType === this.controlToEntityTypeMap[key])) {
          ctrl.setValidators([Validators.required, Validators.pattern(/^https:\/\/([a-z0-9_-]+\.)+workday.com\//)]);
          this.ctrlVisibility[key] = true;
        } else {
          ctrl.clearValidators();
          this.ctrlVisibility[key] = false;
        }
        ctrl.updateValueAndValidity();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedEntities && changes.selectedEntities.currentValue && !changes.selectedEntities.isFirstChange()) {
      this.refreshControls();
    }
  }
}
