import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';


import { RateType } from 'libs/data/data-sets';
import { CompanySettingsEnum } from 'libs/models/company';
import { RoundingSettingsDataObj } from 'libs/models/structures';
import { SettingsService } from 'libs/state/app-context/services';
import { DataViewFilter } from 'libs/models/payfactors-api';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { RangeType } from 'libs/constants/structures/range-type';
import { RangeRecalculationType } from 'libs/constants/structures/range-recalculation-type';
import { AbstractFeatureFlagService, FeatureFlags, PermissionService, RealTimeFlag } from 'libs/core/services';

import * as fromRangeFieldActions from '../../actions/range-field-edit.actions';

@Component({
  selector: 'pf-range-field-editor',
  templateUrl: './range-field-editor.component.html',
  styleUrls: ['./range-field-editor.component.scss']
})
export class RangeFieldEditorComponent implements OnInit, OnDestroy, OnChanges {
  // The PageViewId of the pf-data-grid this editor is on
  @Input() pageViewId: string;

  // The type of range (Job, Grade), this will control editable state currently
  @Input() rangeType: RangeType;

  // Is the midpoint for a 'current' structure. This will control editable state along with company settings.
  @Input() currentStructure: boolean;

  // Optional rounding settings to be applied to the range values upon changing the mid
  @Input() roundingSettings: RoundingSettingsDataObj;

  // The filter to get the updated data row upon success of the field being updated.
  @Input() refreshRowDataViewFilter: DataViewFilter;

  // Alignment of the field value in the textbox
  @Input() textAlign: 'left' | 'right' | 'center' = 'left';

  // A callback function which will be invoked when the update of the midpoint has succeeded. It will be passed
  // an instance of the store and an optional metainfo object.
  @Input() updateSuccessCallbackFn: any;

  // Additional meta info to pass to the updateSuccessCallbackFn
  @Input() updateMetaInfo: any;

  // A template formatting how to display the field value. It will be passed the data row and
  @Input() readonlyValueTemplate: TemplateRef<any>;

  // Truncate annual values to one decimal place upon blur. Ex. 65678 would become 65.7
  @Input() truncateAnnualValueDisplay: boolean;

  @Input() noRounding: true | false = false;
  @Input() reloadGridData = false;
  @Input() minValue = 1;
  @Input() maxValue = 999999999999999;

  // Row information
  @Input() rangeGroupId: number;
  @Input() rangeId: number;
  @Input() rate: string;
  @Input() fieldValue: number;
  @Input() dataRow: any;
  @Input() rowIndex: number;
  @Input() fieldName: string;
  @Input() rangeRecalculationType: RangeRecalculationType;
  @Input() isJobPage: boolean;
  @ViewChild('rangeField') public rangeFieldElement: ElementRef;

  canEditCurrentStructureRanges: boolean;
  value: number;
  focused: boolean;
  hasCanCreateEditModelStructurePermission: boolean;
  hasCanEditPublishedStructureRanges: boolean;
  unsubscribe$ = new Subject<void>();
  gradeBasedRangeGroupLandingPageFlag: RealTimeFlag = { key: FeatureFlags.StructuresGradeBasedRangeLandingPage, value: false };

  get editable() {
    let isEditable = false;
    if (this.rangeType === RangeType.Job) {
      isEditable = this.determineEditability();
    } else if (this.rangeType === RangeType.Grade) {
      isEditable = this.determineEditability() && this.gradeBasedRangeGroupLandingPageFlag.value;
    }
    return isEditable;
  }

  private determineEditability() {
    return this.hasCanCreateEditModelStructurePermission && this.currentStructure ?
      this.canEditCurrentStructureRanges && this.hasCanEditPublishedStructureRanges : true;
  }

  get format() {
    let format = 'n0';

    if (this.rate === RateType.Annual && this.truncateAnnualValueDisplay && !this.noRounding) {
      format = 'n1';
    } else if (this.rate === RateType.Hourly || this.noRounding) {
      format = 'n2';
    }

    return format;
  }

  get decimals() {
    return this.rate === RateType.Annual && this.focused ? 0 : 2;
  }

  constructor(
    private store: Store<any>,
    private settingsService: SettingsService,
    private permissionService: PermissionService,
    private featureFlagService: AbstractFeatureFlagService
  ) {

    this.settingsService.selectCompanySetting<boolean>(CompanySettingsEnum.CanEditCurrentStructureRanges)
    .subscribe(s => {
      if(!!s) {
        this.canEditCurrentStructureRanges = s;
      }
    });

    this.hasCanCreateEditModelStructurePermission = this.permissionService.CheckPermission([Permissions.STRUCTURES_CREATE_EDIT_MODEL],
      PermissionCheckEnum.Single);
    this.hasCanEditPublishedStructureRanges = this.permissionService.CheckPermission([Permissions.STRUCTURES_PUBLISH],
      PermissionCheckEnum.Single);
    this.featureFlagService.bindEnabled(this.gradeBasedRangeGroupLandingPageFlag, this.unsubscribe$);
  }

  handleFocus() {
    this.focused = true;
    this.value = this.fieldValue;
    this.rangeFieldElement['placeholder'] = '';
  }

  handleBlur() {
    this.focused = false;
    this.value = this.formatNumber(this.value);
    this.rangeFieldElement['placeholder'] = '--';
  }

  handleValueChange(event: any, index: number) {
    // kendo should be ensuring that only numbers make it this far
    const targetValue = parseFloat(event.target.value);

    if (Number.isNaN(targetValue)) {
      this.rangeFieldElement['value'] = this.fieldValue;
      return;
    }

    // we got this far, consider it valid. construct the payload and dispatch the action
    const payload = {
      pageViewId: this.pageViewId,
      rangeId: this.rangeId,
      rangeGroupId: this.rangeGroupId,
      rowIndex: index,
      fieldValue: targetValue,
      fieldName: this.fieldName,
      rangeRecalculationType: this.rangeRecalculationType,
      roundingSettings: this.roundingSettings,
      refreshRowDataViewFilter: this.refreshRowDataViewFilter,
      metaInfo: this.updateMetaInfo,
      successCallBackFn: this.updateSuccessCallbackFn,
      rangeType: this.rangeType,
      reloadGridData: this.reloadGridData
    };

    // TODO - we really should be just persisting rounding settings rather than passing every time, but that is coming later.
    this.store.dispatch(new fromRangeFieldActions.UpdateRangeField(payload));

    this.value = targetValue;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.fieldValue && !!changes.fieldValue.currentValue) {
      this.value = this.formatNumber(changes.fieldValue.currentValue);
    }
    if (!!changes.dataRow && changes.dataRow.currentValue !== changes.dataRow.previousValue) {
      this.value = this.formatNumber(this.fieldValue);
    }
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  private formatNumber(value: number) {
    if (this.rate === RateType.Annual && this.truncateAnnualValueDisplay) {
      return value / 1000;
    } else {
      return value;
    }
  }


}
