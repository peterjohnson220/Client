import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { groupBy, GroupResult } from '@progress/kendo-data-query';
import { cloneDeep } from 'lodash';

import { LoaderSettingKeyName } from 'libs/models';

import * as fromPricingLoaderMainReducer from '../../reducers';
import * as fromDefaultSettingsActions from '../../actions/default-settings.actions';
import { MRPFieldConfig, PricingLoaderSetting } from '../../models';

@Component({
  selector: 'pf-default-settings',
  templateUrl: './default-settings.component.html',
  styleUrls: ['./default-settings.component.scss']
})
export class DefaultSettingsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() companyId: number;
  @Output() editSetting: EventEmitter<boolean> = new EventEmitter();

  defaultSettings$: Observable<PricingLoaderSetting[]>;

  defaultSettingsSubscription: Subscription;

  defaultSettings: PricingLoaderSetting[];
  groupedMRPFields: PricingLoaderSetting[] | GroupResult[];
  adjustmentsFields: PricingLoaderSetting[];
  isCollapsed: boolean;
  mrpFieldConfig = MRPFieldConfig;
  private readonly adjustmentsGroupName = 'Adjustments';

  constructor(
    private store: Store<fromPricingLoaderMainReducer.State>
  ) {
    this.defaultSettings$ = this.store.select(fromPricingLoaderMainReducer.getDefaultSettings);
    this.isCollapsed = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.companyId?.firstChange && changes.companyId?.previousValue && !changes.companyId.currentValue) {
      this.store.dispatch(new fromDefaultSettingsActions.ResetDefaultSettingsState());
    }
  }

  ngOnInit(): void {
    this.defaultSettingsSubscription = this.defaultSettings$.subscribe(results => {
      if (!!results?.length) {
        this.defaultSettings = cloneDeep(results);
        const filteredMRPFields = this.defaultSettings.filter(f => f.GroupName !== this.adjustmentsGroupName);
        this.groupedMRPFields = groupBy(filteredMRPFields, [{ field: 'GroupName' }]);
        this.adjustmentsFields = this.defaultSettings.filter(f => f.GroupName === this.adjustmentsGroupName);
      }
    });
  }

  ngOnDestroy(): void {
    this.defaultSettingsSubscription.unsubscribe();
  }

  onEditSetting(): void {
    this.editSetting.emit(true);
  }

  handleNumericValueChange(keyName: LoaderSettingKeyName, defaultValue: number) {
    const updatedSetting: PricingLoaderSetting = this.defaultSettings.find(s => s.KeyName === keyName);
    if (!updatedSetting?.NumericValue) {
      updatedSetting.NumericValue = defaultValue;
    }
    this.store.dispatch(new fromDefaultSettingsActions.UpdateDefaultSetting({ keyName, numericValue: updatedSetting.NumericValue }));
    this.editSetting.emit(false);
  }
}
