import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { DragulaModule } from 'ng2-dragula';

import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';

import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromDashboardsActions from '../../actions/dashboards.actions';
import { DashboardsComponent } from './dashboards.component';
import { generateMockWorkbook, DashboardView } from '../../models';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

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
    store = TestBed.get(Store);

    fixture.detectChanges();
  });

  it('should dispatch AddWorkbookFavorite action when a workbook is marked as favorite', () => {
    const workbook = generateMockWorkbook();
    const expectedAction = new fromDashboardsActions.AddWorkbookFavorite({ workbookId: workbook.WorkbookId });
    spyOn(store, 'dispatch');

    instance.handleFavoriteClicked(workbook);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch RemoveWorkbookFavorite action when a workbook is unmarked as favorite', () => {
    const workbook = {...generateMockWorkbook(), IsFavorite: true};
    const expectedAction = new fromDashboardsActions.RemoveWorkbookFavorite({ workbookId: workbook.WorkbookId });
    spyOn(store, 'dispatch');

    instance.handleFavoriteClicked(workbook);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch ToggleDashboardView action with correct selected view', () => {
    const view = DashboardView.All;
    const expectedAction = new fromDashboardsActions.ToggleDashboardView({ view });
    spyOn(store, 'dispatch');

    instance.handleViewChanged(view);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
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
});
