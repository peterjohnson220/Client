import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';

import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromDashboardsActions from '../../actions/dashboards.actions';
import * as fromDataViewActions from '../../actions/data-view.actions';

import { DashboardsHeaderComponent } from './dashboards-header.component';
import { DashboardView, generateMockSaveUserWorkbookModalData } from '../../models';

describe('Data Insights - Dashboards Comopnent', () => {
  let instance: DashboardsHeaderComponent;
  let fixture: ComponentFixture<DashboardsHeaderComponent>;
  let store: Store<fromDataInsightsMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers),
        }),
        DropDownsModule
      ],
      declarations: [ DashboardsHeaderComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SettingsService, useClass: SettingsService }
      ]
    });

    fixture = TestBed.createComponent(DashboardsHeaderComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

    fixture.detectChanges();
  });

  it('should emit selectedDashboardViewChanged with correct selected view', () => {
    const view = DashboardView.All;
    spyOn(instance.selectedDashboardViewChanged, 'emit');

    instance.handleViewChanged(view);

    expect(instance.selectedDashboardViewChanged.emit).toHaveBeenCalledWith(view);
  });

  it('should dispatch SaveUserReport action with save user report view clicked', () => {
    const workbookData = generateMockSaveUserWorkbookModalData();
    const expectedAction = new fromDataViewActions.SaveUserReport(workbookData);
    spyOn(store, 'dispatch');

    instance.handleSaveUserDataViewClicked(workbookData);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
