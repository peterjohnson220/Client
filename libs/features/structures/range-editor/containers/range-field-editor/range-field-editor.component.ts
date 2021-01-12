import { Component, Input, TemplateRef, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { RateType } from 'libs/data/data-sets';
import { CompanySettingsEnum } from 'libs/models/company';
import { RoundingSettingsDataObj, RangeGroupMetadata } from 'libs/models/structures';
import { SettingsService } from 'libs/state/app-context/services';
import { DataViewFilter } from 'libs/models/payfactors-api';
import { RangeGroupType } from 'libs/constants/structures/range-group-type';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { PermissionService } from 'libs/core/services';

import * as fromRangeFieldActions from '../../actions/range-field-edit.actions';
import * as fromSharedStructuresReducer from '../../../../../../apps/structures/app/shared/reducers';

@Component({
  selector: 'pf-range-field-editor',
  templateUrl: './range-field-editor.component.html',
  styleUrls: ['./range-field-editor.component.scss']
})
export class RangeFieldEditorComponent implements OnInit, OnDestroy, OnChanges {
  // The PageViewId of the pf-data-grid this editor is on
  @Input() pageViewId: string;

  // The type of range group (Job, Grade), this will control editable state currently
  @Input() rangeGroupType: RangeGroupType;

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

  // Row information
  @Input() rangeGroupId: number;
  @Input() rangeId: number;
  @Input() rate: string;
  @Input() fieldValue: number;
  @Input() dataRow: any;
  @Input() rowIndex: number;
  @Input() fieldName: string;
  @Input() isMid: boolean;
  @Input() isJobPage: boolean;
  @ViewChild('rangeField') public rangeFieldElement: ElementRef;

  canEditCurrentStructureRanges: boolean;
  value: number;
  focused: boolean;
  hasCanCreateEditModelStructurePermission: boolean;
  isCurrent: boolean;
  hasCanEditPublishedStructureRanges: boolean;
  metadata$: Observable<RangeGroupMetadata>;

  metadataSub: Subscription;

  get editable() {
    let isEditable = false;
    if (this.rangeGroupType === RangeGroupType.Job) {
      isEditable = this.isCurrent || this.isJobPage ?  (this.hasCanCreateEditModelStructurePermission &&
        this.rangeGroupType === RangeGroupType.Job &&
        ((this.currentStructure && this.canEditCurrentStructureRanges) || !this.currentStructure) &&
        this.hasCanEditPublishedStructureRanges)
        :
        (this.hasCanCreateEditModelStructurePermission &&
          this.rangeGroupType === RangeGroupType.Job &&
          ((this.currentStructure && this.canEditCurrentStructureRanges) || !this.currentStructure));
    } else if (this.rangeGroupType === RangeGroupType.Grade) {
      isEditable = this.isCurrent ? (this.hasCanCreateEditModelStructurePermission &&
      this.rangeGroupType === RangeGroupType.Grade &&
        ((this.currentStructure && this.canEditCurrentStructureRanges) || !this.currentStructure) &&
      this.hasCanEditPublishedStructureRanges)
        :
        (this.hasCanCreateEditModelStructurePermission &&
          this.rangeGroupType === RangeGroupType.Grade &&
          ((this.currentStructure && this.canEditCurrentStructureRanges) || !this.currentStructure));
    }
    return isEditable;
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
    public jobBasedRangeStore: Store<fromSharedStructuresReducer.State>,
    private settingsService: SettingsService,
    private permissionService: PermissionService
  ) {
    this.settingsService.selectCompanySetting<boolean>(CompanySettingsEnum.CanEditCurrentStructureRanges)
      .subscribe(s => this.canEditCurrentStructureRanges = s);
    this.hasCanCreateEditModelStructurePermission = this.permissionService.CheckPermission([Permissions.STRUCTURES_CREATE_EDIT_MODEL],
      PermissionCheckEnum.Single);
    this.hasCanEditPublishedStructureRanges = this.permissionService.CheckPermission([Permissions.STRUCTURES_PUBLISH],
      PermissionCheckEnum.Single);

    this.metadata$ = this.jobBasedRangeStore.pipe(select(fromSharedStructuresReducer.getMetadata));
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
      isMid: this.isMid,
      roundingSettings: this.roundingSettings,
      refreshRowDataViewFilter: this.refreshRowDataViewFilter,
      metaInfo: this.updateMetaInfo,
      successCallBackFn: this.updateSuccessCallbackFn
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
    if (!this.isJobPage) {
      this.metadataSub = this.metadata$.subscribe(metadata => {
        if (metadata) {
          this.isCurrent = metadata.IsCurrent;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.metadataSub?.unsubscribe();
  }

  private formatNumber(value: number) {
    if (this.rate === RateType.Annual && this.truncateAnnualValueDisplay) {
      return value / 1000;
    } else {
      return value;
    }
  }
}
