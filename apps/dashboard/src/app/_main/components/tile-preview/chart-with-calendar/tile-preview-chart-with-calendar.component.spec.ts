import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { combineReducers, Store, StoreModule, ActionsSubject } from '@ngrx/store';
import { Action } from '@ngrx/store/src/models';

import spyOn = jest.spyOn;
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TilePreviewChartWithCalendarComponent } from './tile-preview-chart-with-calendar.component';
import * as fromRootState from '../../../../../../../../libs/state/state';
import * as fromTileGridReducer from '../../../reducers';
import { generateMockTilePreviewChartWithCalendarData, TilePreviewTypes } from '../../../models';
import * as fromClientSettingActions from 'libs/core/actions/client-settings.actions';
import { ClientSettingRequestModel } from 'libs/models/common/client-setting-request.model';
import * as fromTileGridActions from '../../../actions/tile-grid.actions';
import { SAVING_CLIENT_SETTING_SUCCESS } from '../../../../../../../../libs/core/actions/client-settings.actions';

describe('Tile Preview Chart With Calendar', () => {
  let fixture: ComponentFixture<TilePreviewChartWithCalendarComponent>;
  let instance: TilePreviewChartWithCalendarComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          tileGrid: combineReducers(fromTileGridReducer.reducers)
        })
      ],
      declarations: [
        TilePreviewChartWithCalendarComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(TilePreviewChartWithCalendarComponent);
    instance = fixture.componentInstance;
  });

  it('should not show chart without model.component data', () => {
    instance.model = {
      TileId: 1,
      PreviewType: TilePreviewTypes.ChartWithCalendar,
      ChartType: 'test',
      ChartLabel: 'test chart label',
      ComponentData: undefined
    };
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show kendo chart when model.ChartComponentData.length > 0', () => {
    instance.model = getInstanceModel();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch SavingClientSetting when datePickerValueChanged is called', () => {

   instance.model = getInstanceModel();

    const clientSettingRequest = {
      FeatureArea: 'Dashboard', SettingName: 'JobsTileEffectiveDate',
      SettingValue: instance.selectedDate
    } as ClientSettingRequestModel;

    const action = new fromClientSettingActions.SavingClientSetting(JSON.stringify(clientSettingRequest));

    instance.datePickerValueChanged();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call reloadTile on SavingClientSettingSuccess', () => {
    spyOn(instance, 'reloadTile');
    instance.model = getInstanceModel();

    const clientSettingRequest = {
      FeatureArea: 'Dashboard', SettingName: 'JobsTileEffectiveDate',
      SettingValue: instance.selectedDate
    } as ClientSettingRequestModel;


    instance.datePickerValueChanged();
    instance.clientSettingsStore.dispatch(new fromClientSettingActions.SavingClientSettingSuccess(''));

    expect(instance.reloadTile).toHaveBeenCalled();
  });

  it('should dispatch LoadingSingleTile when reloadTile is called', () => {
    instance.model = getInstanceModel();

    const action = new fromTileGridActions.LoadingSingleTile(instance.model.TileId);

    instance.reloadTile();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });


 function getInstanceModel() {
   const categoryName = 'test category';
   const detailKey = 'test detail key';
   const detailValue = 55;
   const selectedDate = new Date('01/01/2010');
   const chartComponentData =
     generateMockTilePreviewChartWithCalendarData(categoryName, 0, selectedDate, detailKey, detailValue);

   return {
     TileId: 1,
     PreviewType: TilePreviewTypes.ChartWithCalendar,
     ChartType: 'test',
     ChartLabel: 'test chart label',
     ComponentData: chartComponentData
   };
  }
});
