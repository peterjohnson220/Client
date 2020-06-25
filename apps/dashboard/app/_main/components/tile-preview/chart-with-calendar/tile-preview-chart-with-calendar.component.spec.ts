import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import spyOn = jest.spyOn;

import { TilePreviewChartWithCalendarComponent } from './tile-preview-chart-with-calendar.component';
import * as fromRootState from 'libs/state/state';
import * as fromTileGridReducer from '../../../reducers';
import { generateMockTilePreviewChartWithCalendarData, TilePreviewTypes } from '../../../models';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';
import { SaveUiPersistenceSettingRequest } from 'libs/models/common/save-ui-persistence-setting-request.model';
import * as fromTileGridActions from '../../../actions/tile-grid.actions';
import { GenericKeyValue, GenericNameValueDto } from 'libs/models/common';


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

    store = TestBed.inject(Store);
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

  it('should dispatch SavingUiPersistenceSetting when datePickerValueChanged is called', () => {
   instance.model = getInstanceModel();

    const clientSettingRequest = {
      FeatureArea: 'Dashboard', SettingName: 'JobsTileEffectiveDate',
      SettingValue: instance.selectedDate
    } as SaveUiPersistenceSettingRequest;

    const action = new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting(clientSettingRequest);

    instance.datePickerValueChanged();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call reloadTile on SavingUiPersistenceSettingSuccess', () => {
    spyOn(instance, 'reloadTile');
    instance.model = getInstanceModel();
    instance.datePickerValueChanged();
    const clientSettingRequest = {
      FeatureArea: 'Dashboard', SettingName: 'JobsTileEffectiveDate',
      SettingValue: instance.selectedDate
    } as SaveUiPersistenceSettingRequest;

    instance.store.dispatch(new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting(clientSettingRequest));

    const successResponse = [{
      Key: 'JobsTileEffectiveDate',
      Value: instance.selectedDate
    }] as GenericKeyValue<string, string>[];

    instance.store.dispatch(new fromUiPersistenceSettingsActions.SaveUiPersistenceSettingSuccess([{ FeatureName: 'feature', Settings: successResponse }]));

    expect(instance.reloadTile).toHaveBeenCalled();
  });

  it('should dispatch LoadingSingleTile when reloadTile is called', () => {
    instance.model = getInstanceModel();

    const action = new fromTileGridActions.LoadingSingleTile(instance.model.TileId);

    instance.reloadTile();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it ('should dispatch SaveUiPersistenceSetting when setShouldGetPricingsBeforeEffectiveDate is called', () => {
    instance.model = getInstanceModel();

    const clientSettingRequest = {
      FeatureArea: 'Dashboard', SettingName: 'JobsTileShouldGetPricingsBeforeEffectiveDate',
      SettingValue: 'true'
    } as SaveUiPersistenceSettingRequest;

    const action = new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting(clientSettingRequest);

    instance.setShouldGetPricingsBeforeEffectiveDate(true);
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
