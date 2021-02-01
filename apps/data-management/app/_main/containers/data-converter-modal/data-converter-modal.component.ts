import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { ImportDataType } from 'libs/constants';
import { ConverterSettings } from 'libs/models';

import * as fromDataConverterActions from '../../actions/converter-settings.actions';
import * as fromFieldMappingReducer from '../../reducers';
import { ConverterSettingsHelper } from '../../helpers';

@Component({
  selector: 'pf-data-converter-modal',
  templateUrl: './data-converter-modal.component.html',
  styleUrls: ['./data-converter-modal.component.scss']
})
export class DataConverterModalComponent implements OnInit, OnDestroy {
  showDataConverterModal$: Observable<boolean>;
  dataConverterModalInfo$: Observable<any>;
  converterSettings$: Observable<ConverterSettings[]>;

  dataConverterModalInfoSubscription: Subscription;
  converterSettingsSubscription: Subscription;

  converterSettings: ConverterSettings[];
  selectedConverterSetting: ConverterSettings;

  fieldName = '';
  provider = '';
  entityType = '';
  selectedDateFormat = '';
  titleName = '';
  dataType = '';
  connectionId: number;
  fieldMappingValues = [];

  constructor(private store: Store<fromFieldMappingReducer.State>) {
  }

  ngOnInit() {
    this.showDataConverterModal$ = this.store.select(fromFieldMappingReducer.isDataConverterModalOpen);
    this.dataConverterModalInfo$ = this.store.select(fromFieldMappingReducer.getDataConverterModalInfo);
    this.converterSettings$ = this.store.select(fromFieldMappingReducer.getConverterSettings);

    this.converterSettingsSubscription = this.converterSettings$.subscribe(v => {
      if (v) {
        this.converterSettings = v;
      }
    });

    this.dataConverterModalInfoSubscription = this.dataConverterModalInfo$.subscribe(v => {
      if (v) {
        this.connectionId = v.connectionId;
        this.fieldName = v.fieldName;
        this.provider = v.provider;
        this.entityType = v.entityType;
        this.dataType = v.dataType;
        this.selectedConverterSetting = this.getCurrentlySelectedSettings(v);

        if (v.dataType === ImportDataType[ImportDataType.Date] || v.dataType === ImportDataType[ImportDataType.DateTime]) {
          this.titleName = 'Select Date Format';
          if (this.selectedConverterSetting) {
            this.selectedDateFormat = this.selectedConverterSetting.options.DateTimeFormat;
          } else {
            this.selectedDateFormat = 'Select format for date fields';
          }
        } else {
          this.titleName =  'Translate Field Data';
          this.fieldMappingValues = ConverterSettingsHelper.mapConvertedFields(this.fieldName, this.selectedConverterSetting);
        }

      } else {
        this.fieldName = null;
        this.provider = null;
        this.entityType = null;
        this.selectedDateFormat = null;
        this.titleName = null;
        this.dataType = null;
        this.fieldMappingValues = [];
      }
    });
  }

  ngOnDestroy() {
    this.converterSettingsSubscription.unsubscribe();
    this.dataConverterModalInfoSubscription.unsubscribe();
  }

  saveDataConverterModal(converterSetting: ConverterSettings) {
    if (converterSetting) {
      if (!converterSetting.connection_ID) {
        converterSetting.connection_ID = this.connectionId;
      }
      this.store.dispatch(new fromDataConverterActions.AddConverterSetting({converterSetting: converterSetting}));
    }
    this.store.dispatch(new fromDataConverterActions.OpenDataConverterModal({open: false, modalInfo: null}));
  }

  closeDataConverterModal() {
    this.store.dispatch(new fromDataConverterActions.OpenDataConverterModal({open: false, modalInfo: null}));
  }

  private getCurrentlySelectedSettings(modalInfo: any) {
    let currentConverterSetting;
    if (this.converterSettings.some(setting => setting.connection_ID === modalInfo.connectionId && setting.fieldName === modalInfo.fieldName)) {
      /// per connection field level setting
      currentConverterSetting = this.converterSettings.find(setting => setting.connection_ID === modalInfo.connectionId &&
        setting.fieldName === modalInfo.fieldName &&
        setting.dataType === modalInfo.dataType &&
        setting.entityType === modalInfo.entityType);
    } else if (this.converterSettings.some(setting => setting.connection_ID === modalInfo.connectionId && setting.fieldName === null)) {
      /// per connection global level setting
      currentConverterSetting = this.converterSettings.find(setting => setting.connection_ID === modalInfo.connectionId &&
        setting.fieldName === null &&
        setting.dataType === modalInfo.dataType &&
        setting.entityType === modalInfo.entityType);
    } else {
      // global data type setting
      currentConverterSetting = this.converterSettings.find(setting => setting.connection_ID === null &&
          setting.fieldName === null &&
          setting.dataType === modalInfo.dataType &&
          setting.entityType === modalInfo.entityType);
    }
    return currentConverterSetting;
  }
}
