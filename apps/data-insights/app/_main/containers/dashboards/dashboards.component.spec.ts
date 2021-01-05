import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { DragulaModule } from 'ng2-dragula';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';
import { generateMockWorkbook } from 'libs/features/surveys/reports/models';

import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromDashboardsActions from '../../actions/dashboards.actions';
import { DashboardsComponent } from './dashboards.component';
import { SaveWorkbookTagObj, generateMockSaveWorkbookTagObj, DashboardView } from '../../models';

describe('Data Insights - Dashboards Comopnent', () => {
  let instance: DashboardsComponent;
  let fixture: ComponentFixture<DashboardsComponent>;
  let store: Store<fromDataInsightsMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers),
        }),
        DragulaModule.forRoot(),
        DropDownsModule
      ],
      declarations: [ DashboardsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SettingsService, useClass: SettingsService }
      ]
    });

    fixture = TestBed.createComponent(DashboardsComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('anyFavorites should returns true when there is a favorite workbook', () => {
    const workbook = {...generateMockWorkbook(), IsFavorite: true};
    instance.filteredCompanyWorkbooks = [workbook];

    expect(instance.anyFavorites).toEqual(true);
  });

  it('anyFavorites should returns false when there is none favorite workbooks', () => {
    const workbook = generateMockWorkbook();
    instance.filteredCompanyWorkbooks = [workbook];

    expect(instance.anyFavorites).toEqual(false);
  });

  it('should dispatch SaveWorkbookTag when handling save tag clicked', () => {
    const saveObj: SaveWorkbookTagObj = generateMockSaveWorkbookTagObj();
    const expectedAction = new fromDashboardsActions.SaveWorkbookTag(saveObj);
    spyOn(store, 'dispatch');

    instance.handleSaveTagClicked(saveObj);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch SetDashboardView with correct dashboard view', () => {
    const dashboardViewSettingValue = 'Favorites';
    const expectedAction = new fromDashboardsActions.SetDashboardView(DashboardView.Favorites);
    spyOn(store, 'dispatch');

    instance.handleDashboardViewSettingChanged(dashboardViewSettingValue);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch SetDashboardView with default dashboard view if the setting value does not match', () => {
    const dashboardViewSettingValue = 'Random View';
    const expectedAction = new fromDashboardsActions.SetDashboardView(DashboardView.All);
    spyOn(store, 'dispatch');

    instance.handleDashboardViewSettingChanged(dashboardViewSettingValue);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
